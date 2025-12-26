const express = require("express");
const cors = require("cors");
const multer = require("multer");
const ExcelJS = require("exceljs");

const db = require("./db");
const parseAndStore = require("./uploadSnapshot");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

/* Upload snapshot */
app.post("/api/upload", upload.single("file"), (req, res) => {
  const source = req.body.source;
  if (!req.file || !source) {
    return res.status(400).json({ error: "File and source required" });
  }

  const records = parseAndStore(req.file.path, source);

  res.json({ records });
});
app.get("/api/snapshots", (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM snapshots ORDER BY uploaded_at DESC
  `).all();
  res.json(rows);
});
app.post("/api/alerts", (req, res) => {
  const { keyword, state, source, email } = req.body;

  db.prepare(`
    INSERT INTO alerts (keyword, state, source, email, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(keyword, state, source, email, new Date().toISOString());

  res.json({ message: "Alert saved" });
});

app.get("/api/bids", (req, res) => {
  const { q, source, state, category } = req.query;

  let sql = `SELECT * FROM bids WHERE 1=1`;
  const params = [];

  if (q) {
    sql += ` AND (title LIKE ? OR buyer LIKE ?)`;
    params.push(`%${q}%`, `%${q}%`);
  }

  if (source && source !== "ALL") {
    sql += ` AND source = ?`;
    params.push(source);
  }

  if (state && state !== "ALL") {
    sql += ` AND state = ?`;
    params.push(state);
  }

  if (category && category !== "ALL") {
    sql += ` AND category LIKE ?`;
    params.push(`%${category}%`);
  }

  sql += ` ORDER BY fetched_at DESC`;

  res.json(db.prepare(sql).all(...params));
});



/* Excel export */
app.get("/api/bids/excel", async (req, res) => {
  const bids = db.prepare(`SELECT * FROM bids`).all();
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Indian Tenders");

  ws.columns = [
    { header: "Bid ID", key: "bid_id", width: 25 },
    { header: "Title", key: "title", width: 40 },
    { header: "Buyer", key: "buyer", width: 35 },
    { header: "State", key: "state", width: 15 },
    { header: "End Date", key: "end_date", width: 15 },
    { header: "Source", key: "source", width: 10 },
    { header: "URL", key: "url", width: 40 }
  ];

  bids.forEach(b => ws.addRow(b));

  res.setHeader("Content-Disposition", "attachment; filename=indian_tenders.xlsx");
  await wb.xlsx.write(res);
  res.end();
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
