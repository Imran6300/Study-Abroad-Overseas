"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/dashboard/user/page.jsx
// Fully wired student dashboard overview page.
// Reads counselor branding from Redux and passes it into branded components.
// ─────────────────────────────────────────────────────────────────────────────

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { fetchMyLead } from "@/store/leadSlice";
import { selectActiveBranding } from "@/store/brandingSlice";

import BrandedDashboardHeader from "@/components/userdashboard/DashboardHeader";
import ProfileCompletionCard from "@/components/userdashboard/ProfileCompletionCard";
import QuickStats from "@/components/userdashboard/QuickStats";
import DeadlinesCard from "@/components/userdashboard/DeadlinesCard";
import OverviewApplicationsCard from "@/components/userdashboard/OverviewApplicationsCard";
import RecommendedUniversities from "@/components/userdashboard/RecommendedUniversities";
import ApplicationActivityFeed from "@/components/userdashboard/Applicationactivityfeed";
import CounselorBrandedBanner from "@/components/userdashboard/CounselorBrandedBanner";

export default function DashboardPage() {
  const { user, authChecked } = useSelector((state) => state.auth);
  const { lead, fetched } = useSelector((state) => state.lead);
  const branding = useSelector(selectActiveBranding);

  const dispatch = useDispatch();
  const router = useRouter();
  const notificationRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const isCounselorStudent = !!user?.counselorOwner;

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch dashboard overview
  useEffect(() => {
    if (!user) return;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/overview`,
          { credentials: "include" },
        );
        const data = await res.json();
        if (data.success) setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  // Fetch lead data
  useEffect(() => {
    if (!fetched) dispatch(fetchMyLead());
  }, [fetched, dispatch]);

  // Auth redirect
  useEffect(() => {
    if (authChecked && !user) router.replace("/login");
  }, [authChecked, user, router]);

  const handleWithdraw = async (id) => {
    if (!confirm("Withdraw this application?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${id}/withdraw`,
        { credentials: "include", method: "DELETE" },
      );
      if (res.ok) {
        setDashboard((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            applications: {
              ...prev.applications,
              recent: prev.applications.recent.filter((app) => app._id !== id),
              total: Math.max(0, prev.applications.total - 1),
            },
          };
        });
      } else {
        const data = await res.json();
        console.error("Withdraw failed:", data.message);
      }
    } catch (err) {
      console.error("handleWithdraw error:", err);
    }
  };

  // ── Loading / auth states ──────────────────────────────────────────────
  if (!authChecked)
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{ background: branding.secondaryColor }}
      >
        Loading…
      </div>
    );
  if (!user) return null;

  if (loading || !dashboard) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{ background: branding.secondaryColor }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: branding.primaryColor,
              borderTopColor: "transparent",
            }}
          />
          <p className="text-sm" style={{ color: `${branding.accentColor}88` }}>
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  const {
    profile,
    applications,
    deadlines,
    visa,
    savedUniversities,
    quickStats,
    recentActivity,
  } = dashboard;

  return (
    <div
      className="min-h-screen space-y-6 relative overflow-x-hidden"
      style={{ background: branding.secondaryColor }}
    >
      {/* Background ambient blobs — use brand colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: branding.primaryColor }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: branding.primaryColor }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 lg:space-y-8">
        {/* Branded banner — shown only for counselor students */}
        {isCounselorStudent && branding.brandingEnabled && (
          <CounselorBrandedBanner branding={branding} />
        )}

        {/* Branded header */}
        <BrandedDashboardHeader user={user} branding={branding} />

        {/* Profile Completion */}
        <ProfileCompletionCard
          progress={profile.profileCompletion}
          router={router}
        />

        {/* Quick Stats */}
        <QuickStats
          applications={applications.total}
          shortlistedCount={savedUniversities.total}
          upcomingDeadlines={deadlines.urgent}
          visaStatus={visa.overallStatus}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <DeadlinesCard upcomingDeadlines={deadlines.urgent} />
          <OverviewApplicationsCard
            applications={applications.recent}
            router={router}
          />
        </div>

        <ApplicationActivityFeed />
        <RecommendedUniversities universities={savedUniversities.recent} />
      </div>
    </div>
  );
}
