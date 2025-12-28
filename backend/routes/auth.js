const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { JWT_SECRET } = require("../config");

const router = express.Router();

/* REGISTER */
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["SELLER", "VIEWER"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const hash = bcrypt.hashSync(password, 10);

  try {
    db.prepare(`
      INSERT INTO users (name, email, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, hash, role, new Date().toISOString());

    res.json({ message: "Registered successfully" });
  } catch {
    res.status(400).json({ error: "Email already exists" });
  }
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare(
    "SELECT * FROM users WHERE email = ?"
  ).get(email);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role, name: user.name });
});

module.exports = router;
