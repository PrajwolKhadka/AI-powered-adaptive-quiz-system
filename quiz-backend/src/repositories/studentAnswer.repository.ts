import { StudentAnswerModel } from "../models/studentAnswer.model";
import { StudentQuizPoolModel } from "../models/studentQuizPool.model";

export class StudentAnswerRepository {
  async create(data: any) {
    return StudentAnswerModel.create(data);
  }

  async findByStudentAndQuiz(studentId: string, quizId: string) {
    return StudentAnswerModel.find({ studentId, quizId });
  }

  async getAnsweredQuestionIds(studentId: string, quizId: string): Promise<string[]> {
    const answers = await StudentAnswerModel.find(
      { studentId, quizId },
      { questionId: 1 }
    );
    const unique = new Set(answers.map((a) => a.questionId.toString()));
    return Array.from(unique);
  }

  // FIX: check if a student already answered a specific question in a quiz
  async hasAnswered(studentId: string, quizId: string, questionId: string): Promise<boolean> {
    const existing = await StudentAnswerModel.findOne({
      studentId,
      quizId,
      questionId,
    });
    return !!existing;
  }

  async findByStudent(studentId: string) {
    return StudentAnswerModel.find({ studentId });
  }

  async setQuizQuestionPool(
    studentId: string,
    quizId: string,
    questionIds: string[]
  ) {
    return StudentQuizPoolModel.findOneAndUpdate(
      { studentId, quizId },
      { questionIds },
      { upsert: true, new: true }
    );
  }

  async getQuizQuestionPool(
    studentId: string,
    quizId: string
  ): Promise<string[] | null> {
    const pool = await StudentQuizPoolModel.findOne({ studentId, quizId });
    return pool?.questionIds || null;
  }
}