import { Schema, model } from "mongoose";
import { InstitueType } from "../types/school.types";
import { SchoolModel } from "../models/school.model";

export const SchoolRepository = {
  create: (data: any) => SchoolModel.create(data),

  findByEmail: (email: string) =>
    SchoolModel.findOne({ email }),

  findBySchoolName: (name: string) =>
    SchoolModel.findOne({ name }),
};

