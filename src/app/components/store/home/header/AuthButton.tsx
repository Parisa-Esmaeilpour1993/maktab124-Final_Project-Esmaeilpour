"use client";
import { motion, AnimatePresence } from "framer-motion";

import { useEffect, useRef, useState } from "react";
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
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowLogoutPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    window.location.href = "/";
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showLogoutPopup && (
          <motion.div
            ref={popupRef}
            className="absolute top-10 left-0 bg-gray-50 shadow-lg p-4 rounded-lg w-56 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <ul className="space-y-2 text-sm text-primary">
              <li>
                <Link
                  href="/profile"
                  className="hover:text-secondary block"
                  onClick={() => setShowLogoutPopup(false)}
                >
                  👤 {faLocalization.userProfile}
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-secondary block"
                  onClick={() => setShowLogoutPopup(false)}
                >
                  📦 {faLocalization.orders}
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="hover:text-secondary block"
                  onClick={() => setShowLogoutPopup(false)}
                >
                  ❤️ {faLocalization.favorites}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700"
                >
                  🚪 {loginLocalization.wannaLogout}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href={!email ? "/login" : isAdmin ? "/admin" : "/"}>
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
                {faLocalization.welCome}
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
