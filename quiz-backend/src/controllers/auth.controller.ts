import { Request, Response } from "express";
import { registerSchoolDto } from "../dtos/school.dto";
import { changePasswordDto, loginDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.services";
import { AuthRequest } from "../middlewares/auth.middleware";
import { success } from "zod";

export const registerSchool = async (req: Request, res: Response) => {
  try {
    const data = registerSchoolDto.parse(req.body);
    await AuthService.registerSchool(data);
    res.status(201).json({
      message: "Registration successful",
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginDto.parse(req.body);
    const result = await AuthService.login(email, password);
    res.json({
      success: true,
      message: "Login successful",
      token: result.token,
      data: { role: result.role, email },
    });
  } catch (err: any) {
    res
      .status(401)
      .json({ success: false, error: err.message || "Invalid Credentials" });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginDto.parse(req.body);
    const result = await AuthService.loginStudent(email, password);
    // res.json(result);
    console.log("Login result in controller:", result);
    return res.json({
      success: true,
      message: "Login successful",
      token: result.token,
      // data: { role: result.role, email },
      data: {
        role: result.role,
        email: result.email,
        fullName: result.fullName,
        className: result.className,
        isFirstLogin: result.isFirstLogin,
        studentId: result.studentId,
      },
    });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { newPassword } = changePasswordDto.parse(req.body);
    if (!newPassword) throw new Error("New password is required");
    // if (!newPassword.min(8)) throw new Error("Password must be 8 character long")

    await AuthService.changeStudentPassword(req.user!.id, newPassword);

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await AuthService.forgotPassword(email);
    if (!email) throw new Error("Email is required");
    res.json({ message: "If the email exists, a reset link has been sent" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
