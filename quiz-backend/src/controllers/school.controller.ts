import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createStudentService } from "../services/school.services";

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, email, password, className } = req.body;
    if (!fullName || !email || !password || !className) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const student = await createStudentService(email, password, req.user!.id, fullName, className);
    res.status(201).json({ message: "Student created", studentId: student._id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


