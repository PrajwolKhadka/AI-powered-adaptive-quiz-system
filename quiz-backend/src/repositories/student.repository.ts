import { Student } from "../models/student.model";
import { Document, Types } from "mongoose";

export interface IStudent {
  fullName: string;
  email: string;
  password: string;
  className: number;
  role?: string;
  schoolId?: Types.ObjectId;
  isFirstLogin?: boolean;
  imageUrl?: string;
  resetPasswordOtp?: string;
  resetPasswordExpiry?: Date;
}

export type StudentDocument = Document & IStudent;

export const StudentRepository = {
  findByEmail: (email: string) => 
    Student.findOne({ email }),

  findAll: (filter: Partial<IStudent> = {}) => {
    return Student.find(filter).select("fullName email className imageUrl isFirstLogin schoolId");
  },

  findById: (id: string) => {
    return Student.findById(id).select("fullName email className imageUrl isFirstLogin schoolId");
  },

  updateById: (id: string, data: Partial<IStudent>) => {
    return Student.findByIdAndUpdate(id, data, { new: true });
  },

  updatePassword: (id: string, password: string) =>
    Student.findByIdAndUpdate(
      id,
      { password, isFirstLogin: false },
      { new: true }
    ),

  deleteById: (id: string) => {
    return Student.findByIdAndDelete(id);
  },

  deleteManyByIds: (ids: string[]) => {
    return Student.deleteMany({
      _id: { $in: ids.map(id => new Types.ObjectId(id)) },
    });
  },

  create: (data: IStudent) =>
    Student.create(data) as Promise<StudentDocument>,
  
};
