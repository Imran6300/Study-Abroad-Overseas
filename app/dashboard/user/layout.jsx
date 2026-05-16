"use client";

import Header from "@/components/Header/nav-bar";
import DashboardSidebar from "@/components/userdashboard/DashboardSidebar";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user, authChecked } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (authChecked && !user) {
      router.replace("/login");
    }
  }, [authChecked, user, router]);

  // While checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        Loading...
      </div>
    );
  }

  // Prevent dashboard render if not logged in
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col">
      {/* Top Navbar */}
      <Header />

      {/* Dashboard Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 pt-20 pb-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
