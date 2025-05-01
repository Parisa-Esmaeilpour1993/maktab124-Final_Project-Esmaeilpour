"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { links } from "@/app/utils/adminLinks";
import { asideBarLocalization } from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";

export default function AdminSidebar({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleLogout = () => {
    setIsLoad(true);

    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("email");

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoad(false);
    }
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
            <span className="mt-4 text-white">
              {asideBarLocalization.pleaseWait}
            </span>
          </div>
        </div>
      )}

      <aside
        className={`bg-secondary text-white shadow-2xl w-3/5 md:w-1/4 lg:w-1/5 fixed top-0 right-0 bottom-0 md:static h-screen overflow-y-auto z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-center mb-2">
          <span className="block text-3xl pt-3 font-extrabold text-light animate-pulse">
            {asideBarLocalization.storeName}
          </span>
        </div>

        <nav className="flex flex-col px-4 py-2 gap-[10px] text-sm">
          {links.map((link) => {
            const isActiveParent = link.children?.some(
              (child) => child.href === pathname
            );

            if (link.children) {
              return (
                <div key={link.id}>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`flex items-center justify-between pl-4 md:pl-1 lg:pl-4 text-right py-1 rounded-lg transition w-full hover:bg-primary hover:px-3 ${
                      isActiveParent
                        ? "text-light bg-primary shadow-lg md:text-sm md:pl-2 md:pr-1 lg:text-[16px]"
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
                          className={`text-sm transition-all duration-150 hover:text-gray-800 hover:-translate-y-1 ${
                            pathname === child.href
                              ? "text-primary bg-accent py-1 px-4 font-semibold rounded-lg"
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
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => {
                    setLoad(true);
                    document.cookie = "fromAdmin=true; path=/";
                  }}
                  className={`transition-all duration-150 hover:text-primary hover:font-semibold hover:-translate-y-1 ${
                    pathname === link.href
                      ? "text-primary bg-primary py-1 px-2 shadow-lg md:text-sm lg:text-[16px]"
                      : ""
                  }`}
                >
                  {load ? (
                    <div className="flex justify-center items-center h-full w-full">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    link.label
                  )}
                </Link>
              );
            }

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`transition-all duration-150 hover:text-gray-800 hover:-translate-y-1 ${
                  pathname === link.href
                    ? "text-light bg-accent py-1 px-2 shadow-lg rounded-lg md:text-sm lg:text-[16px]"
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="bottom-1 flex items-center justify-center w-full">
          <Button
            onClick={() => {
              setIsLoad(true);
              handleLogout();
            }}
            className="w-full mx-6 my-2 !bg-primary hover:!bg-accent"
          >
            {isLoad ? (
              <div className="flex justify-center items-center h-full w-full">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              asideBarLocalization.exit
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
