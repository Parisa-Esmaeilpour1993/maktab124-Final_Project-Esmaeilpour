"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "../components/admin/asideBar/AsideBar";
import AdminHeader from "../components/admin/header/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex relative">
      <AdminSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      <div className="flex flex-col flex-1 min-h-screen">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
