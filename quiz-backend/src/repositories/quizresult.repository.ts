import { QuizResultModel } from "../models/quizResult.model";

export class QuizResultRepository {
  // Find a single result by student + quiz
  async findByStudentAndQuiz(studentId: string, quizId: string) {
    return QuizResultModel.findOne({ studentId, quizId });
  }

  // All results for one quiz (school bulk view)
  async findByQuiz(quizId: string) {
    return QuizResultModel.find({ quizId }).populate(
      "studentId",
      "fullName email className"
    );
  }

  // All results for one student (student history)
  async findByStudent(studentId: string) {
    return QuizResultModel.find({ studentId })
      .populate("quizId", "subject classLevel startTime endTime")
      .sort({ createdAt: -1 });
  }

  // All results for a school's quizzes — pass in array of quizIds
  async findByQuizIds(quizIds: string[]) {
    return QuizResultModel.find({ quizId: { $in: quizIds } })
      .populate("studentId", "fullName email className")
      .populate("quizId", "subject classLevel startTime endTime")
      .sort({ createdAt: -1 });
  }
}