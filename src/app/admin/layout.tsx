"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "../components/admin/asideBar/AsideBar";
import AdminHeader from "../components/admin/header/Header";
import { useAuthRedirect } from "../base/useAuthRedirect";
import { isAdmin } from "../utils/isAdmin";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthRedirect();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!isAdmin(email)) {
      router.replace("/unauthorized");
    }
  }, []);
  return (
    <div className="flex relative overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      {sidebarOpen && (
        <div
          className="fixed top-0 inset-0 bg-black/30 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      <div className="flex flex-col flex-1 min-h-screen">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="p-4 overflow-y-auto max-h-[calc(100vh-61px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
