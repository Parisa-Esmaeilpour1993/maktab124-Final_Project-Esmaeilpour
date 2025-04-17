"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/app/assets/images/logo.png";
import admin from "@/app/assets/images/admin.jpg";
import { adminHeaderLocalization } from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";

export default function AdminHeader({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [adminUserName, setAdminUserName] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setAdminUserName(username);
    }
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const date = now.toLocaleDateString("fa-IR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setCurrentTime(`${time} - ${date}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className=" shadow-accent rounded-b-xl pt-4 pb-[1px] flex items-center">
      <div className=" rounded-xl flex-1 flex pb-3 items-center">
        <Button
          onClick={toggleSidebar}
          children={"☰"}
          className=" px-4 text-xl mx-4 font-bold md:hidden"
        />
        <div className="flex justify-between flex-1 px-4">
          <div className="flex items-center gap-2">
            <Image
              src={admin}
              alt={"admin"}
              className="w-12 h-12 animate-bounce hidden md:block"
            />
            <span>
              {adminHeaderLocalization.hi}{" "}
              <span className="text-primary font-semibold">
                {adminUserName
                  ? adminUserName
                  : adminHeaderLocalization.dearAdmin}
              </span>{" "}
              {adminHeaderLocalization.dear}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-600 flex gap-2">
              🕒 {currentTime}
            </span>
            <div className="w-20 h-20 mx-6 border border-primary md:bg-secondary rounded-full hidden md:flex items-center justify-center">
              <Image
                src={logo}
                alt={"logo"}
                className="filter brightness-200 contrast-150 animate-pulse"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
