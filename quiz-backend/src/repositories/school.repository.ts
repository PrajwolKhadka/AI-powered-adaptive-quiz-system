import { Schema, model } from "mongoose";
import { SchoolStatus, InstitueType } from "../types/school.types";

const schoolSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    location: {
      province: String,
      district: String,
      city: String,
      ward: String,
    },

    pan: { type: String, required: true },
    contactNumber: { type: String, required: true },

    instituteType: {
      type: String,
      enum: Object.values(InstitueType),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(SchoolStatus),
      default: SchoolStatus.UNVERIFIED,
    },

    role: {
      type: String,
      default: "SCHOOL",
    },
  },
  { timestamps: true }
);

export const SchoolModel = model("School", schoolSchema);

export const SchoolRepository = {
  create: (data: any) => SchoolModel.create(data),

  findByEmail: (email: string) =>
    SchoolModel.findOne({ email }),

  findUnverified: () =>
    SchoolModel.find({ status: SchoolStatus.UNVERIFIED }),

  findVerified: () =>
    SchoolModel.find({ status: SchoolStatus.VERIFIED }),

  verifyById: (id: string) =>
    SchoolModel.findByIdAndUpdate(
      id,
      { status: SchoolStatus.VERIFIED },
      { new: true }
    ),

    rejectById: (id: string) =>
    SchoolModel.findByIdAndUpdate(
    id,
    { status: SchoolStatus.REJECTED },
    { new: true }
  ),
};

