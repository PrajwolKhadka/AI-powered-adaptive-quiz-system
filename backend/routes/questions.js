import express from "express";
import { getQuestionsByDifficulty, seedQuestions } from "../models/question.js";

const router = express.Router();

// GET /api/question?difficulty=easy
router.get("/", async (req, res) => {
  const { difficulty, excludeIds } = req.query;

  let excludeArray = [];
  if (excludeIds) {
    excludeArray = excludeIds.split(",").map(id => parseInt(id));
  }

  try {
    const question = await getQuestionsByDifficulty(difficulty, excludeArray);
    if (!question) return res.status(404).json({ msg: "No more questions" });
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST /api/question/seed  (optional, for seeding new questions)
router.post("/seed", async (req, res) => {
  const questions = req.body.questions; // array of questions
  try {
    await seedQuestions(questions);
    res.json({ msg: "Questions seeded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
