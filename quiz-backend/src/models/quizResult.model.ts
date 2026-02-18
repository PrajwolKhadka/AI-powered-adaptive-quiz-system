import { Schema, model, Types } from "mongoose";

const quizResultSchema = new Schema(
  {
    studentId: { type: Types.ObjectId, ref: "Student", required: true },
    quizId: { type: Types.ObjectId, ref: "Quiz", required: true },

    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    timeTaken: { type: Number, required: true },

    aiFeedback: { type: String }, 
    questionStats: [
      {
        questionId: { type: Types.ObjectId, ref: "Question" },
        selectedOption: { type: String },
        correct: { type: Boolean },
        timeTaken: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export const QuizResultModel = model("QuizResult", quizResultSchema);
