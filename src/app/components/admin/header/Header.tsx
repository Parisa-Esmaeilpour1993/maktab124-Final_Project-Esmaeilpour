"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUserCog } from "react-icons/fa";
import logo from "@/app/assets/images/logo.png";
import admin from "@/app/assets/images/admin.jpg";
import { adminHeaderLocalization } from "@/app/constants/localization/fa/localization";

export default function AdminHeader({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [adminUserName, setAdminUserName] = useState<string>("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setAdminUserName(username);
    }
  }, []);

  return (
    <header className=" shadow-xl rounded-xl pt-4 pb-[1px] flex items-center">
      <div className="border-b border-gray-300 rounded-xl flex-1 flex pb-3 items-center">
        <button
          onClick={toggleSidebar}
          className="text-black px-4 text-xl font-bold md:hidden"
        >
          ☰
        </button>
        <div className="flex justify-between flex-1 px-4">
          <div className="flex items-center gap-2">
            <Image
              src={admin}
              alt={"admin"}
              className="w-12 h-12 animate-bounce"
            />
            <span>
              {adminHeaderLocalization.hi}{" "}
              <span className="text-red-600">
                {adminUserName
                  ? adminUserName
                  : adminHeaderLocalization.dearAdmin}
              </span>{" "}
              {adminHeaderLocalization.dear}
            </span>
          </div>

          <div className="w-20 h-20 mx-6 border border-slate-700 bg-slate-900/50 rounded-full hidden lg:flex items-center justify-center">
            <Image
              src={logo}
              alt={"logo"}
              className="filter brightness-200 contrast-150 animate-pulse"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
