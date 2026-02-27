import { GoogleGenAI } from "@google/genai";

export class AIFeedbackService {
  private ai: GoogleGenAI;
  private model: string;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found in environment");
    }

    this.ai = new GoogleGenAI({}); // API key yeta tira haldim la
    this.model = "gemini-3-flash-preview";
  }

  async generateQuizFeedback(data: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    weakSubjects: string[];
    avgTime: number;
  }): Promise<string> {
    try {
      const prompt = `
        You are an educational AI tutor. Analyze student quiz results and provide a constructive performance evaluation,
        specific improvement advice for weak subjects, and a motivational closing. Keep responses under 150 words.

        Statistics:
        - Score: ${data.correctAnswers}/${data.totalQuestions}
        - Weak Subjects: ${data.weakSubjects.join(", ") || "None"}
        - Average Time: ${data.avgTime.toFixed(2)} seconds per question
      `;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });

      return response.text || "Excellent effort! Review your results to see how you performed.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Great job completing the quiz. Keep practicing to master these topics!";
    }
  }
}
