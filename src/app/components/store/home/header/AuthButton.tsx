// components/AuthButton.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { faLocalization } from "@/app/constants/localization/fa/localization";

const AuthButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const loginTime = localStorage.getItem("loginTime");
    const fromAdmin = document.cookie.includes("fromAdmin=true");

    const isTokenValid = () => {
      if (!token || !loginTime) return false;
      const oneHour = 60 * 60 * 1000;
      return Date.now() - parseInt(loginTime) <= oneHour;
    };

    setIsAdmin(!!token && isTokenValid() && fromAdmin);
  }, []);

  return (
    <Link href={isAdmin ? "/admin" : "/login"}>
      <div className="flex justify-center items-center border border-primary rounded-2xl hover:scale-105 hover:border-primary">
        <FaRegUser
          size={32}
          className="bg-light p-[7px] rounded-r-2xl text-primary"
        />
        <button className="cursor-pointer bg-light text-primary text-sm pl-3 pt-1 pb-2 rounded-l-2xl">
          {isAdmin ? faLocalization.management : faLocalization.loginOrRegister}
        </button>
      </div>
    </Link>
  );
};

export default AuthButton;
