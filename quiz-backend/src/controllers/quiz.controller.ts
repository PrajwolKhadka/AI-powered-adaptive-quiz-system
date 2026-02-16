import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { QuizService } from "../services/quiz.services";
import { toggleQuizDto } from "../dtos/quiz.dto";

export const toggleQuizController = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = toggleQuizDto.parse(req.body);

    const quiz = await QuizService.toggleQuiz(req.user!.id, parsed);

    res.status(200).json({ success: true, quiz });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
