const db = require("./db");

module.exports = function cleanup() {
  db.prepare(`
    UPDATE gem_bids
    SET status='ARCHIVED'
    WHERE DATE(end_date,'+28 days') < DATE('now')
  `).run();
};
