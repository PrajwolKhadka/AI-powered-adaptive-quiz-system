import { Student } from "../models/student.model";
import { Document, Types } from "mongoose";

export interface IStudent {
  fullName: string;
  email: string;
  password: string;
  className: string;
  role?: string;
  schoolId?: Types.ObjectId;
  isFirstLogin?: boolean;
}

export const StudentRepository = {
  findByEmail: (email: string) =>
    Student.findOne({ email }),

  updatePassword: (id: string, password: string) =>
    Student.findByIdAndUpdate(id, {
      password,
      isFirstLogin: false,
    }),

  create: (data: IStudent) => Student.create(data) as Promise<Document & IStudent>,
};
