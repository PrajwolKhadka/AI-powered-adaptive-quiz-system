import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { QuizService } from "../services/quiz.services";
import { getQuizDto, toggleQuizDto } from "../dtos/quiz.dto";
import { StudentQuizFetchService } from "../services/quiz.services";

const service = new StudentQuizFetchService();


export const toggleQuizController = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = toggleQuizDto.parse(req.body);

    const quiz = await QuizService.toggleQuiz(req.user!.id, parsed);

    res.status(200).json({ success: true, quiz });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export class StudentQuizFetchController {
  async getQuiz(req: AuthRequest, res: Response) {
    try {
      const { quizId } = getQuizDto.parse(req.query);

      const quiz = await service.getQuizForStudent(quizId);

      res.status(200).json({ success: true, quiz });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
