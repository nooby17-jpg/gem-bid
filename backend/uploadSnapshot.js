const XLSX = require("xlsx");
const fs = require("fs");
const db = require("./db");

function parseAndStore(filePath, source) {
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const insert = db.prepare(`
    INSERT OR IGNORE INTO bids
    (bid_id, title, buyer, state, category, end_date, url, source, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  let count = 0;

  const tx = db.transaction(() => {
    rows.forEach(r => {
      if (!r["Bid ID"] || !r["Title"]) return;

      insert.run(
        r["Bid ID"],
        r["Title"],
        r["Buyer"] || "",
        r["State"] || "India",
        r["Category"] || "",
        r["End Date"] || "",
        r["URL"] || "",
        source,
        now
      );
      count++;
    });
  });

  tx();

  db.prepare(`
    INSERT INTO snapshots (source, uploaded_at, records)
    VALUES (?, ?, ?)
  `).run(source, now, count);

  fs.unlinkSync(filePath);
  return count;
}

module.exports = parseAndStore;
