"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

import CounselorSidebar from "@/components/counselordashboard/CounselorSidebar";
import CounselorDashboardHeader from "@/components/counselordashboard/CounselorDashboardHeader";

export default function CounselorLayout({ children }) {
  const { user, authChecked } = useSelector((state) => state.auth);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.replace("/login");
    } else if (user.role !== "counselor") {
      router.replace("/dashboard/user");
    }
  }, [authChecked, user, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        Checking counselor access...
      </div>
    );
  }

  if (!user || user.role !== "counselor") {
    return null;
  }

  // ROUTES WHERE HEADER SHOULD BE HIDDEN
  const hideHeaderRoutes = ["/dashboard/counselor-dashboard/settings"];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname);

  const getPageTitle = () => {
    if (pathname === "/dashboard/counselor-dashboard") return "Dashboard";
    if (pathname === "/dashboard/counselor-dashboard/students")
      return "Student Management";
    if (pathname.startsWith("/dashboard/counselor-dashboard/students/"))
      return "Student Profile";
    if (pathname === "/dashboard/counselor-dashboard/khizar-applications")
      return "Managed Applications";
    if (
      pathname.startsWith("/dashboard/counselor-dashboard/khizar-applications/")
    )
      return "Application Details";
    if (pathname === "/dashboard/counselor-dashboard/settings")
      return "Settings";
    return "Counselor Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <CounselorSidebar />

      {/* CONTENT */}
      <div className="pl-[68px] min-h-screen flex flex-col">
        {/* GLOBAL HEADER */}
        {!shouldHideHeader && (
          <CounselorDashboardHeader
            title={getPageTitle()}
            counselorName={user?.name}
          />
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
