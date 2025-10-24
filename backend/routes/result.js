import express from "express";
import pool from "../db.js";

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
