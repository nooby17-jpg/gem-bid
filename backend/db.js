const Database = require("better-sqlite3");

const db = new Database("bids.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS bids (
    bid_no TEXT PRIMARY KEY,
    buyer TEXT,
    category TEXT,
    price INTEGER,
    url TEXT,
    fetched_at TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`).run();

module.exports = db;
