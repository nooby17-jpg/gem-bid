const Database = require("better-sqlite3");
const db = new Database("bids.db");

/* USERS */
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT CHECK(role IN ('ADMIN','SELLER','VIEWER')),
  created_at TEXT
)
`).run();

/* GEM BIDS */
db.prepare(`
CREATE TABLE IF NOT EXISTS gem_bids (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sl_no INTEGER,
  bid_no TEXT,
  ra_no TEXT,
  item_title TEXT,
  department_name TEXT,
  department_address TEXT,
  state TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT,
  gem_url TEXT,
  created_by INTEGER,
  created_at TEXT
)
`).run();

/* PDF DOCUMENTS */
db.prepare(`
CREATE TABLE IF NOT EXISTS bid_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bid_id INTEGER,
  file_name TEXT,
  file_path TEXT,
  uploaded_by INTEGER,
  uploaded_at TEXT
)
`).run();

/* COMPARISON */
db.prepare(`
CREATE TABLE IF NOT EXISTS comparisons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  bid_id INTEGER,
  created_at TEXT
)
`).run();

module.exports = db;
