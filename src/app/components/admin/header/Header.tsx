"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/app/assets/images/logo.png";
import admin from "@/app/assets/images/admin.jpg";
import { adminHeaderLocalization } from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import axios from "axios";
import { getAuthToken } from "@/app/base/getAuthToken";
import { AdminDataProps } from "@/app/types/users";

export default function AdminHeader({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [adminUserName, setAdminUserName] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getAuthToken();
    const userEmail = localStorage.getItem("email");

    const fetchAdminName = async () => {
      try {
        const res = await axios(`${BASE_url}/api/records/admins`, {
          headers: { api_key: API_KEY, Authorization: `Bearer ${token}` },
        });
        const admins = res.data.records;
        if (!userEmail) throw new Error("No user email found in localStorage");
        const currentAdmin = admins.find(
          (admin: AdminDataProps) => admin.email === userEmail
        );
        if (currentAdmin) {
          const fullName = `${currentAdmin.firstName} ${currentAdmin.lastName}`;
          setAdminUserName(fullName);
        } else {
          console.warn("Admin with email not found");
          setAdminUserName(adminHeaderLocalization.dearAdmin);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setAdminUserName(adminHeaderLocalization.dearAdmin);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminName();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const weekday = now.toLocaleDateString("fa-IR", { weekday: "long" });
      const day = now.toLocaleDateString("fa-IR", { day: "numeric" });
      const month = now.toLocaleDateString("fa-IR", { month: "long" });
      const year = now.toLocaleDateString("fa-IR", { year: "numeric" });

      const date = ` ${day}  ${month}  ${year} - ${weekday}`;

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
        <div className="flex flex-col md:flex-row gap-2 justify-between flex-1 px-4">
          <div className="flex items-center gap-2">
            <Image
              src={admin}
              alt={"admin"}
              className="w-12 h-12 animate-bounce hidden md:block"
            />
            <span>
              {adminHeaderLocalization.hi}{" "}
              <span className="text-primary font-semibold">
                {loading ? (
                  <span>...</span>
                ) : adminUserName ? (
                  adminUserName
                ) : (
                  adminHeaderLocalization.dearAdmin
                )}
              </span>{" "}
              {adminHeaderLocalization.dear}
            </span>
          </div>

          <div className="flex gap-2 items-center justify-between">
            <span className="text-xs text-gray-600 flex gap-2">
              🕒 {currentTime}
            </span>
            <div className="w-20 h-20 mx-6 border border-primary md:bg-secondary rounded-full hidden lg:flex items-center justify-center">
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
