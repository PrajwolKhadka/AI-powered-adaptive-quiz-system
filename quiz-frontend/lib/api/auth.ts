import axiosInstance from "./axios";
import { API } from "./endpoints";

export const registerSchoolApi = async (data: any) => {
  try {
    const res = await axiosInstance.post(API.AUTH.REGISTER_SCHOOL, data);
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Registration failed"
    );
  }
};

export const loginSchoolApi = async (data: any) => {
  try {
    const res = await axiosInstance.post(API.AUTH.LOGIN, data);
    return res.data;
  } catch (err: any) {
    // throw new Error(
    //   err.response?.data?.message || "Login failed"
    // );
    const message =
      err.response?.data?.message || // backend message
      err.response?.data?.error ||   // fallback if backend uses 'error'
      "Invalid credentials";          // default
    throw new Error(message);
  }
};

export const studentLoginApi = async (data: any)=> {
  try{
    const res= await axiosInstance.post(API.AUTH.STUD_LOGIN, data);
    return res.data;
  }
  catch(err: any){
    const message = err.response?.data?.message || err.response?.data?.error || "Invalid Credentials";
    throw new Error(message);
  }
};


export const forgotPasswordApi = async (data: { email: string }) => {
  try {
    const res = await axiosInstance.post(API.AUTH.FORGOT_PASSWORD, data);
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Failed to send reset link";
    throw new Error(message);
  }
};

export const resetPasswordApi = async (data: { token: string; newPassword: string }) => {
  try {
    const res = await axiosInstance.put(API.AUTH.RESET_PASSWORD, data);
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Failed to reset password";
    throw new Error(message);
  }
};