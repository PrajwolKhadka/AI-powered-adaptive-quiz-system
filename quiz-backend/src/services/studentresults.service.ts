import { QuizResultRepository } from "../repositories/quizresult.repository";
import {
  StudentQuizHistoryDTO,
  StudentQuizResultDetailDTO,
} from "../dtos/results.dto";

export class StudentResultsService {
  private quizResultRepo = new QuizResultRepository();

  private calcAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((correct / total) * 100).toFixed(1));
  }

  // All quiz results for a student — for history list + graph data
  async getStudentHistory(studentId: string): Promise<StudentQuizHistoryDTO[]> {
    const results = await this.quizResultRepo.findByStudent(studentId);

    return results.filter((r:any)=>r.quizId != null).map((r: any) => ({
      resultId: r._id.toString(),
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

  // Specific quiz result with AI feedback + question breakdown
  async getStudentResultDetail(
    studentId: string,
    quizId: string
  ): Promise<StudentQuizResultDetailDTO> {
    const result = await this.quizResultRepo.findByStudentAndQuiz(
      studentId,
      quizId
    );
    if (!result) throw new Error("Result not found");

    const populated: any = await result.populate(
      "quizId",
      "subject classLevel startTime endTime"
    );

    return {
      resultId: populated._id.toString(),
      quiz: {
        id: populated.quizId._id.toString(),
        subject: populated.quizId.subject,
        classLevel: populated.quizId.classLevel,
        startTime: populated.quizId.startTime,
        endTime: populated.quizId.endTime,
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

  // Graph-ready data — accuracy and score over time per subject
  async getPerformanceGraph(studentId: string) {
    const results = await this.quizResultRepo.findByStudent(studentId);

    // Group by subject
    const bySubject: Record<
      string,
      { date: Date; accuracy: number; score: number; total: number }[]
    > = {};

    for (const r of results as any[]) {
        if(!r.quizId) continue; 
      const subject = r.quizId?.subject ?? "Unknown";
      const accuracy = this.calcAccuracy(r.correctAnswers, r.totalQuestions);

      if (!bySubject[subject]) bySubject[subject] = [];

      bySubject[subject].push({
        date: r.createdAt,
        accuracy,
        score: r.correctAnswers,
        total: r.totalQuestions,
      });
    }

    // Sort each subject's data by date ascending for graph
    for (const subject of Object.keys(bySubject)) {
      bySubject[subject].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return bySubject;
  }
}