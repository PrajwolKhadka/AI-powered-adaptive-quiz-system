import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { StudentResultsService } from "../services/studentresults.service";

const service = new StudentResultsService();

export class StudentResultsController {

  // GET /student/results — full quiz history + graph data
  async getMyHistory(req: AuthRequest, res: Response) {
    try {
      const studentId = req.user!.id;
      const [history, graph] = await Promise.all([
        service.getStudentHistory(studentId),
        service.getPerformanceGraph(studentId),
      ]);
      return res.json({ history, graph });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // GET /student/results/:quizId — specific quiz result + AI feedback
  async getMyResultDetail(req: AuthRequest, res: Response) {
    try {
      const studentId = req.user!.id;
      const { quizId } = req.params;
      const result = await service.getStudentResultDetail(studentId, quizId);
      return res.json({ result });
    } catch (err: any) {
      const status = err.message.includes("not found") ? 404 : 500;
      return res.status(status).json({ message: err.message });
    }
  }
}