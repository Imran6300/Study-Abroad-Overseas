"use client";

/**
 * app/dashboard/counselor-dashboard/layout.jsx
 *
 * CHANGES vs original:
 *
 * 1. Content left-offset corrected:
 *    - Original: `pl-[68px]` — wrong, sidebar collapses to 82px not 68px.
 *    - Fixed:    `lg:pl-[82px]` — matches the collapsed sidebar width exactly.
 *
 * 2. Mobile top-bar spacing added:
 *    - On mobile (<lg) the sidebar is hidden and a 56px top bar is shown.
 *    - Content needs `pt-14` on mobile to clear that top bar.
 *    - On desktop the top bar is hidden so no top padding needed.
 *    - Combined class: `pt-14 lg:pt-0 lg:pl-[82px]`
 *
 * Everything else — auth guard, socket join, header visibility logic,
 * page title logic — is identical to the original.
 */

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

import CounselorSidebar from "@/components/counselordashboard/CounselorSidebar";
import CounselorDashboardHeader from "@/components/counselordashboard/CounselorDashboardHeader";
import { getSocket } from "@/lib/socket";

export default function CounselorLayout({ children }) {
  const { user, authChecked } = useSelector((state) => state.auth);

  const router = useRouter();
  const pathname = usePathname();

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.replace("/login");
    } else if (user.role !== "counselor") {
      router.replace("/dashboard/user");
    }
  }, [authChecked, user, router]);

  // ── Socket room join ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;
    const socket = getSocket();
    socket.emit("join-dashboard", user._id);
  }, [user?._id]);

  // ── Loading state ───────────────────────────────────────────────────────
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

  // ── Header visibility ───────────────────────────────────────────────────
  // Settings page has its own full-page layout (sticky nav + live preview),
  // so we suppress the global dashboard header there.
  const hideHeaderRoutes = ["/dashboard/counselor-dashboard/settings"];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname);

  // ── Page title (for global header) ─────────────────────────────────────
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
      {/* Sidebar — renders its own desktop sidebar + mobile top bar + mobile drawer */}
      <CounselorSidebar />

      {/*
        Content wrapper offsets:
          mobile  → pt-14        (clear the 56px mobile top bar; no left offset — sidebar is hidden)
          desktop → lg:pt-0      (no top bar on desktop)
                    lg:pl-[82px] (clear the collapsed 82px sidebar)
      */}
      <div className="pt-14 lg:pt-0 lg:pl-[82px] min-h-screen flex flex-col">
        {/* Global dashboard header (hidden on settings page) */}
        {!shouldHideHeader && (
          <CounselorDashboardHeader
            title={getPageTitle()}
            counselorName={user?.name}
          />
        )}

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
