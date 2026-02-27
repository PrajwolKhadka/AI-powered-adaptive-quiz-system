import axiosInstance from "./axios";
import { API } from "./endpoints";

export const ResultAPI = {

  getSchoolQuizzes: async () => {
    const res = await axiosInstance.get(API.RESULTS.GET_SCHOOL_QUIZZES);
    return res.data.quizzes;
  },

  getAllSchoolResults: async () => {
    const res = await axiosInstance.get(API.RESULTS.GET_SCHOOL_RESULTS);
    return res.data.results;
  },

  getQuizResults: async (quizId: string) => {
    const url = API.RESULTS.GET_QUIZ_RESULTS.replace(":quizId", quizId);
    const res = await axiosInstance.get(url);
    return res.data.results;
  },

  getStudentResultDetail: async (quizId: string, studentId: string) => {
    const url = API.RESULTS.GET_STUDENT_RESULT_DETAIL
      .replace(":quizId", quizId)
      .replace(":studentId", studentId);
    const res = await axiosInstance.get(url);
    return res.data.result;
  },

  getMyResults: async () => {
    const res = await axiosInstance.get(API.RESULTS.GET_STUDENT_RESULTS);
    return res.data;
  },

  getMyResultDetail: async (quizId: string) => {
    const url = API.RESULTS.GET_STUDENT_INDV_RESULTS.replace(":quizId", quizId);
    const res = await axiosInstance.get(url);
    return res.data.result;
  },
};