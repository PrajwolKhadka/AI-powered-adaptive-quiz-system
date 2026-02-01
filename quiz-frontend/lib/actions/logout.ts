"use server";

import { clearAuthCookies } from "@/lib/cookies";

export const logoutAction = async () => {
  await clearAuthCookies();
};
