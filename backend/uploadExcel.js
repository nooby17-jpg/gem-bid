const XLSX = require("xlsx");
const db = require("./db");

function excelDateToISO(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  const epoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(epoch.getTime() + v * 86400000)
    .toISOString()
    .split("T")[0];
}

module.exports = function uploadExcel(path, userId) {
  const wb = XLSX.readFile(path);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

  let sl = (db.prepare("SELECT MAX(sl_no) m FROM gem_bids").get().m || 0) + 1;

  const stmt = db.prepare(`
    INSERT INTO gem_bids
    (sl_no,bid_no,ra_no,item_title,department_name,department_address,state,
     start_date,end_date,status,gem_url,created_by,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  rows.forEach(r => {
    stmt.run(
      sl++,
      r["Bid No"],
      r["RA No"] || "",
      r["Item Title"],
      r["Department Name"],
      r["Department Address"],
      r["State"],
      excelDateToISO(r["Start Date"]),
      excelDateToISO(r["End Date"]),
      "ACTIVE",
      r["GeM URL"],
      userId,
      new Date().toISOString()
    );
  });
};
