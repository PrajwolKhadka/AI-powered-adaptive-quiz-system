import cron from "node-cron";
import { QuizModel } from "../models/quiz.model";

cron.schedule("* * * * *", async () => {
  try {
    await QuizModel.updateMany(
      { isActive: true, endTime: { $lte: new Date() } },
      { $set: { isActive: false } }
    );
  } catch (err) {
    console.error("Quiz deactivation cron failed:", err);
  }
});