import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { SchoolResultsService } from "../services/schoolresults.service";

const service = new SchoolResultsService();

export class SchoolResultsController {

  // GET /school/quizzes
  async getSchoolQuizzes(req: AuthRequest, res: Response) {
    try {
      const schoolId = req.user!.id;
      const quizzes = await service.getSchoolQuizzes(schoolId);
      return res.json({ quizzes });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // GET /school/results — all results across all quizzes
  async getAllResults(req: AuthRequest, res: Response) {
    try {
      const schoolId = req.user!.id;
      const results = await service.getAllResultsForSchool(schoolId);
      return res.json({ results });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // GET /school/quizzes/:quizId/results — bulk results for one quiz
  async getQuizResults(req: AuthRequest, res: Response) {
    try {
      const schoolId = req.user!.id;
      const { quizId } = req.params;
      const results = await service.getResultsByQuiz(schoolId, quizId);
      return res.json({ results });
    } catch (err: any) {
      const status = err.message.includes("not found") ? 404 : 500;
      return res.status(status).json({ message: err.message });
    }
  }

  // GET /school/quizzes/:quizId/results/:studentId — individual student detail
  async getStudentResultDetail(req: AuthRequest, res: Response) {
    try {
      const schoolId = req.user!.id;
      const { quizId, studentId } = req.params;
      const result = await service.getStudentResultDetail(
        schoolId,
        quizId,
        studentId
      );
      return res.json({ result });
    } catch (err: any) {
      const status = err.message.includes("not found") ? 404 : 500;
      return res.status(status).json({ message: err.message });
    }
  }
}