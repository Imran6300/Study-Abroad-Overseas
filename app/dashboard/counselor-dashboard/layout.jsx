"use client";

/**
 * app/dashboard/counselor-dashboard/layout.jsx
 *
 * Auth guard: only role === "counselor" can access this area.
 * All other roles are redirected to their own dashboard via getDashboardPath().
 */

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { getDashboardPath } from "@/lib/roleRouting";

import CounselorSidebar from "@/components/counselordashboard/CounselorSidebar";
import CounselorDashboardHeader from "@/components/counselordashboard/CounselorDashboardHeader";
import CounselorFooter from "@/components/counselordashboard/CounselorFooter";
import OnboardingBanner from "@/components/counselordashboard/OnboardingBanner";
import SaasBanner from "@/components/counselordashboard/SaasBanner";
import { getSocket } from "@/lib/socket";

// NEW: Partner Subscription Engine
import { useDispatch, useSelector } from "react-redux";
import { fetchPartnerStatus } from "@/store/partnerSubscriptionSlice";
import PlanSelectionModal from "@/components/shared/subscription/PlanSelectionModal";
import SubscriptionBanner from "@/components/shared/subscription/SubscriptionBanner";

export default function CounselorLayout({ children }) {
  const { user, authChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const router = useRouter();
  const pathname = usePathname();

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "counselor") {
      router.replace(getDashboardPath(user.role));
    }
  }, [authChecked, user, router]);

  // ── Socket room join ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;
    const socket = getSocket();
    socket.emit("join-dashboard", user._id);
  }, [user?._id]);

  // ── NEW: Fetch partner subscription status on mount ─────────────────────
  // Only for independent counselors (adminId === null)
  useEffect(() => {
    if (user?._id && user?.role === "counselor" && !user?.adminId) {
      dispatch(fetchPartnerStatus());
    }
  }, [user?._id, dispatch]);

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
      {/* NEW: Blocking plan selection modal — renders over everything when trial ends */}
      <PlanSelectionModal />

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
          {/* NEW: Partner subscription warning banner (trial ending, settlement due) */}
          {!shouldHideHeader && (
            <SubscriptionBanner dashboardPath="/dashboard/counselor-dashboard" />
          )}

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
