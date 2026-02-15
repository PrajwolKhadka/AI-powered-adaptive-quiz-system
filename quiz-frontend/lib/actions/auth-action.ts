"use server";

import {
  registerSchoolApi,
  loginSchoolApi,
  forgotPasswordApi,
  resetPasswordApi,
  studentLoginApi
} from "../api/auth";
import { setAuthToken, setUserData } from "../cookies";

export const handleRegisterSchool = async (formData: any) => {
  try {
    const result = await registerSchoolApi(formData);

    if (result.success) {
      return {
        success: true,
        message: "Registration successful",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Registration failed",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const handleLoginSchool = async (formData: any) => {
  try {
    const result = await loginSchoolApi(formData);

    if (result.success) {
      await setAuthToken(result.token);
      await setUserData(result.data);

      return {
        success: true,
        message: "Login successful",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Login failed",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Invalid Credentials",
    };
  }
};

export const handleStudentLogin = async (formData: any) => {
  try{
    const result = await studentLoginApi(formData);
    if(result.success){
      await setAuthToken(result.token);
      await setUserData(result.data);
      return {
        success: true,
        message: "Login successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Login failed",
    };
  }
  catch(err: any){
    return {
      success: false,
      message: err.message || "Invalid Credentials",
    };
  }
};



export const handleForgotPassword = async (formData: { email: string }) => {
  try {
    const result = await forgotPasswordApi(formData);

    return {
      success: true,
      message: result.message || "Check your email for reset link",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to send reset link",
    };
  }
};

export const handleResetPassword = async (formData: {
  token: string;
  newPassword: string;
}) => {
  try {
    const result = await resetPasswordApi(formData);

    return {
      success: true,
      message: result.message || "Password reset successful",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to reset password",
    };
  }
};
