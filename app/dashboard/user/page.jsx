"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { fetchMyLead } from "@/store/leadSlice";

import DashboardHeader from "@/components/userdashboard/DashboardHeader";
import ProfileCompletionCard from "@/components/userdashboard/ProfileCompletionCard";
import QuickStats from "@/components/userdashboard/QuickStats";
import DeadlinesCard from "@/components/userdashboard/DeadlinesCard";
import ApplicationsCard from "@/components/userdashboard/ApplicationsCard";
import RecommendedUniversities from "@/components/userdashboard/RecommendedUniversities";

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

  const [profileCompletion, setProfileCompletion] = useState(0);
  const [applications, setApplications] = useState([]);
  const [progress, setProgress] = useState(0);

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

  // Mock data (replace with real API later)
  const shortlistedCount = lead?.shortlisted?.length || 3;
  const upcomingDeadlines = [
    {
      id: 1,
      title: "University of Toronto - Fall Intake",
      date: "Mar 15, 2026",
      daysLeft: 11,
    },
    {
      id: 2,
      title: "Visa Document Submission",
      date: "Mar 10, 2026",
      daysLeft: 6,
    },
    { id: 3, title: "SOP Review Deadline", date: "Mar 8, 2026", daysLeft: 4 },
  ];
  const recommendedUnis = [
    {
      name: "University of Melbourne",
      match: "92%",
      program: "MS Computer Science",
    },
    { name: "University of Toronto", match: "88%", program: "MBA" },
    { name: "Imperial College London", match: "85%", program: "Data Science" },
  ];

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success)
          setProfileCompletion(data.data.profileCompletion || 0);
      })
      .catch(console.error);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []))
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!fetched) dispatch(fetchMyLead());
  }, [fetched, dispatch]);

  useEffect(() => {
    if (authChecked && !user) router.replace("/login");
  }, [authChecked, user, router]);

  useEffect(() => setProgress(profileCompletion), [profileCompletion]);

  const handleWithdraw = async (id) => {
    if (!confirm("Withdraw this application?")) return;
    try {
      const res = await fetch(`/api/applications/${id}/withdraw`, {
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
        <ProfileCompletionCard progress={progress} router={router} />

        {/* Quick Stats */}
        <QuickStats
          applications={applications}
          shortlistedCount={shortlistedCount}
          upcomingDeadlines={upcomingDeadlines}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Deadlines */}
          <DeadlinesCard upcomingDeadlines={upcomingDeadlines} />

          {/* Recent Applications */}
          <ApplicationsCard
            applications={applications.slice(0, 3)}
            handleWithdraw={handleWithdraw}
            router={router}
            getStatusColor={getStatusColor}
          />
        </div>

        {/* Recommended Universities */}
        <RecommendedUniversities universities={recommendedUnis} />
      </div>
    </div>
  );
}
