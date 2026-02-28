import { StudentAnswerRepository } from "../repositories/studentAnswer.repository";
import { QuizRepository } from "../repositories/quiz.repository";
import { QuestionRepository } from "../repositories/question.repository";
import { SubmitAnswerDTO, NextQuestionDTO } from "../dtos/studentQuiz.dto";
import { difficultyMap } from "../utils/difficulty";
import { sigmoid } from "../utils/sigmoid";
import { QuizResultModel } from "../models/quizResult.model";
import { QuizModel } from "../models/quiz.model";
import { AIFeedbackService } from "./aiFeedback.service";

const POOL_SIZE = 25;
const DIFFICULTY_TIERS = [-2, -1, 0, 1, 2];
const PER_TIER = Math.floor(POOL_SIZE / DIFFICULTY_TIERS.length); // 5 each

export class StudentQuizService {
  private aiService = new AIFeedbackService();
  private studentAnswerRepo = new StudentAnswerRepository();
  private quizRepo = new QuizRepository();
  private questionRepo = QuestionRepository;

  async submitAnswer(studentId: string, dto: SubmitAnswerDTO) {
    const question = await this.questionRepo.findById(dto.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    const alreadyAnswered = await this.studentAnswerRepo.hasAnswered(
      studentId,
      dto.quizId,
      dto.questionId,
    );
    if (alreadyAnswered) {
      throw new Error("Question already answered");
    }

    const isCorrect = question.correctAnswer === dto.selectedOption;

    await this.studentAnswerRepo.create({
      studentId,
      quizId: dto.quizId,
      questionId: dto.questionId,
      subject: question.subject,
      difficulty: difficultyMap[question.difficulty],
      timeTaken: dto.timeTaken,
      correct: isCorrect,
    });

    return { correct: isCorrect };
  }

  async getActiveQuizForStudent(classLevel: number) {
    const now = new Date();

    const activeQuiz = await QuizModel.findOne({
      classLevel,
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gt: now },
    });

    return activeQuiz;
  }

