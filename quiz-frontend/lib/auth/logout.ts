"use client";

import { logoutAction } from "@/lib/actions/logout";

export const logout = async () => {
  try {
    await logoutAction();
  } finally {
    // client-side redirect
    window.location.replace("/login");
  }
};
