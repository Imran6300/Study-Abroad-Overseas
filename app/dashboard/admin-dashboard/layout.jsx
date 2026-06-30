"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDashboardPath } from "@/lib/roleRouting";

export default function AdminLayout({ children }) {
  const { user, authChecked } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Only super_admin is allowed here.
    // admin (Org Admin) goes to /dashboard/org-admin
    // All others go to their own dashboard.
    if (user.role !== "super_admin") {
      router.replace(getDashboardPath(user.role));
    }
  }, [authChecked, user, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        Checking admin access...
      </div>
    );
  }

  if (!user || user.role !== "super_admin") {
    return null;
  }

  return <div className="flex min-h-screen">{children}</div>;
}
