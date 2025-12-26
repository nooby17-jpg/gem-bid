const db = require("./db");

const seedBids = [
  {
    bid_no: "GEM/2025/B/100001",
    buyer: "Education Department, Maharashtra",
    category: "Desktop Computer",
    price: 45200,
    url: "https://bidplus.gem.gov.in",
    fetched_at: new Date().toISOString()
  },
  {
    bid_no: "GEM/2025/B/100002",
    buyer: "IT Department, Delhi",
    category: "Desktop Computer",
    price: 46800,
    url: "https://bidplus.gem.gov.in",
    fetched_at: new Date().toISOString()
  }
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO bids
  (bid_no, buyer, category, price, url, fetched_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

seedBids.forEach(b =>
  insert.run(b.bid_no, b.buyer, b.category, b.price, b.url, b.fetched_at)
);

console.log("Seed data inserted");
