import mongoose, { Schema, Document } from "mongoose";

export type ResourceType = "BOOK" | "RESOURCE";
export type ResourceFormat = "PDF" | "LINK";

export interface ResourceDocument extends Document {
  title: string;
  description?: string;
  type: ResourceType;
  format: ResourceFormat;
  fileUrl?: string;
  linkUrl?: string;
  schoolId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<ResourceDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["BOOK", "RESOURCE"],
      required: true,
    },
    format: {
      type: String,
      enum: ["PDF", "LINK"],
      required: true,
    },
    fileUrl: {
      type: String,
    },
    linkUrl: {
      type: String,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
  },
  { timestamps: true },
);

export const ResourceModel = mongoose.model<ResourceDocument>(
  "Resource",
  resourceSchema,
);
