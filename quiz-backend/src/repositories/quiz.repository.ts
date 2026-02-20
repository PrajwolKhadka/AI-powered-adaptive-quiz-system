import { QuizModel } from "../models/quiz.model";

export class QuizRepository {
  async findByIdWithQuestions(quizId: string) {
    return QuizModel.findById(quizId).populate("questionIds");
  }
  async findByIdForStudent(quizId: string) {
    // return QuizModel.findById(quizId).populate({
    //   path: "questionIds",
    //   select: "-correctAnswer",
    // });
    return QuizModel.findOne({
    _id: quizId,
    isActive: true,
    endTime: { $gt: new Date() },  // reject if duration is over
  }).populate({
    path: "questionIds",
    select: "-correctAnswer",
  });
  }
  async updateById(quizId: string, updateData: any) {
    return QuizModel.findByIdAndUpdate(quizId, updateData, { new: true });
  }
}
