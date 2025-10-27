import express from "express";
import { GoogleGenAI} from "@google/genai";

const router = express.Router();
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/", async (req, res) => {
  const { answers, difficultyLevels, totalScore } = req.body;

  const prompt = `
    You are an AI psychometric evaluator. 
    Analyze the student's quiz answers and difficulty levels.
    Provide an evaluation in terms of:
    - Cognitive skills
    - Problem-solving ability
    - Adaptability
    - Persistence
    Use the following data: 
    ${JSON.stringify({ answers, difficultyLevels, totalScore })}
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    const evaluation = response.text;
    res.json({ evaluation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to generate evaluation" });
  }
});

export default router;
