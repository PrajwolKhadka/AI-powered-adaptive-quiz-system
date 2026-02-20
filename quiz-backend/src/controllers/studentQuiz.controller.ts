import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { StudentQuizService } from "../services/studentQuiz.services";
import { Student } from "../models/student.model";

const service = new StudentQuizService();

export class StudentQuizController {

  async submitAnswer(req: AuthRequest, res: Response) {
    try {
      const result = await service.submitAnswer(
        req.user!.id,
        req.body
      );

      return res.json(result);

    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  async nextQuestion(req: AuthRequest, res: Response) {
    try {
      const result = await service.getNextQuestion(
        req.user!.id,
        req.body
      );

      return res.json(result);

    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getActiveQuiz(req: AuthRequest, res: Response) {
    try {
      const studentId: any = req.user!.id; 
      const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
      console.log("Student info from token:", student.className);
      const classLevel = student.className;

      const activeQuiz = await service.getActiveQuizForStudent(classLevel);

      if (!activeQuiz) {
        return res.json({ available: false });
      }

      return res.json({
        available: true,
        quizId: activeQuiz._id,
        subject: activeQuiz.subject,
        endTime: activeQuiz.endTime,
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}
