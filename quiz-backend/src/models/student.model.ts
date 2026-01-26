import { Schema, model, Types } from "mongoose";

const studentSchema = new Schema(
  {
    fullName: {type: String, required:true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    className: {type: String, required:true},
    role: { type: String, default: "STUDENT" },
    schoolId: { type: Types.ObjectId, ref: "School" },
    isFirstLogin: { type: Boolean, default: true },
    imageUrl: {type: String, required: false},
  },
  { timestamps: true }
);

export const Student = model("Student", studentSchema);
