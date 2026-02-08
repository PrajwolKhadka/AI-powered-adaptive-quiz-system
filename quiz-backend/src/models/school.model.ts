import { Schema, model } from "mongoose";
import { InstitueType } from "../types/school.types";

const schoolSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },

    location: {
      city: String,
      district: String,
    },

    pan: { type: String, required: true },
    contactNumber: { type: String, required: true },

    instituteType: {
      type: String,
      enum: Object.values(InstitueType),
      required: true,
    },

    role: {
      type: String,
      default: "SCHOOL",
    },
  },
  { timestamps: true },
);

export const SchoolModel = model("School", schoolSchema);
