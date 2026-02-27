// School side DTOs

export interface QuizResultSummaryDTO {
  resultId: string;
  student: {
    id: string;
    fullName: string;
    email: string;
    className: number;
  };
  quiz: {
    id: string;
    subject: string;
    classLevel: number;
    startTime: Date | null;
    endTime: Date | null;
  };
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  timeTaken: number;
  completedAt: Date;
}

export interface QuizResultDetailDTO extends QuizResultSummaryDTO {
  aiFeedback: string;
  questionStats: {
    questionId: string;
    correct: boolean;
    timeTaken: number;
  }[];
}

// Student side DTOs

export interface StudentQuizHistoryDTO {
  resultId: string;
  quiz: {
    id: string;
    subject: string;
    classLevel: number;
    startTime: Date | null;
    endTime: Date | null;
  };
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  timeTaken: number;
  completedAt: Date;
}

export interface StudentQuizResultDetailDTO extends StudentQuizHistoryDTO {
  aiFeedback: string;
  questionStats: {
    questionId: string;
    correct: boolean;
    timeTaken: number;
  }[];
}