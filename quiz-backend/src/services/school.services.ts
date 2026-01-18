import bcrypt from "bcrypt";
import { StudentRepository } from "../repositories/student.repository";
import { Types } from "mongoose";

export const createStudentService = async (
  email: string,
  password: string,
  schoolId: string,
  fullName: string,
  className: string
) => {
  const hashed = await bcrypt.hash(password, 10);

  return StudentRepository.create({
    email,
    password: hashed,
    schoolId: new Types.ObjectId(schoolId),
    fullName,
    className,
    isFirstLogin: true,
  });
};

