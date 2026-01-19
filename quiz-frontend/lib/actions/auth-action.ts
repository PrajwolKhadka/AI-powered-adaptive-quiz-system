"use server";

import { registerSchoolApi, loginSchoolApi } from "../api/auth";
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
