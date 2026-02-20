export interface SubmitAnswerDTO {
  quizId: string;
  questionId: string;
  selectedOption: "a" | "b" | "c" | "d";
  timeTaken: number;
}

export interface NextQuestionDTO {
  quizId: string;
}
