import express from "express";
import pool from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/result
router.post("/", async (req, res) => {
  const { userId, score, psychometric } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO results (user_id, score, psychometric) VALUES ($1, $2, $3) RETURNING *",
      [userId, score, JSON.stringify(psychometric)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/school", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    // Get the admin’s school_id
    const admin = await pool.query("SELECT school_id FROM users WHERE id = $1 AND role='schooladmin'", [adminId]);
    if (admin.rows.length === 0) return res.status(403).json({ msg: "Not authorized" });

    const schoolId = admin.rows[0].school_id;

    // Fetch all results of students belonging to the same school
    const results = await pool.query(`
      SELECT r.*, u.name AS student_name
      FROM results r
      JOIN users u ON r.user_id = u.id
      WHERE u.school_id = $1 AND u.role = 'student'
      ORDER BY r.created_at DESC
    `, [schoolId]);

    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// GET /api/result/:userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const results = await pool.query(
      "SELECT * FROM results WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;
