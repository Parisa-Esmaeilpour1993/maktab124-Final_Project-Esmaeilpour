"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUserCog } from "react-icons/fa";
import logo from "@/app/assets/images/logo.png";
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
    <header className="bg-slate-700 text-white p-4 flex items-center">
      <button onClick={toggleSidebar} className="text-white md:hidden">
        ☰
      </button>
      <div className="flex justify-between flex-1">
        <div className="flex items-center gap-4">
          <FaUserCog size={24} />
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

        <Image
          src={logo}
          alt={"logo"}
          height={48}
          className="hidden md:block filter brightness-150 contrast-125"
        />
      </div>
    </header>
  );
}
