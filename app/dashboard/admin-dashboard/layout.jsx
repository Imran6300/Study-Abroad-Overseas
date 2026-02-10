"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { user, authChecked } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!authChecked) return;

    // Not logged in
    if (!user) {
      router.replace("/login");
    }
    // Logged in but NOT admin or super admin
    else if (user.role !== "admin" && user.role !== "super_admin") {
      router.replace("/dashboard/user");
    }
  }, [authChecked, user, router]);

  // ⛔ Wait until auth check is done
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        Checking admin access...
      </div>
    );
  }

  // ⛔ Prevent UI flash
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return null;
  }

  // ✅ Admin / Super Admin verified
  return (
    <div className="flex min-h-screen">
      {children}
    </div>
  );
}
