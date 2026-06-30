"use client";

/**
 * app/dashboard/org-admin/layout.jsx
 *
 * Layout for the White-Label Admin (Organization) dashboard.
 * Route: /dashboard/org-admin/*
 *
 * Auth guard: only role === "admin" can access this area.
 * All other roles are redirected to their own dashboard via getDashboardPath().
 *
 * Does NOT share the counselor sidebar — has its own OrgAdminSidebar.
 */

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { getDashboardPath } from "@/lib/roleRouting";

import OrgAdminSidebar from "@/components/orgadmin/OrgAdminSidebar";
import OrgAdminHeader from "@/components/orgadmin/OrgAdminHeader";

// NEW: Partner Subscription Engine
import { useDispatch } from "react-redux";
import { fetchPartnerStatus } from "@/store/partnerSubscriptionSlice";
import PlanSelectionModal from "@/components/shared/subscription/PlanSelectionModal";
import SubscriptionBanner from "@/components/shared/subscription/SubscriptionBanner";

export default function OrgAdminLayout({ children }) {
  const { user, authChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    // Only role === "admin" (Org Admin) is allowed here
    if (user.role !== "admin") {
      router.replace(getDashboardPath(user.role));
    }
  }, [authChecked, user, router]);

  // ── NEW: Fetch partner subscription status on mount ───────────────────────
  useEffect(() => {
    if (user?._id && user?.role === "admin") {
      dispatch(fetchPartnerStatus());
    }
  }, [user?._id, dispatch]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white/40 text-sm">
        Checking organization access...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // ── Page title ────────────────────────────────────────────────────────────
  const getPageTitle = () => {
    if (pathname === "/dashboard/org-admin") return "Overview";
    if (pathname === "/dashboard/org-admin/counselors") return "Counselors";
    if (pathname === "/dashboard/org-admin/students") return "Students";
    if (pathname.startsWith("/dashboard/org-admin/students/"))
      return "Student Detail";
    if (pathname === "/dashboard/org-admin/applications") return "Applications";
    if (pathname === "/dashboard/org-admin/settings")
      return "Organisation Settings";
    return "Organisation Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#081525]">
      {/* NEW: Blocking plan selection modal — renders over everything when trial ends */}
      <PlanSelectionModal />

      {/* Sidebar */}
      <OrgAdminSidebar />

      <div className="pt-14 lg:pt-0 lg:pl-[82px] min-h-screen flex flex-col">
        {/* Header */}
        <OrgAdminHeader title={getPageTitle()} adminName={user?.name} />

        {/* NEW: Partner subscription warning banner */}
        <SubscriptionBanner dashboardPath="/dashboard/org-admin" />

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Footer — respects removeKhizarBranding at this layout level */}
        <OrgAdminFooter />
      </div>
    </div>
  );
}

/**
 * OrgAdminFooter
 * Reads the Organization branding from Redux to decide whether to show
 * "Powered by Khizar Overseas" or the custom footer text.
 * This replaces the hardcoded footer that was previously in the layout.
 */
function OrgAdminFooter() {
  const org = useSelector((state) => state.orgAdmin?.organization);
  const removeKhizar = org?.features?.removeKhizarBranding ?? false;
  const footerText = org?.branding?.footerText ?? "";

  if (removeKhizar) {
    // Show custom footer text if set, otherwise show nothing
    if (!footerText) return null;
    return (
      <footer className="py-4 px-6 text-center text-xs text-white/20 border-t border-white/[0.05]">
        {footerText}
      </footer>
    );
  }

  return (
    <footer className="py-4 px-6 text-center text-xs text-white/20 border-t border-white/[0.05]">
      {footerText || "Powered by Khizar Overseas"} &mdash; Organisation
      Dashboard
    </footer>
  );
}