  async getNextQuestion(studentId: string, dto: NextQuestionDTO) {
    const quiz = await this.quizRepo.findByIdWithQuestions(dto.quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Quiz expiry check
    const now = new Date();
    if (!quiz.isActive) {
      throw new Error("Quiz is not active");
    }
    if (quiz.startTime && quiz.endTime && now > quiz.endTime) {
      await this.quizRepo.updateById(dto.quizId, { isActive: false });
      throw new Error("Quiz has expired");
    }

    let studentQuizQuestions = await this.studentAnswerRepo.getQuizQuestionPool(
      studentId,
      dto.quizId,
    );

    if (!studentQuizQuestions) {

      const allQuestions = quiz.questionIds as any[];

      const stratifiedPool: string[] = [];
      for (const tier of DIFFICULTY_TIERS) {
        const tierQs = allQuestions
          .filter((q: any) => difficultyMap[q.difficulty] === tier)
          .sort(() => Math.random() - 0.5)
          .slice(0, PER_TIER)
          .map((q: any) =>
            typeof q === "object" ? q._id.toString() : q.toString(),
          );
        stratifiedPool.push(...tierQs);
      }

      const stratifiedIds = new Set(stratifiedPool);
      const remaining = allQuestions
        .filter((q: any) => {
          const id = typeof q === "object" ? q._id.toString() : q.toString();
          return !stratifiedIds.has(id);
        })
        .sort(() => Math.random() - 0.5)
        .slice(0, POOL_SIZE - stratifiedPool.length)
        .map((q: any) =>
          typeof q === "object" ? q._id.toString() : q.toString(),
        );

      studentQuizQuestions = [...stratifiedPool, ...remaining];

      await this.studentAnswerRepo.setQuizQuestionPool(
        studentId,
        dto.quizId,
        studentQuizQuestions,
      );
    }

    const answeredIds = await this.studentAnswerRepo.getAnsweredQuestionIds(
      studentId,
      dto.quizId,
    );

    const poolAnsweredCount = answeredIds.filter((id) =>
      studentQuizQuestions!.includes(id),
    ).length;

    if (poolAnsweredCount >= studentQuizQuestions.length) {
      return await this.finalizeQuiz(studentId, dto.quizId);
    }

    const previousAnswers = await this.studentAnswerRepo.findByStudentAndQuiz(
      studentId,
      dto.quizId,
    );
    const uniquePreviousAnswers = this.deduplicateAnswers(previousAnswers);
    const remainingQuestions = (quiz.questionIds as any[]).filter((q: any) => {
      const id = typeof q === "object" ? q._id.toString() : q.toString();
      const inPool = studentQuizQuestions!.includes(id);
      const notAnswered = !answeredIds.includes(id);
      return inPool && notAnswered;
    });

    if (remainingQuestions.length === 0) {
      throw new Error("No remaining questions found");
    }

    // Adaptive selection via Item Response Theory
    const totalAttempts = uniquePreviousAnswers.length;

    const userAccuracy = (() => {
      if (uniquePreviousAnswers.length === 0) return 0.5;
      // Weight recent answers more heavily
      const weighted = uniquePreviousAnswers.reduce((sum, a, i) => {
        const weight = i + 1;
        return sum + (a.correct ? weight : 0);
      }, 0);
      const totalWeight = uniquePreviousAnswers.reduce(
        (sum, _, i) => sum + i + 1,
        0,
      );
      return weighted / totalWeight;
    })();

    const recentAnswers = uniquePreviousAnswers.slice(-5);
    const recentCorrect = recentAnswers.filter((a) => a.correct).length;
    const recentAccuracy =
      recentAnswers.length > 0 ? recentCorrect / recentAnswers.length : 0.5;

    //mastery or floor detection
    if (recentAnswers.length >= 5) {
      const allCorrect = recentAnswers.every((a) => a.correct);
      const allAtFloor = recentAnswers.every((a) => a.difficulty <= -1);
      const allWrong = recentAnswers.every((a) => !a.correct);
      const allAtCeiling = recentAnswers.every((a) => a.difficulty >= 1);

      if (allCorrect && allAtFloor && userAccuracy > 0.85) {
        console.log("Mastery detected — ending quiz early");
        return await this.finalizeQuiz(studentId, dto.quizId);
      }

      if (allWrong && allAtCeiling) {
        console.log("Student overwhelmed — ending quiz early");
        return await this.finalizeQuiz(studentId, dto.quizId);
      }
    }

    const avgTime =
      totalAttempts > 0
        ? uniquePreviousAnswers.reduce((sum, a) => sum + a.timeTaken, 0) /
          totalAttempts
        : 10;

    let difficultyBias = 0;
    if (recentAnswers.length >= 3) {
      if (recentCorrect === 0) {
        difficultyBias = -1; // recent struggle → easier
      } else if (recentCorrect === recentAnswers.length && userAccuracy > 0.6) {
        difficultyBias = +1; // recent success + overall doing well → harder
      }
    }

    let bestQuestion = remainingQuestions[0];
    let closestDistance = Infinity;

    for (const q of remainingQuestions) {
      const difficulty = difficultyMap[q.difficulty] ?? 0;
      const adjustedDifficulty = difficulty - difficultyBias;

      const z =
        -3 * adjustedDifficulty + 4 * userAccuracy + 2 * recentAccuracy;
      const probability = sigmoid(z);
      const distance = Math.abs(probability - 0.7);

      if (distance < closestDistance) {
        closestDistance = distance;
        bestQuestion = q;
      }
    }

    if (closestDistance > 0.4) {
      console.warn(
        `IRT selection degraded (closestDistance=${closestDistance.toFixed(2)}) — falling back to random remaining question`,
      );
      bestQuestion =
        remainingQuestions[
          Math.floor(Math.random() * remainingQuestions.length)
        ];
    }

    const rawQuestion: any = bestQuestion.toObject
      ? bestQuestion.toObject()
      : bestQuestion;

    const questionForStudent = {
      _id: rawQuestion._id.toString(),
      text: rawQuestion.question || "Question text missing",
      options: Object.entries(rawQuestion.options || {}).map(
        ([key, value]) => ({ key, text: value }),
      ),
      difficulty: rawQuestion.difficulty,
      subject: rawQuestion.subject,
      progress: {
        answered: poolAnsweredCount,
        total: studentQuizQuestions.length,
      },
    };

    return { question: questionForStudent };
  }

  private async finalizeQuiz(studentId: string, quizId: string) {
    const previousAnswers = await this.studentAnswerRepo.findByStudentAndQuiz(
      studentId,
      quizId,
    );

    const uniqueAnswers = this.deduplicateAnswers(previousAnswers);

    const totalQuestions = uniqueAnswers.length;
    const correctAnswers = uniqueAnswers.filter((a) => a.correct).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const timeTaken = uniqueAnswers.reduce((sum, a) => sum + a.timeTaken, 0);

    const subjectMap: Record<string, { correct: number; total: number }> = {};
    for (const a of uniqueAnswers) {
      if (!subjectMap[a.subject]) {
        subjectMap[a.subject] = { correct: 0, total: 0 };
      }
      subjectMap[a.subject].total++;
      if (a.correct) subjectMap[a.subject].correct++;
    }

    const weakSubjects = Object.entries(subjectMap)
      .filter(([, v]) => v.correct / v.total < 0.5)
      .map(([subject]) => subject);

    const avgTime = totalQuestions > 0 ? timeTaken / totalQuestions : 0;

    let aiFeedback = "AI feedback unavailable.";
    try {
      aiFeedback = await this.aiService.generateQuizFeedback({
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        weakSubjects,
        avgTime,
      });
    } catch (error) {
      console.error("Gemini Error:", error);
    }

    await QuizResultModel.findOneAndUpdate(
      { studentId, quizId },
      {
        studentId,
        quizId,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        timeTaken,
        aiFeedback,
        questionStats: uniqueAnswers.map((a) => ({
          questionId: a.questionId,
          correct: a.correct,
          timeTaken: a.timeTaken,
        })),
      },
      { upsert: true, new: true },
    );

    return {
      done: true,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      timeTakenSeconds: timeTaken,
      aiFeedback,
    };
  }

  private deduplicateAnswers(answers: any[]): any[] {
    const seen = new Set<string>();
    return answers.filter((a) => {
      const id = a.questionId.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }
}