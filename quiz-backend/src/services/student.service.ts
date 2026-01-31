import { Student } from "../models/student.model";

export const StudentService = {
  async uploadProfilePicture(studentId: string, imageUrl: string) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // if (!student.isFirstLogin) {
    //   throw new Error("Profile already completed");
    // }

    student.imageUrl = imageUrl;
    student.isFirstLogin = false;

    await student.save();

    return student;
  },
  async getById(id: string) {
    return Student.findById(id);
  }
};
