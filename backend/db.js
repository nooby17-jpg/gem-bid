const Database = require("better-sqlite3");
const db = new Database("bids.db");

/* Main bids table */
db.prepare(`
  CREATE TABLE IF NOT EXISTS bids (
    bid_id TEXT PRIMARY KEY,
    title TEXT,
    buyer TEXT,
    state TEXT,
    category TEXT,
    end_date TEXT,
    url TEXT,
    source TEXT,
    fetched_at TEXT
  )
`).run();

/* Snapshot history */
db.prepare(`
  CREATE TABLE IF NOT EXISTS snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT,
    uploaded_at TEXT,
    records INTEGER
  );
`).run();

/* Alerts (future use) */
db.prepare(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT,
    state TEXT,
    source TEXT,
    email TEXT,
    created_at TEXT
  )
`).run();

module.exports = db;
