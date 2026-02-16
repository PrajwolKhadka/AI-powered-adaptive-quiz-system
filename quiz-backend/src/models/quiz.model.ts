import { Schema, model, Types } from "mongoose";

const quizSchema = new Schema(
  {
    schoolId: { type: Types.ObjectId, ref: "School", required: true },
    subject: { type: String, required: true },
    classLevel: { type: Number, required: true },
    questionIds: [{ type: Types.ObjectId, ref: "Question" }],
    isActive: { type: Boolean, default: false },
    durationMinutes: { type: Number, default: 60 },
    startTime: { type: Date },
    endTime: { type: Date }, 
  },
  { timestamps: true }
);

export const QuizModel = model("Quiz", quizSchema);
