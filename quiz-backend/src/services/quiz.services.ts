import { QuizModel } from "../models/quiz.model";
import { QuestionModel } from "../models/questions.model";
import { ToggleQuizInput } from "../dtos/quiz.dto";

export const QuizService = {
  async toggleQuiz(schoolId: string, data: ToggleQuizInput) {
    const { quizId, classLevel, subject, durationMinutes, isActive } = data;

    if (quizId) {
      const quiz = await QuizModel.findOneAndUpdate(
        { _id: quizId, schoolId },
        {
          classLevel,
          subject,
          durationMinutes,
          isActive,
          startTime: isActive ? new Date() : null,
          endTime: isActive ? new Date(Date.now() + durationMinutes * 60000) : null,
        },
        { new: true }
      );

      if (!quiz) throw new Error("Quiz not found");
      return quiz;
    }

    const questions = await QuestionModel.find({ schoolId, subject }).select("_id");

    const quiz = await QuizModel.create({
      schoolId,
      classLevel,
      subject,
      questionIds: questions.map((q) => q._id),
      isActive,
      durationMinutes,
      startTime: isActive ? new Date() : null,
      endTime: isActive ? new Date(Date.now() + durationMinutes * 60000) : null,
    });

    return quiz;
  },
};
