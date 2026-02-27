import { QuizResultRepository } from "../repositories/quizresult.repository";
import { QuizModel } from "../models/quiz.model";
import { QuizResultDetailDTO, QuizResultSummaryDTO } from "../dtos/results.dto";

export class SchoolResultsService {
  private quizResultRepo = new QuizResultRepository();

  // Helper to build accuracy
  private calcAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((correct / total) * 100).toFixed(1));
  }

  // Get all quizzes belonging to this school
  async getSchoolQuizzes(schoolId: string) {
    const quizzes = await QuizModel.find({ schoolId }).sort({ createdAt: -1 });
    return quizzes.map((q: any) => ({
      id: q._id.toString(),
      subject: q.subject,
      classLevel: q.classLevel,
      isActive: q.isActive,
      startTime: q.startTime,
      endTime: q.endTime,
      totalQuestions: q.questionIds?.length ?? 0,
      createdAt: q.createdAt,
    }));
  }

  // All student results for one quiz (bulk view)
  async getResultsByQuiz(
    schoolId: string,
    quizId: string
  ): Promise<QuizResultSummaryDTO[]> {
    // Verify quiz belongs to this school
    const quiz = await QuizModel.findOne({ _id: quizId, schoolId });
    if (!quiz) throw new Error("Quiz not found or access denied");

    const results = await this.quizResultRepo.findByQuiz(quizId);

    return results.map((r: any) => ({
      resultId: r._id.toString(),
      student: {
        id: r.studentId._id.toString(),
        fullName: r.studentId.fullName,
        email: r.studentId.email,
        className: r.studentId.className,
      },
      quiz: {
        id: quizId,
        subject: quiz.subject,
        classLevel: quiz.classLevel,
        startTime: quiz.startTime ?? null,
        endTime: quiz.endTime ?? null,
      },
      totalQuestions: r.totalQuestions,
      correctAnswers: r.correctAnswers,
      wrongAnswers: r.wrongAnswers,
      accuracy: this.calcAccuracy(r.correctAnswers, r.totalQuestions),
      timeTaken: r.timeTaken,
      completedAt: r.createdAt,
    }));
  }

  // Individual student result with AI feedback
  async getStudentResultDetail(
    schoolId: string,
    quizId: string,
    studentId: string
  ): Promise<QuizResultDetailDTO> {
    // Verify quiz belongs to this school
    const quiz = await QuizModel.findOne({ _id: quizId, schoolId });
    if (!quiz) throw new Error("Quiz not found or access denied");

    const result = await this.quizResultRepo.findByStudentAndQuiz(
      studentId,
      quizId
    );
    if (!result) throw new Error("Result not found");

    // Populate student manually since findByStudentAndQuiz doesn't populate
    const populated: any = await result.populate(
      "studentId",
      "fullName email className"
    );

    return {
      resultId: populated._id.toString(),
      student: {
        id: populated.studentId._id.toString(),
        fullName: populated.studentId.fullName,
        email: populated.studentId.email,
        className: populated.studentId.className,
      },
      quiz: {
        id: quizId,
        subject: quiz.subject,
        classLevel: quiz.classLevel,
        startTime: quiz.startTime ?? null,
        endTime: quiz.endTime ?? null,
      },
      totalQuestions: populated.totalQuestions,
      correctAnswers: populated.correctAnswers,
      wrongAnswers: populated.wrongAnswers,
      accuracy: this.calcAccuracy(
        populated.correctAnswers,
        populated.totalQuestions
      ),
      timeTaken: populated.timeTaken,
      aiFeedback: populated.aiFeedback ?? "No feedback available.",
      questionStats: (populated.questionStats ?? []).map((qs: any) => ({
        questionId: qs.questionId.toString(),
        correct: qs.correct,
        timeTaken: qs.timeTaken,
      })),
      completedAt: populated.createdAt,
    };
  }

  // Bulk view — all results across ALL school quizzes
  async getAllResultsForSchool(schoolId: string): Promise<QuizResultSummaryDTO[]> {
    const quizzes = await QuizModel.find({ schoolId }, { _id: 1 });
    const quizIds = quizzes.map((q: any) => q._id.toString());

    if (quizIds.length === 0) return [];

    const results = await this.quizResultRepo.findByQuizIds(quizIds);

    return results.map((r: any) => ({
      resultId: r._id.toString(),
      student: {
        id: r.studentId._id.toString(),
        fullName: r.studentId.fullName,
        email: r.studentId.email,
        className: r.studentId.className,
      },
      quiz: {
        id: r.quizId._id.toString(),
        subject: r.quizId.subject,
        classLevel: r.quizId.classLevel,
        startTime: r.quizId.startTime,
        endTime: r.quizId.endTime,
      },
      totalQuestions: r.totalQuestions,
      correctAnswers: r.correctAnswers,
      wrongAnswers: r.wrongAnswers,
      accuracy: this.calcAccuracy(r.correctAnswers, r.totalQuestions),
      timeTaken: r.timeTaken,
      completedAt: r.createdAt,
    }));
  }
}