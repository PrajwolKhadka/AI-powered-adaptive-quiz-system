// import express from "express";
// import { GoogleGenAI} from "@google/genai";

// const router = express.Router();
// const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// router.post("/", async (req, res) => {
//   const { answers, difficultyLevels, totalScore } = req.body;

//   const prompt = `
//     You are an AI psychometric evaluator. 
//     Analyze the student's quiz answers and difficulty levels.
//     Provide an evaluation in terms of:
//     - Cognitive skills
//     - Problem-solving ability
//     - Adaptability
//     - Persistence
//     Use the following data: 
//     ${JSON.stringify({ answers, difficultyLevels, totalScore })}
//   `;

//   try {
//     const response = await client.models.generateContent({
//       model: "gemini-2.5-pro",
//       contents: prompt,
//     });

//     const evaluation = response.text;
//     res.json({ evaluation });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to generate evaluation" });
//   }
// });

// export default router;

import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MAX_RETRIES = 3;

async function generateEvaluation(prompt) {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const response = await client.models.generateContentStream({
        // model: "gemini-2.5-pro",
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      // return response.text;

      let finalText = "";
      for await (const chunk of response.stream) {
        const text = chunk?.text();
        if (text) finalText += text;
      }

      return finalText;
    } catch (err) {

      console.error("GenAI error:", err.message || err);
      if (err.status === 503) {
        attempt++;
        const waitTime = 1000 * 2 ** attempt;
        console.log(`Model overloaded, retrying in ${waitTime}ms...`);
        await new Promise(res => setTimeout(res, waitTime));
      } else {
        throw err;
      }
    }
  }
  return "Strengths: Good focus. Weaknesses: Needs improvement in problem-solving. Tips: Keep practicing consistently.";
}

router.post("/", async (req, res) => {
  const { answers, difficultyLevels, totalScore } = req.body;

  const prompt = `
    You are an AI psychometric evaluator. 
    Analyze the student's quiz answers and difficulty levels.
    Provide a brief and precise evaluation in terms of:
    - Problem-solving ability
    - Adaptability
    - Suggestions
    Use the following data: 
    ${JSON.stringify({ answers, difficultyLevels, totalScore })}
  `;

  try {
    const evaluation = await generateEvaluation(prompt);
    res.json({ evaluation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to generate evaluation" });
  }
});

export default router;
