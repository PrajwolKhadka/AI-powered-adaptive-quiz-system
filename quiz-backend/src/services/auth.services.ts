import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SchoolRepository } from "../repositories/school.repository";
import { StudentRepository } from "../repositories/student.repository";

export const AuthService = {
  async registerSchool(data: any) {
    const exists = await SchoolRepository.findByEmail(data.email);
    if (exists) throw new Error("School already exists");

    const hashed = await bcrypt.hash(data.password, 10);

    return SchoolRepository.create({
      ...data,
      password: hashed,
    });
  },

  async login(email: string, password: string) {
    const school = await SchoolRepository.findByEmail(email);
    if (!school) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, school.password);
    if (!match) throw new Error("Invalid credentials");

    return {
      role: "SCHOOL",
      token: jwt.sign(
        { id: school.id, role: "SCHOOL" },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" }
      ),
    };
  },
  
  async loginStudent(email: string, password: string) {
    const student = await StudentRepository.findByEmail(email);
    if (!student) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, student.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: student.id, role: "student" },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    return {
      studentId: student._id,
      fullName: student.fullName,
      email: student.email,
      className: student.className,
      isFirstLogin: student.isFirstLogin,
      token,
      role: student.role,
    };
  },

  async changeStudentPassword(studentId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);

    await StudentRepository.updatePassword(studentId, hashed);
  },
};
