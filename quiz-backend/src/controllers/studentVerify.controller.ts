import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { AuthRequest } from "../middlewares/auth.middleware";
import { Student } from "../models/student.model";

export const verifyPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ valid: false, message: "Password required" });
    }

    const student = await Student.findById(req.user!.id);

    if (!student || !student.password) {
      return res.status(404).json({ valid: false });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      student.password
    );

    return res.json({
      valid: isMatch,
    });
  } catch (error: any) {
    return res.status(500).json({
      valid: false,
      message: error.message,
    });
  }
};