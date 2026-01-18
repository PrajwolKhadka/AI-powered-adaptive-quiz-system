import { Request, Response } from "express";
import { registerSchoolDto } from "../dtos/school.dto";
import { loginDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.services";
import { AuthRequest } from "../middlewares/auth.middleware";

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
    res.status(400).json({ error: err.message || "Login failed" });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const result = await AuthService.loginStudent(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) throw new Error("New password is required");

    await AuthService.changeStudentPassword(req.user!.id, newPassword);

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

