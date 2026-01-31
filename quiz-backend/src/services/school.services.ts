// import bcrypt from "bcrypt";
// import { StudentRepository } from "../repositories/student.repository";
// import { Types } from "mongoose";

// export const createStudentService = async (
//   email: string,
//   password: string,
//   schoolId: string,
//   fullName: string,
//   className: string,
//   imageUrl?: string,
// ) => {
//   const hashed = await bcrypt.hash(password, 10);

//   return StudentRepository.create({
//     email,
//     password: hashed,
//     schoolId: new Types.ObjectId(schoolId),
//     fullName,
//     className,
//     isFirstLogin: true,
//     imageUrl,
//   });
// };

// export const getAllStudentsService = async (schoolId?: string) => {
//   if (schoolId) {
//     return StudentRepository.findAll({
//       schoolId: new Types.ObjectId(schoolId),
//     });
//   }
//   return StudentRepository.findAll();
// };

// export const getStudentByIdService = async (id: string) => {
//   const student = await StudentRepository.findById(id);
//   if (!student) throw new Error("Student not found");
//   return student;
// };

// export const updateStudentService = async (
//   id: string,
//   payload: Partial<{
//     fullName: string;
//     email: string;
//     className: string;
//     password: string;
//   }>
// ) => {
//   if (payload.password) {
//     payload.password = await bcrypt.hash(payload.password, 10);
//   }

//   const updated = await StudentRepository.updateById(id, payload);
//   if (!updated) throw new Error("Student not found");

//   return updated;
// };


// export const updateStudentPasswordService = async (
//   id: string,
//   newPassword: string
// ) => {
//   const hashed = await bcrypt.hash(newPassword, 10);
//   const updated = await StudentRepository.updatePassword(id, hashed);

//   if (!updated) throw new Error("Student not found");
//   return updated;
// };


// export const deleteStudentService = async (id: string) => {
//   const deleted = await StudentRepository.deleteById(id);
//   if (!deleted) throw new Error("Student not found");
//   return deleted;
// };

// export const deleteBatchStudentsService = async (ids: string[]) => {
//   if (!ids.length) throw new Error("No student IDs provided");
//   return StudentRepository.deleteManyByIds(ids);
// };


import bcrypt from "bcrypt";
import { StudentRepository } from "../repositories/student.repository";
import { Types } from "mongoose";
import { CreateStudentDto } from "../dtos/student.dto";

export const createStudentService = async (dto: CreateStudentDto & { schoolId: string }) => {
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  return StudentRepository.create({
    email: dto.email,
    password: hashedPassword,
    schoolId: new Types.ObjectId(dto.schoolId),
    fullName: dto.fullName,
    className: dto.className,
    isFirstLogin: true,
    imageUrl: dto.imageUrl,
  });
};

export const getAllStudentsService = async (schoolId?: string) => {
  if (schoolId) {
    return StudentRepository.findAll({ schoolId: new Types.ObjectId(schoolId) });
  }
  return StudentRepository.findAll();
};

export const getStudentByIdService = async (id: string) => {
  const student = await StudentRepository.findById(id);
  if (!student) throw new Error("Student not found");
  return student;
};

export const updateStudentService = async (
  id: string,
  payload: Partial<CreateStudentDto>
) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const updated = await StudentRepository.updateById(id, payload);
  if (!updated) throw new Error("Student not found");
  return updated;
};

export const updateStudentPasswordService = async (id: string, newPassword: string) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  const updated = await StudentRepository.updatePassword(id, hashed);

  if (!updated) throw new Error("Student not found");
  return updated;
};

export const deleteStudentService = async (id: string) => {
  const deleted = await StudentRepository.deleteById(id);
  if (!deleted) throw new Error("Student not found");
  return deleted;
};

export const deleteBatchStudentsService = async (ids: string[]) => {
  if (!ids.length) throw new Error("No student IDs provided");
  return StudentRepository.deleteManyByIds(ids);
};
