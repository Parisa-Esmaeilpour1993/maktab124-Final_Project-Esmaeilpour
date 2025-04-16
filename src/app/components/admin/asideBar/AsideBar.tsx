"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/app/assets/images/logo.png";
import { links } from "@/app/utils/adminLinks";
import { asideBarLocalization } from "@/app/constants/localization/fa/localization";

export default function AdminSidebar({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie =
      "fromAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const handleLinkClick = () => {
    setIsLoading(true);
    closeSidebar();
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-white border-t-transparent"></div>
            <span className="mt-4 text-white">لطفاً صبر کنید...</span>
          </div>
        </div>
      )}

      <aside
        className={`bg-gradient-to-b from-slate-800 to-slate-200 text-white shadow-2xl w-3/5 md:w-1/4 lg:w-1/5 fixed top-0 right-0 md:static h-screen overflow-y-auto z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-center mb-4">
          <Image
            src={logo}
            alt="logo"
            height={42}
            className="block pt-4 lg:hidden"
          />
          <span className="hidden lg:block text-3xl pt-4 font-extrabold text-red-700 dark:text-white animate-pulse">
            {asideBarLocalization.storeName}
          </span>
        </div>

        <nav className="flex flex-col p-4 gap-4">
          {links.map((link) => {
            const isActiveParent = link.children?.some(
              (child) => child.href === pathname
            );

            if (link.children) {
              return (
                <div key={link.id}>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`flex items-center justify-between pl-4 md:pl-1 lg:pl-4 text-right py-1 rounded-lg transition w-full hover:bg-slate-600 hover:px-3 ${
                      isActiveParent
                        ? "text-yellow-300 bg-slate-800 shadow-lg md:text-sm md:pl-2 md:pr-1 lg:text-[16px]"
                        : ""
                    }`}
                  >
                    <span>{link.label}</span>
                    <span>{isDropdownOpen ? "▲" : "▼"}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="flex flex-col gap-2 px-5 mt-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={`text-sm transition-all duration-150 hover:text-yellow-300 hover:-translate-y-1 ${
                            pathname === child.href
                              ? "text-red-500 py-1 px-4 font-semibold rounded-lg"
                              : ""
                          }`}
                          onClick={handleLinkClick}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (link.id === "home") {
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    document.cookie = "fromAdmin=true; path=/";
                    router.push(link.href);
                  }}
                  className={`transition-all duration-150 hover:text-yellow-300 hover:-translate-y-1 ${
                    pathname === link.href
                      ? "text-yellow-300 bg-slate-800 py-1 px-2 shadow-lg md:text-sm lg:text-[16px]"
                      : ""
                  }`}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`transition-all duration-150 hover:text-yellow-300 hover:-translate-y-1 ${
                  pathname === link.href
                    ? "text-yellow-300 bg-slate-800 py-1 px-2 shadow-lg rounded-lg md:text-sm lg:text-[16px]"
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-center bottom-2">
          <button
            className="w-9/12 p-2 mt-2 rounded-md bg-red-600 text-white active:scale-95 hover:bg-red-700"
            onClick={handleLogout}
          >
            {asideBarLocalization.exit}
          </button>
        </div>
      </aside>
    </>
  );
}
