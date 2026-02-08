import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SchoolRepository } from "../repositories/school.repository";
import { StudentRepository } from "../repositories/student.repository";
import { Role } from "../types/roles.types";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer";


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
        { id: school.id, role: Role.SCHOOL },
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
      { id: student.id, role: Role.STUDENT },
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

   async forgotPassword(email: string) {
    const school = await SchoolRepository.findByEmail(email);
    if (!school) return; // don’t reveal if email exists

    // generate token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await SchoolRepository.updateById(school.id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(
      school.email,
      "Reset Your Password",
      `<p>Click below to reset your password:</p>
       <a href="${resetLink}">${resetLink}</a>
       <p>This link expires in 10 minutes.</p>`
    );
  },

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const school = await SchoolRepository.findByResetToken(hashedToken);

    if (!school) throw new Error("Invalid or expired token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await SchoolRepository.updateById(school.id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpiry: undefined,
    });
  },
};
