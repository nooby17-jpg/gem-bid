const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* FILE STORAGE */
const excelUpload = multer({ dest: "uploads/excel/" });
const pdfUpload = multer({ dest: "uploads/pdf/" });

/* DASHBOARD STATS */
router.get("/stats", auth("ADMIN"), (req, res) => {
  const totalBids = db.prepare(
    "SELECT COUNT(*) as c FROM gem_bids"
  ).get().c;

  const totalUsers = db.prepare(
    "SELECT COUNT(*) as c FROM users"
  ).get().c;

  const activeBids = db.prepare(
    "SELECT COUNT(*) as c FROM gem_bids WHERE status = 'ACTIVE'"
  ).get().c;

  res.json({ totalBids, totalUsers, activeBids });
});

/* LIST ALL BIDS */
router.get("/bids", auth("ADMIN"), (req, res) => {
  const bids = db.prepare(`
    SELECT * FROM gem_bids
    ORDER BY created_at DESC
  `).all();

  res.json(bids);
});

/* BULK EXCEL UPLOAD */
router.post(
  "/upload/excel",
  auth("ADMIN"),
  excelUpload.single("file"),
  (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const insert = db.prepare(`
      INSERT INTO gem_bids
      (sl_no, bid_no, ra_no, item_title, department_name,
       department_address, state, start_date, end_date,
       status, gem_url, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    const tx = db.transaction((rows) => {
      rows.forEach((r, idx) => {
        insert.run(
          idx + 1,
          r["Bid No"],
          r["RA No"],
          r["Item Title"],
          r["Department Name"],
          r["Department Address"],
          r["State"],
          r["Start Date"],
          r["End Date"],
          "ACTIVE",
          r["GeM URL"],
          req.user.id,
          now
        );
      });
    });

    tx(rows);
    res.json({ inserted: rows.length });
  }
);

/* UPLOAD PDF FOR BID */
router.post(
  "/upload/pdf/:bidId",
  auth("ADMIN"),
  pdfUpload.single("file"),
  (req, res) => {
    db.prepare(`
      INSERT INTO bid_documents
      (bid_id, file_name, file_path, uploaded_by, uploaded_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      req.params.bidId,
      req.file.originalname,
      req.file.path,
      req.user.id,
      new Date().toISOString()
    );

    res.json({ message: "PDF uploaded" });
  }
);

module.exports = router;
