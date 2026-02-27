import axiosInstance from "./axios";
import { API } from "./endpoints";

export const ResultAPI = {
  // --- School: get all quizzes ---
  getSchoolQuizzes: async () => {
    const res = await axiosInstance.get(API.RESULTS.GET_SCHOOL_QUIZZES);
    return res.data.quizzes;
  },

  // --- School: all results across all quizzes ---
  getAllSchoolResults: async () => {
    const res = await axiosInstance.get(API.RESULTS.GET_SCHOOL_RESULTS);
    return res.data.results;
  },

  // --- School: all student results for one quiz ---
  getQuizResults: async (quizId: string) => {
    const url = API.RESULTS.GET_QUIZ_RESULTS.replace(":quizId", quizId);
    const res = await axiosInstance.get(url);
    return res.data.results;
  },

  // --- School: individual student result detail ---
  getStudentResultDetail: async (quizId: string, studentId: string) => {
    const url = API.RESULTS.GET_STUDENT_RESULT_DETAIL
      .replace(":quizId", quizId)
      .replace(":studentId", studentId);
    const res = await axiosInstance.get(url);
    return res.data.result;
  },

  // --- Student: full history + graph data ---
  getMyResults: async () => {
    const res = await axiosInstance.get(API.RESULTS.GET_STUDENT_RESULTS);
    return res.data;
  },

  // --- Student: specific quiz result with AI feedback ---
  getMyResultDetail: async (quizId: string) => {
    const url = API.RESULTS.GET_STUDENT_INDV_RESULTS.replace(":quizId", quizId);
    const res = await axiosInstance.get(url);
    return res.data.result;
  },
};