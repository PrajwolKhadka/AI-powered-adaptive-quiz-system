import axiosInstance from "./axios";
import {API} from "./endpoints";

export const QuizAPI = {
  uploadCSV: async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(API.QUIZ.UPLOAD_CSV, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getQuestions: async () => {
    const res = await axiosInstance.get(API.QUIZ.GET_QUESTIONS);
    return res.data.questions;
  },

  updateQuestion: async (question: any) => {
    const res = await axiosInstance.put(`${API.QUIZ.UPDATE_QUESTION}/${question._id}`, question);
    return res.data;
  },

  deleteQuestion: async (id: string) => {
    const res = await axiosInstance.delete(`${API.QUIZ.DELETE_QUESTION}/${id}`);
    return res.data;
  },

  deleteBatchQuestions: async (questionIds: string[]) => {
    const res = await axiosInstance.post(API.QUIZ.DELETE_BATCH_QUESTIONS, { questionIds });
    return res.data;
  },

  toggleQuiz: async (data: { quizId?: string; classLevel: number; subject: string; durationMinutes: number; isActive: boolean }) => {
    const res = await axiosInstance.post(API.QUIZ.TOGGLE, data);
    return res.data;
  },

  getActiveQuiz: async () => {
    const res = await axiosInstance.get(API.QUIZ.ACTIVE_QUIZ);
    return res.data;
  },

  nextQuestion: async (quizId: string) => {
    const res = await axiosInstance.post(API.QUIZ.NEXT_QUESTION, { quizId });
    return res.data;
  },

  submitAnswer: async (quizId: string, questionId: string, selectedOption: string, timeTaken: number) => {
    const res = await axiosInstance.post(API.QUIZ.SUBMIT_ANSWER, {
      quizId,
      questionId,
      selectedOption,
      timeTaken,
    });
    return res.data;
  },
};
