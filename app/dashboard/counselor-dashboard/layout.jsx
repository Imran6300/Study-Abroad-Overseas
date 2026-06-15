"use client";

/**
 * app/dashboard/counselor-dashboard/layout.jsx
 *
 * Changes vs previous version:
 *
 * 1. OnboardingBanner added inside <main>, above {children}.
 *    - Shown on login #1 and #2 only — self-managing via localStorage.
 *    - Has its own dismiss (X) button.
 *    - Only renders on non-settings pages (settings has its own full layout).
 *
 * 2. CounselorFooter already present (from previous update).
 *
 * Everything else — auth guard, socket join, header visibility, SaasBanner
 * comment — is unchanged.
 */

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

import CounselorSidebar from "@/components/counselordashboard/CounselorSidebar";
import CounselorDashboardHeader from "@/components/counselordashboard/CounselorDashboardHeader";
import CounselorFooter from "@/components/counselordashboard/CounselorFooter";
import OnboardingBanner from "@/components/counselordashboard/OnboardingBanner";
import SaasBanner from "@/components/counselordashboard/SaasBanner";
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

  // ── Header + banner visibility ──────────────────────────────────────────
  // Settings page has its own full-page layout (sticky nav + live preview),
  // so we suppress the global dashboard header AND onboarding banner there.
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
    if (pathname === "/dashboard/counselor-dashboard/manual")
      return "Dashboard Manual";
    return "Counselor Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CounselorSidebar />

      <div className="pt-14 lg:pt-0 lg:pl-[82px] min-h-screen flex flex-col">
        {/* Global header (hidden on settings page) */}
        {!shouldHideHeader && (
          <CounselorDashboardHeader
            title={getPageTitle()}
            counselorName={user?.name}
          />
        )}

        <main className="flex-1">
          {/* <div className="px-4 sm:px-6 lg:px-8 pt-4">
            <SaasBanner />
          </div> */}

          {/* Onboarding banner — only on non-settings pages, self-hides after 2 logins */}
          {!shouldHideHeader && <OnboardingBanner />}

          {children}
        </main>

        {/* Footer */}
        <CounselorFooter />
      </div>
    </div>
  );
}
