import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // your Postgres connection
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ msg: "User not found" });

    const user = result.rows[0];

    // const valid = await bcrypt.compare(password, user.password);
    // if (!valid) return res.status(401).json({ msg: "Invalid password" });
    if (password !== user.password) return res.status(401).json({ msg: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
