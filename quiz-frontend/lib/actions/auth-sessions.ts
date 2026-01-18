"use server";

import { getAuthToken, getUserData, clearAuthCookies } from "@/lib/cookies";

export const getAuthSession = async () => {
  const token = await getAuthToken();
  const user = await getUserData();

  return {
    isAuthenticated: !!token,
    user,
  };
};

export const logoutSession = async () => {
  await clearAuthCookies();
  return { success: true };
};
