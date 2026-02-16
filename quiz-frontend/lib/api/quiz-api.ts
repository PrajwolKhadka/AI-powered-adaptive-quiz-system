// /lib/api/quiz-api.ts
import axiosInstance from "./axios";
import {API} from "./endpoints";

export const QuizAPI = {
  // --- Upload CSV ---
  uploadCSV: async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(API.QUIZ.UPLOAD_CSV, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { inserted, failed, errors, message }
  },

  // --- Fetch all questions ---
  getQuestions: async () => {
    const res = await axiosInstance.get(API.QUIZ.GET_QUESTIONS);
    return res.data.questions;
  },

  // --- Update a single question ---
  updateQuestion: async (question: any) => {
    const res = await axiosInstance.put(`${API.QUIZ.UPDATE_QUESTION}/${question._id}`, question);
    return res.data;
  },

  // --- Delete a single question ---
  deleteQuestion: async (id: string) => {
    const res = await axiosInstance.delete(`${API.QUIZ.DELETE_QUESTION}/${id}`);
    return res.data;
  },

  // --- Batch delete questions ---
  deleteBatchQuestions: async (questionIds: string[]) => {
    const res = await axiosInstance.post(API.QUIZ.DELETE_BATCH_QUESTIONS, { questionIds });
    return res.data;
  },

  toggleQuiz: async (data: { quizId?: string; classLevel: number; subject: string; durationMinutes: number; isActive: boolean }) => {
    const res = await axiosInstance.post(API.QUIZ.TOGGLE, data);
    return res.data;
  }
};
