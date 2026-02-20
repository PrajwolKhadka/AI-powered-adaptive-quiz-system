import mongoose from "mongoose";

const StudentQuizPoolSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  quizId: { type: String, required: true },
  questionIds: [{ type: String, required: true }], // store 25 question IDs
}, { timestamps: true });

export const StudentQuizPoolModel = mongoose.model(
  "StudentQuizPool",
  StudentQuizPoolSchema
);
