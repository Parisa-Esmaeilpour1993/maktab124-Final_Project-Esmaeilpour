"use client";

import { favoriteLocalization } from "@/app/constants/localization/fa/localization";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthorized(false);
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="border-t border-primary mx-4 py-24 flex items-center justify-center text-red-600">
        <p>{favoriteLocalization.loginError}</p>
      </div>
    );
  }

  return <>{children}</>;
}
