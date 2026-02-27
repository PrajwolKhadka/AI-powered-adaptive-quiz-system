import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SchoolRepository } from "../repositories/school.repository";
import { StudentRepository } from "../repositories/student.repository";
import { Role } from "../types/roles.types";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer";
import { Student } from "../models/student.model";

export const AuthService = {
  async registerSchool(data: any) {
    const [existingEmail, existingPan, existingContact] = await Promise.all([
      SchoolRepository.findByEmail(data.email),
      SchoolRepository.findByPan(data.pan),
      SchoolRepository.findByContactNumber(data.contactNumber),
    ]);
    if (existingEmail) throw new Error("School with this email already exists");
    if (existingPan) throw new Error("School with this PAN already exists");
    if (existingContact)
      throw new Error("School with this contact number already exists");

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
      role: school.role,
      token: jwt.sign(
        { id: school.id, role: Role.SCHOOL },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" },
      ),
    };
  },

  async loginStudent(email: string, password: string) {
    // console.log("Email received:", email);
    const student = await StudentRepository.findByEmail(email);
    // console.log("Student found:", student);
    if (!student) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, student.password);
    // console.log("Password match:", match);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: student._id, role: Role.STUDENT },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" },
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
       <p>This link expires in 10 minutes.</p>`,
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

  async forgotStudentPassword(email: string) {
    const student = await StudentRepository.findByEmail(email);
    if (!student) return;

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await Student.findByIdAndUpdate(student._id, {
      resetPasswordOtp: hashedOtp,
      resetPasswordExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendEmail(
      student.email,
      "Reset Your Password - OTP",
      `<p>Your OTP for password reset is:</p>
     <h2>${otp}</h2>
     <p>This OTP expires in 10 minutes.</p>`,
    );
  },

  async resetStudentPassword(email: string, otp: string, newPassword: string) {
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const student = await Student.findOne({
      email,
      resetPasswordOtp: hashedOtp,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!student) throw new Error("Invalid or expired OTP");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Student.findByIdAndUpdate(student._id, {
      password: hashedPassword,
      resetPasswordOtp: undefined,
      resetPasswordExpiry: undefined,
    });
  },
};
