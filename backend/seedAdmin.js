const bcrypt = require("bcryptjs");
const db = require("./db");

const password = bcrypt.hashSync("Admin@1234", 10);

db.prepare(`
INSERT OR IGNORE INTO users
(name, email, password_hash, role, created_at)
VALUES (?, ?, ?, 'ADMIN', ?)
`).run(
  "Admin",
  "admin@agoratenders.com",
  password,
  new Date().toISOString()
);
  

console.log("✅ Admin ensured (exists or created)");
/*UPDATE users
SET password_hash = '<new_hash>'
WHERE email = 'admin@agoratenders.com';
*/