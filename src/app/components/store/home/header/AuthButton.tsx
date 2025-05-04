"use client";
import { AnimatePresence, motion } from "framer-motion";

import {
  faLocalization,
  loginLocalization,
  logoutLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { getAuthToken } from "@/app/base/getAuthToken";
import axios from "axios";

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

    if (!isTokenValid()) {
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      setEmail("");
    }

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
        document.cookie =
          "loginAuthToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie =
          "fromAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        window.location.href = "/login";
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

  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("userIdi");
    localStorage.removeItem("user");
    document.cookie =
      "loginAuthToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    document.cookie =
      "fromAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
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
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: logoutLocalization.areYouSure,
                      customClass: {
                        title: "swal-title-small",
                      },
                      icon: "warning",
                      iconColor: "#67ae6e",
                      showCancelButton: true,
                      confirmButtonColor: "#67ae6e",
                      cancelButtonColor: "gray",
                      confirmButtonText: logoutLocalization.yesExit,
                      cancelButtonText: sweetAlert.cancel,
                    });

                    if (result.isConfirmed) {
                      try {
                        const cartId = localStorage.getItem("cartId");
                        const token = getAuthToken();
                        await axios.delete(
                          `${BASE_url}/api/records/cart/${cartId}`,
                          {
                            headers: {
                              "Content-Type": "application/json",
                              api_key: API_KEY,
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                      } catch (error) {
                        console.error("Error deleting cart:", error);
                      } finally {
                        handleLogout();
                      }
                    }
                  }}
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
                {username ? username : faLocalization.welCome}
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
