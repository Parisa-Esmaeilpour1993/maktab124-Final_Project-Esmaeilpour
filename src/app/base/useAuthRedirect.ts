"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthRedirect = (redirectPath: string = "/login") => {
  const router = useRouter();

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("authToken");
      const loginTime = localStorage.getItem("loginTime");

      if (!token || !loginTime) return false;

      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      return now - parseInt(loginTime) <= oneHour;
    };

    const interval = setInterval(() => {
      if (!checkTokenValidity()) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        router.push(redirectPath);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [router, redirectPath]);
};
