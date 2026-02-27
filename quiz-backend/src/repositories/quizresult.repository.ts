import { QuizResultModel } from "../models/quizResult.model";

export class QuizResultRepository {
  async findByStudentAndQuiz(studentId: string, quizId: string) {
    return QuizResultModel.findOne({ studentId, quizId });
  }

  async findByQuiz(quizId: string) {
    return QuizResultModel.find({ quizId }).populate(
      "studentId",
      "fullName email className"
    );
  }

  async findByStudent(studentId: string) {
    return QuizResultModel.find({ studentId })
      .populate("quizId", "subject classLevel startTime endTime")
      .sort({ createdAt: -1 });
  }

  async findByQuizIds(quizIds: string[]) {
    return QuizResultModel.find({ quizId: { $in: quizIds } })
      .populate("studentId", "fullName email className")
      .populate("quizId", "subject classLevel startTime endTime")
      .sort({ createdAt: -1 });
  }
}