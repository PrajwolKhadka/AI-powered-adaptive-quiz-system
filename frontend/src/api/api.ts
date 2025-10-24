import axios from "axios";

const API_URL = "http://localhost:5000/api"; // backend

export const fetchQuestion = async (difficulty: string) => {
  const res = await axios.get(`${API_URL}/question?difficulty=${difficulty}`);
  return res.data;
};

export const submitResult = async (userId: number, score: number, answers: any) => {
  const res = await axios.post(`${API_URL}/result`, { userId, score, psychometric: answers });
  return res.data;
};
