"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import {
  faLocalization,
  loginLocalization,
} from "@/app/constants/localization/fa/localization";
import { toast } from "react-toastify";

const AuthButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const updateAuth = () => {
    const savedEmail = localStorage.getItem("email");
    setEmail(savedEmail ? savedEmail.split("@")[0] : "");

    const token = localStorage.getItem("authToken");
    const loginTime = localStorage.getItem("loginTime");
    const fromAdmin = document.cookie.includes("fromAdmin=true");

    const isTokenValid = () => {
      if (!token || !loginTime) return false;
      const oneHour = 60 * 60 * 1000;
      return Date.now() - parseInt(loginTime) <= oneHour;
    };

    setIsAdmin(!!token && isTokenValid() && fromAdmin);
  };

  useEffect(() => {
    updateAuth();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken" && !event.newValue) {
        setEmail("");
        localStorage.removeItem("email");
        setIsAdmin(false);
        toast.success(loginLocalization.logoutSuccessfully);
      }
    };

    const handleAuthChange = () => {
      updateAuth();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        updateAuth();
      }
    };

    const handleFocus = () => {
      updateAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("email");
    localStorage.removeItem("username");

    toast.success(loginLocalization.logoutSuccessfully);
    setEmail("");
    setIsAdmin(false);

    window.dispatchEvent(new Event("authChange"));
    window.location.href = "/login";
  };

  return (
    <div className="relative">
      {showLogoutPopup && (
        <div className="absolute top-10 left-0 bg-gray-50 shadow-lg p-4 rounded-lg w-48 z-50">
          <p className="text-sm text-primary">
            {loginLocalization.wannaLogout}
          </p>
          <div className="flex justify-between mt-2">
            <button
              onClick={handleLogout}
              className="text-red-500 text-sm hover:text-red-700"
            >
              {loginLocalization.yes}
            </button>
            <button
              onClick={() => setShowLogoutPopup(false)}
              className="text-green-400 text-sm hover:text-green-600"
            >
              {loginLocalization.no}
            </button>
          </div>
        </div>
      )}

      <Link href={isAdmin ? "/admin" : "/login"}>
        <div className="flex justify-center items-center border border-primary rounded-2xl hover:scale-105 hover:border-primary">
          <FaRegUser
            size={32}
            className="bg-light p-[7px] rounded-r-2xl text-primary"
          />
          <button className="cursor-pointer bg-light text-primary text-sm pl-3 pt-1 pb-2 rounded-l-2xl">
            {isAdmin ? (
              faLocalization.management
            ) : email ? (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogoutPopup(true);
                }}
              >
                {email}
              </span>
            ) : (
              faLocalization.loginOrRegister
            )}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default AuthButton;
