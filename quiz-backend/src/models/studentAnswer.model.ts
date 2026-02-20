import { Schema, model, Types } from "mongoose";

const studentAnswerSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "Student",
      required: true,
    },

    quizId: {
      type: Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    questionId: {
      type: Types.ObjectId,
      ref: "Question",
      required: true,
    },

    subject: { type: String, required: true },

    difficulty: { type: Number, required: true },

    timeTaken: { type: Number, required: true },

    correct: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export const StudentAnswerModel = model("StudentAnswer", studentAnswerSchema);
