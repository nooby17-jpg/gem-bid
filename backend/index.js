const express = require("express");
const cors = require("cors");
const ExcelJS = require("exceljs");
const cron = require("node-cron");
const fetchGemBids = require("./fetchGemBids");

const app = express();
app.use(cors());
app.use(express.json());

let bids = [];

// Initial load
async function loadBids() {
  bids = await fetchGemBids();
  console.log("Fetched bids:", bids.length);
}
loadBids();

// Cron: 8 AM & 8 PM
cron.schedule("0 8,20 * * *", async () => {
  console.log("⏰ Cron refresh");
  await loadBids();
});

// Status
app.get("/api/status", (req, res) => {
  res.json({
    available: bids.length > 0,
    totalBids: bids.length,
    lastUpdated: new Date()
  });
});

// Bids (category filter only – state is UX level)
app.get("/api/bids", (req, res) => {
  const { category } = req.query;
  let result = [...bids];

  if (category) {
    result = result.filter(b =>
      b.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  res.json(result);
});

// L1 comparison
app.post("/api/bids/compare", (req, res) => {
  const { bidNos } = req.body;
  const selected = bids.filter(b => bidNos.includes(b.bid_no));

  selected.sort((a, b) => a.unit_price - b.unit_price);
  const l1 = selected[0]?.bid_no;

  res.json(
    selected.map(b => ({ ...b, l1: b.bid_no === l1 }))
  );
});

// Excel export
app.get("/api/bids/excel", async (req, res) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Desktop L1");

  ws.columns = [
    { header: "Bid No", key: "bid_no", width: 25 },
    { header: "Buyer", key: "buyer", width: 30 },
    { header: "Category", key: "category", width: 20 },
    { header: "Price", key: "unit_price", width: 15 },
    { header: "L1", key: "l1", width: 10 }
  ];

  const sorted = [...bids].sort((a, b) => a.unit_price - b.unit_price);
  const l1 = sorted[0]?.bid_no;

  bids.forEach(b => {
    ws.addRow({
      ...b,
      l1: b.bid_no === l1 ? "YES" : ""
    });
  });

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=desktop_l1.xlsx"
  );
  await wb.xlsx.write(res);
  res.end();
});

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
