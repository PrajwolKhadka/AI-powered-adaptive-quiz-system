// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middleware";
// import { createStudentService, getAllStudentsService, getStudentByIdService, updateStudentPasswordService, updateStudentService, deleteBatchStudentsService, deleteStudentService} from "../services/school.services";
// import { asyncHandler } from "../utils/asyncHandler";

// export const createStudent = async (req: AuthRequest, res: Response) => {
//   try {
//     const { fullName, email, password, className } = req.body;
//     if (!fullName || !email || !password || !className) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
//      const imageUrl = req.file ? req.file.path : undefined;
//     const student = await createStudentService(email, password, req.user!.id, fullName, className, imageUrl);
//     res.status(201).json({ message: "Student created", studentId: student._id });
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const getStudents = asyncHandler(
//   async (req: AuthRequest, res: Response) => {
//     const students = await getAllStudentsService(req.user!.id);

//     res.json({
//       count: students.length,
//       students,
//     });
//   }
// );

// export const getStudentById = asyncHandler(
//   async (req: AuthRequest, res: Response) => {
//     const student = await getStudentByIdService(req.params.id);

//     if (student.schoolId?.toString() !== req.user!.id) {
//       throw new Error("Unauthorized access");
//     }

//     res.json(student);
//   }
// );

// export const updateStudent = asyncHandler(
//   async (req: AuthRequest, res: Response) => {
//     const { fullName, email, className } = req.body;

//     if (!fullName && !email && !className) {
//       throw new Error("At least one field is required");
//     }

//     const updated = await updateStudentService(req.params.id, {
//       fullName,
//       email,
//       className,
//     });

//     res.json({
//       message: "Student updated",
//       student: updated,
//     });
//   }
// );

// export const updateStudentPassword = asyncHandler(
//   async (req: AuthRequest, res: Response) => {
//     const { password } = req.body;

//     if (!password) {
//       throw new Error("Password is required");
//     }

//     await updateStudentPasswordService(req.params.id, password);

//     res.json({
//       message: "Password updated successfully",
//     });
//   }
// );

// export const deleteStudent = asyncHandler(
//   async (req: AuthRequest, res: Response) => {
//     await deleteStudentService(req.params.id);

//     res.status(204).send();
//   }
// );


// export const deleteBatchStudents = asyncHandler(
//   async (req: AuthRequest, res: Response) => {
//     const { studentIds } = req.body;

//     if (!Array.isArray(studentIds) || studentIds.length === 0) {
//       throw new Error("studentIds must be a non-empty array");
//     }

//     const result = await deleteBatchStudentsService(studentIds);

//     res.json({
//       message: "Students deleted",
//       deletedCount: result.deletedCount,
//     });
//   }
// );


import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createStudentService,
  getAllStudentsService,
  getStudentByIdService,
  updateStudentService,
  updateStudentPasswordService,
  deleteStudentService,
  deleteBatchStudentsService,
} from "../services/school.services";
import { CreateStudentDTO, CreateStudentDto } from "../dtos/student.dto";
import { Types } from "mongoose";

export const createStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
  // merge body + optional file
  const studentData: CreateStudentDto = {
    ...req.body,
    imageUrl: req.file ? `/uploads/students/${req.file.filename}` : undefined,
  };

  // validate with DTO
  const parseResult = CreateStudentDTO.safeParse(studentData);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.issues });
  }

  // call service with validated DTO + schoolId
  const student = await createStudentService({
    ...parseResult.data,
    schoolId: req.user!.id,
  });

  res.status(201).json({
    message: "Student created",
    studentId: student._id,
    imageUrl: student.imageUrl,
  });
});

export const getStudents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const students = await getAllStudentsService(req.user!.id);
  res.json({ count: students.length, students });
});

// export const getStudentById = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const student = await getStudentByIdService(req.params.id);
  
//   const schoolIdstr = student.schoolId?.toString();

//   if (!schoolIdstr || schoolIdstr !== req.user!.id) {
//     throw new Error("Unauthorized access");
//   }

//   res.json(student);
// });


export const getStudentById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const student = await getStudentByIdService(req.params.id);

  if (!student.schoolId || !new Types.ObjectId(req.user!.id).equals(student.schoolId)) {
    throw new Error("Unauthorized access");
  }

  res.json(student);
});

export const updateStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payload: Partial<CreateStudentDto> = {
    ...req.body,
    imageUrl: req.file ? `/uploads/students/${req.file.filename}` : undefined,
  };

  if (!Object.keys(payload).length) {
    throw new Error("At least one field is required");
  }

  const updated = await updateStudentService(req.params.id, payload);

  res.json({
    message: "Student updated",
    student: updated,
  });
});

export const updateStudentPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { password } = req.body;
  if (!password) throw new Error("Password is required");

  await updateStudentPasswordService(req.params.id, password);

  res.json({ message: "Password updated successfully" });
});

export const deleteStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteStudentService(req.params.id);
  res.status(204).send();
});

export const deleteBatchStudents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { studentIds } = req.body;

  if (!Array.isArray(studentIds) || !studentIds.length) {
    throw new Error("studentIds must be a non-empty array");
  }

  const result = await deleteBatchStudentsService(studentIds);

  res.json({ message: "Students deleted", deletedCount: result.deletedCount });
});

