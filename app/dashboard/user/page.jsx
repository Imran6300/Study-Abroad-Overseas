"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { fetchMyLead } from "@/store/leadSlice";

import DashboardHeader from "@/components/userdashboard/DashboardHeader";
import ProfileCompletionCard from "@/components/userdashboard/ProfileCompletionCard";
import QuickStats from "@/components/userdashboard/QuickStats";
import DeadlinesCard from "@/components/userdashboard/DeadlinesCard";
import OverviewApplicationsCard from "@/components/userdashboard/OverviewApplicationsCard";
import RecommendedUniversities from "@/components/userdashboard/RecommendedUniversities";
import StudentProCard from "@/components/upgrade/StudentProCard";

const getStatusColor = (status) => {
  switch (status) {
    case "Submitted":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Documents Pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Offer Received":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Rejected":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Withdrawn":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default:
      return "bg-white/10 text-gray-300 border-white/10";
  }
};

export default function DashboardPage() {
  const { user, authChecked } = useSelector((state) => state.auth);
  const { lead, fetched } = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  const router = useRouter();

  const notificationRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Close dropdown when clicking outside
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

  useEffect(() => {
    if (!user) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/overview`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        if (data.success) {
          setDashboard(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  useEffect(() => {
    if (!fetched) dispatch(fetchMyLead());
  }, [fetched, dispatch]);

  useEffect(() => {
    if (authChecked && !user) router.replace("/login");
  }, [authChecked, user, router]);

  const handleWithdraw = async (id) => {
    if (!confirm("Withdraw this application?")) return;
    try {
      const res = await fetch(`/api/applications/${id}/withdraw`, {
        credentials: "include",
        method: "PATCH",
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: "Withdrawn" } : app,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!authChecked)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        Loading...
      </div>
    );
  if (!user) return null;

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        Loading dashboard...
      </div>
    );
  }

  const profile = dashboard.profile;
  const applications = dashboard.applications;
  const deadlines = dashboard.deadlines;
  const visa = dashboard.visa;
  const savedUniversities = dashboard.savedUniversities;
  const quickStats = dashboard.quickStats;
  const recentActivity = dashboard.recentActivity;

  return (
    <div className="min-h-screen space-y-6 lg:space-y-[-15px] bg-[#0A192F] relative overflow-x-hidden ">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4169E1] rounded-full blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#32CD32] rounded-full blur-3xl opacity-10"></div>
      </div>

      <div
        className="relative z-10 
max-w-7xl 
mx-auto 
px-4 sm:px-6 lg:px-8 
py-6 
space-y-6 lg:space-y-8"
      >
        {/* Header */}
        <DashboardHeader user={user} />

        {/* Profile Completion */}
        <ProfileCompletionCard
          progress={profile.profileCompletion}
          router={router}
        />

        <StudentProCard variant="dark" compact />

        {/* Quick Stats */}
        <QuickStats
          applications={applications.total}
          shortlistedCount={savedUniversities.total}
          upcomingDeadlines={deadlines.urgent}
          visaStatus={visa.overallStatus}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Deadlines */}
          <DeadlinesCard upcomingDeadlines={deadlines.urgent} />

          {/* Recent Applications */}
          <OverviewApplicationsCard
            applications={applications.recent}
            router={router}
          />
        </div>

        {/* Recommended Universities */}
        <RecommendedUniversities universities={savedUniversities.recent} />
      </div>
    </div>
  );
}
