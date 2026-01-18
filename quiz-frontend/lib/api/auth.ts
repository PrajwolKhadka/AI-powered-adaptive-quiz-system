import axios from "./axios";
import { API } from "./endpoints";

export const registerSchoolApi = async (data: any) => {
  try {
    const res = await axios.post(API.AUTH.REGISTER_SCHOOL, data);
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Registration failed"
    );
  }
};

export const loginSchoolApi = async (data: any) => {
  try {
    const res = await axios.post(API.AUTH.LOGIN, data);
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Login failed"
    );
  }
};
