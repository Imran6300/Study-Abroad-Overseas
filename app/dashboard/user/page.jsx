"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMyLead } from "@/store/leadSlice";
import Link from "next/link";

const MotionLink = motion(Link);

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

const getDaysLeftColor = (days) => {
  if (days <= 3) return "text-red-400";
  if (days <= 7) return "text-orange-400";
  return "text-gray-300";
};

export default function DashboardPage() {
  const { user, authChecked } = useSelector((state) => state.auth);
  const { lead, fetched } = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  const router = useRouter();

  const [profileCompletion, setProfileCompletion] = useState(0);
  const [applications, setApplications] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Mock notifications (replace with real API fetch later)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your application to University of Toronto is under review",
      time: "2 hours ago",
      read: false,
      type: "application",
    },
    {
      id: 2,
      message: "New scholarship opportunity: $15,000 for Indian students",
      time: "1 day ago",
      read: false,
      type: "scholarship",
    },
    {
      id: 3,
      message: "Reminder: Visa document upload deadline in 6 days",
      time: "3 days ago",
      read: true,
      type: "visa",
    },
    {
      id: 4,
      message: "Profile strength increased to 92% – keep going!",
      time: "5 days ago",
      read: true,
      type: "profile",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
  const documents = [
    { name: "Passport", status: "Uploaded" },
    { name: "Transcripts", status: "Pending" },
    { name: "SOP", status: "Draft Ready" },
    { name: "LORs", status: "2/3 Uploaded" },
  ];
  const visaStages = [
    { stage: "Applied", done: true },
    { stage: "Biometrics", done: false },
    { stage: "Processing", done: false },
    { stage: "Decision", done: false },
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

  const markAllAsRead = () => {
    setNotifications((notifs) => notifs.map((n) => ({ ...n, read: true })));
  };

  if (!authChecked)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        Loading...
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A192F] pb-16 sm:pb-20 relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 sm:-top-40 sm:-right-40 w-72 sm:w-96 h-72 sm:h-96 bg-[#4169E1] rounded-full blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 sm:-bottom-40 sm:-left-40 w-72 sm:w-96 h-72 sm:h-96 bg-[#32CD32] rounded-full blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-20 sm:pt-28">
        {/* Header with Notification Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Welcome back,{" "}
              <span className="text-[#32CD32]">{user?.name || "Student"}</span>{" "}
              👋
            </h1>
            <p className="text-gray-400 mt-1.5 text-base sm:text-lg">
              Your study abroad journey — real-time
            </p>
          </div>

          {/* Notification Bell + Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-3xl relative p-2 -m-2 focus:outline-none"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0F1C3A] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-white text-lg">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[#32CD32] text-sm hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? "bg-white/5" : ""}`}
                        >
                          <p className="text-white text-sm">{notif.message}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {notif.time}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-white/10 text-center">
                    <button className="text-[#32CD32] hover:underline text-sm">
                      View all notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Profile Completion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/6 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 mb-8 sm:mb-12 border border-white/10 hover:border-[#32CD32]/30 transition-all"
        >
          {progress === 100 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[#32CD32] mb-3 flex items-center justify-center sm:justify-start gap-2.5">
                  🎉 Profile 100% Complete!
                </h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  You're ready to apply — let's go!
                </p>
                <div className="w-full max-w-[260px] mx-auto sm:mx-0 bg-slate-800 rounded-full h-4 overflow-hidden relative">
                  <div className="h-full bg-[#32CD32] w-full" />
                  <span className="absolute inset-0 text-[10px] font-bold text-black flex items-center justify-center">
                    100%
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/programs/universities")}
                className="bg-[#32CD32] text-black px-8 py-4 rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-base sm:text-lg"
              >
                Start Applying 🚀
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <div className="w-full sm:flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Profile Completion
                </h3>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">
                  Finish to unlock full features
                </p>
                <div className="w-full max-w-[260px] mx-auto sm:mx-0 bg-slate-800 rounded-full h-4 overflow-hidden relative">
                  <motion.div
                    className="h-full bg-[#32CD32]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                  <span className="absolute inset-0 text-[10px] font-bold text-black flex items-center justify-center">
                    {progress}%
                  </span>
                </div>
              </div>
              <MotionLink
                href="/dashboard/user/profile"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#4169E1] text-white px-8 py-4 rounded-xl sm:rounded-2xl font-bold shadow-lg hover:bg-[#3258c9] transition-all w-full sm:w-auto text-base sm:text-lg text-center"
              >
                Complete Profile
              </MotionLink>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12"
        >
          {[
            { title: "Applications", value: applications.length, emoji: "🎓" },
            { title: "Shortlisted", value: shortlistedCount, emoji: "⭐" },
            {
              title: "Deadlines",
              value: upcomingDeadlines.length,
              emoji: "⏰",
            },
            { title: "Visa", value: "In Progress", emoji: "🛂" },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              whileHover={{ y: -6 }}
              className="bg-white/6 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-white/10 hover:border-[#32CD32]/30 transition-all shadow-md"
            >
              <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">
                {stat.emoji}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-950/30 to-amber-950/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-10 sm:mb-12 border border-red-500/20 shadow-xl"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-red-400 text-2xl">⏰</span> Urgent Deadlines
          </h2>
          <div className="space-y-4">
            {upcomingDeadlines.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
              >
                <div>
                  <h4 className="font-semibold text-white text-base sm:text-lg">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {item.date}
                  </p>
                </div>
                <span
                  className={`font-bold text-base sm:text-lg ${getDaysLeftColor(item.daysLeft)}`}
                >
                  {item.daysLeft} days left
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* My Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/6 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-10 sm:mb-12 border border-white/10 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              🎓 My Applications
            </h2>
            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => router.push("/dashboard/applications/new")}
              className="bg-[#32CD32] text-black px-6 sm:px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-base sm:text-lg"
            >
              + New Application
            </motion.button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-base mb-5">
                No applications yet — start now!
              </p>
              <MotionLink
                href="/programs/universities"
                className="text-[#32CD32] font-bold hover:underline text-base sm:text-lg"
              >
                Explore Universities →
              </MotionLink>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5"
                >
                  <div className="w-full">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {app.university}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {app.course} • {app.intake}
                    </p>
                    <span
                      className={`mt-3 inline-block px-4 py-1 text-xs rounded-full border ${getStatusColor(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/applications/${app._id}`)
                      }
                      className="flex-1 sm:flex-none px-5 py-3 bg-[#4169E1] text-white rounded-xl hover:bg-[#3258c9] transition-all text-sm sm:text-base"
                    >
                      View
                    </button>
                    {app.status !== "Withdrawn" && (
                      <button
                        onClick={() => handleWithdraw(app._id)}
                        className="flex-1 sm:flex-none px-5 py-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/40 hover:bg-red-600/30 transition-all text-sm sm:text-base"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recommended Universities – horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3 px-1">
            <span className="text-[#32CD32]">🔍</span> Recommended for You
          </h2>

          <div className="overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-5 sm:grid sm:grid-cols-3 sm:gap-6 min-w-max sm:min-w-0">
              {recommendedUnis.map((uni) => (
                <motion.div
                  key={uni.name}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-indigo-950/50 to-[#0A192F] p-5 rounded-2xl border border-indigo-500/20 snap-start min-w-[280px] sm:min-w-0 flex-1 sm:flex-none text-center"
                >
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {uni.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">{uni.program}</p>
                  <div className="text-[#32CD32] font-bold text-lg">
                    {uni.match} Match
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <MotionLink
              href="/programs/universities"
              className="text-[#32CD32] font-bold hover:underline text-base sm:text-lg"
            >
              See All Recommendations →
            </MotionLink>
          </div>
        </motion.div>

        {/* Document Checklist – also horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3 px-1">
            <span className="text-[#4169E1]">📄</span> Document Checklist
          </h2>

          <div className="overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4 sm:grid sm:grid-cols-4 sm:gap-6 min-w-max sm:min-w-0">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="p-5 bg-white/6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-all snap-start min-w-[220px] sm:min-w-0"
                >
                  <p className="font-semibold text-white text-base mb-2">
                    {doc.name}
                  </p>
                  <span
                    className={`text-sm ${doc.status.includes("Pending") ? "text-yellow-400" : "text-[#32CD32]"}`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <button className="text-[#4169E1] font-bold hover:underline text-base sm:text-lg">
              Manage Documents →
            </button>
          </div>
        </motion.div>

        {/* Saved Universities + Visa Progress – side by side on desktop */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/6 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="text-[#32CD32]">🏛️</span> Saved Universities
            </h2>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              No universities saved yet — start exploring!
            </p>
            <MotionLink
              href="/programs/universities"
              className="text-[#32CD32] font-bold hover:underline text-base sm:text-lg flex items-center gap-2"
            >
              Browse Now <span>→</span>
            </MotionLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white/6 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="text-[#4169E1]">🛂</span> Visa Progress
            </h2>
            <div className="space-y-4">
              {visaStages.map((stage, i) => (
                <div key={stage.stage} className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base font-bold ${stage.done ? "bg-[#32CD32] text-black" : "bg-gray-700 text-gray-400"}`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-base">
                      {stage.stage}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {stage.done ? "Done" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center sm:text-left">
              <button className="text-[#4169E1] font-bold hover:underline text-base sm:text-lg">
                Update Status →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scholarship + Counselor – bottom CTA section */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-amber-950/40 to-yellow-950/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-amber-500/20 shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="text-yellow-400 text-2xl sm:text-3xl">💰</span>{" "}
              Scholarships
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              You could be eligible for $5k–$25k — check now!
            </p>
            <button className="bg-yellow-600/80 text-white px-8 py-4 rounded-xl font-bold hover:bg-yellow-600 transition-all w-full sm:w-auto text-base sm:text-lg">
              Find Funding
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-gradient-to-br from-[#112240] to-[#0A192F] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#4169E1]/5"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Expert Help
              </h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Certified counselors — helped 1000+ students from Hyderabad
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="bg-[#32CD32] text-black font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto text-base sm:text-lg"
              >
                Book Free Call
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
