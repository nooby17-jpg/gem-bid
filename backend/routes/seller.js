const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* CREATE BID */
router.post("/bid", auth("SELLER"), (req, res) => {
  const b = req.body;

  db.prepare(`
    INSERT INTO gem_bids
    (sl_no, bid_no, ra_no, item_title, department_name,
     department_address, state, start_date, end_date,
     status, gem_url, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?)
  `).run(
    Date.now(),
    b.bid_no,
    b.ra_no,
    b.item_title,
    b.department_name,
    b.department_address,
    b.state,
    b.start_date,
    b.end_date,
    b.gem_url,
    req.user.id,
    new Date().toISOString()
  );

  res.json({ message: "Bid created" });
});

/* MY BIDS */
router.get("/my-bids", auth("SELLER"), (req, res) => {
  const bids = db.prepare(`
    SELECT * FROM gem_bids WHERE created_by = ?
    ORDER BY created_at DESC
  `).all(req.user.id);

  res.json(bids);
});

module.exports = router;
