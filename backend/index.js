const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const ExcelJS = require("exceljs");

const db = require("./db");
const fetchGemBids = require("./fetchGemBids");

const app = express();
app.use(cors());
app.use(express.json());

async function saveSnapshot(source) {
  const bids = await fetchGemBids();
  if (bids.length === 0) return false;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO bids
    (bid_no, buyer, category, price, url, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    bids.forEach(b =>
      insert.run(b.bid_no, b.buyer, b.category, b.price, b.url, now)
    );
  });

  tx();

  db.prepare(`
    INSERT OR REPLACE INTO meta (key, value)
    VALUES ('lastUpdated', ?)
  `).run(now);

  console.log(`[${source}] Stored ${bids.length} bids`);
  return true;
}

/* Daily snapshot */
cron.schedule("0 3 * * *", () => saveSnapshot("CRON"));

/* APIs */
app.get("/api/bids", (req, res) => {
  const rows = db.prepare(`SELECT * FROM bids ORDER BY price ASC`).all();
  res.json(rows);
});

app.get("/api/status", (req, res) => {
  const count = db.prepare(`SELECT COUNT(*) c FROM bids`).get().c;
  const lastUpdated = db.prepare(`
    SELECT value FROM meta WHERE key='lastUpdated'
  `).get()?.value;

  res.json({ total: count, lastUpdated });
});

app.post("/api/refresh", async (req, res) => {
  const ok = await saveSnapshot("MANUAL");
  res.json({
    message: ok
      ? "Snapshot updated"
      : "GeM blocked. Showing last available data."
  });
});

app.get("/api/bids/excel", async (req, res) => {
  const bids = db.prepare(`SELECT * FROM bids`).all();
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("GeM Bids");

  ws.columns = [
    { header: "Bid No", key: "bid_no", width: 25 },
    { header: "Buyer", key: "buyer", width: 40 },
    { header: "Category", key: "category", width: 20 },
    { header: "Price", key: "price", width: 15 },
    { header: "URL", key: "url", width: 40 }
  ];

  bids.forEach(b => ws.addRow(b));
  res.setHeader("Content-Disposition", "attachment; filename=gem_bids.xlsx");
  await wb.xlsx.write(res);
  res.end();
});

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
