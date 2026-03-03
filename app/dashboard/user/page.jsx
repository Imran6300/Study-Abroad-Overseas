"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
export default function DashboardPage() {
  const { user, authChecked } = useSelector((state) => state.auth);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [applications, setApplications] = useState([]);
  const { lead, fetched } = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  const [profileCompletion, setProfileCompletion] = useState(0);
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`,
          {
            credentials: "include", // if using cookies
          },
        );

        const data = await res.json();

        if (data.success) {
          setProfileCompletion(data.data.profileCompletion || 0);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (authChecked && !user) {
      router.replace("/login");
    }
  }, [authChecked, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/me`,
        );
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, [user]);

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchMyLead());
    }
  }, [fetched, dispatch]);

  const handleWithdraw = async (id) => {
    const confirmWithdraw = confirm(
      "Are you sure you want to withdraw this application?",
    );
    if (!confirmWithdraw) return;

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

  // Animate progress bar on mount
  useEffect(() => {
    setProgress(profileCompletion);
  }, [profileCompletion]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return null; // prevents UI flash
  }

  // Fetch applications

  return (
    <div className="min-h-screen bg-[#0A192F] pt-28 px-4 md:px-8 pb-16">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4169E1] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#32CD32] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* ───────────────── HEADER ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Welcome back,{" "}
          <span className="text-[#32CD32]">{user?.name || "Student"} 👋</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Your journey to study abroad starts here.
        </p>
      </motion.div>

      {/* ───────────────── PROFILE COMPLETION ───────────────── */}
      {/* ───────────────── PROFILE COMPLETION ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl mb-10 border border-white/10 hover:border-white/20 transition-all"
      >
        {progress === 100 ? (
          // ✅ COMPLETED UI
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-bold text-xl text-[#32CD32] mb-2 flex items-center gap-2">
                🎉 Profile Completed!
              </h3>
              <p className="text-gray-400 mb-4">
                Your profile is fully completed. You're ready to apply to
                universities.
              </p>

              <div className="relative w-full md:w-96 bg-slate-900 rounded-full h-4 overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-[#32CD32] rounded-full w-full" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] font-bold text-white">
                  100%
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard/applications/new")}
              className="bg-[#32CD32] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:bg-[#2eb82e] transition-all"
            >
              Start Applying 🚀
            </motion.button>
          </div>
        ) : (
          // ⏳ INCOMPLETE UI
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-bold text-xl text-white mb-2">
                Profile Completion
              </h3>
              <p className="text-gray-400 mb-4">
                Unlock personalized recommendations by completing your profile.
              </p>

              <div className="relative w-full md:w-96 bg-slate-900 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[#32CD32] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] font-bold text-white">
                  {progress}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2 italic">
                Keep going! You're almost there.
              </p>
            </div>

            <MotionLink
              href="/dashboard/user/profile"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#4169E1] hover:bg-[#3258c9] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all inline-block text-center"
            >
              Complete Profile
            </MotionLink>
          </div>
        )}
      </motion.div>

      {/* ───────────────── QUICK STATS ───────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {[
          { title: "Applications", value: applications.length, emoji: "🎓" },
          { title: "Shortlisted", value: "0", emoji: "📌" },
          { title: "Tests Planned", value: "0", emoji: "📝" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
            className="bg-white/5 text-center backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/10 transition-all"
          >
            <div className="text-4xl mb-3">{stat.emoji}</div>
            <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ───────────────── MY APPLICATIONS ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl mb-12 border border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🎓 My Applications
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard/applications/new")}
            className="bg-[#32CD32] text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-[#2eb82e] transition-all text-sm"
          >
            + New Application
          </motion.button>
        </div>

        {applications.length === 0 ? (
          <div className="text-gray-400">
            You haven’t started any applications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex flex-col md:flex-row md:justify-between md:items-center gap-4"
              >
                {/* Left Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {app.university}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {app.course} • {app.intake}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs rounded-full border ${getStatusColor(
                      app.status,
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Right Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/applications/${app._id}`)
                    }
                    className="px-4 py-2 bg-[#4169E1] text-white rounded-xl text-sm hover:bg-[#3258c9]"
                  >
                    View
                  </button>

                  {app.status !== "Withdrawn" && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm border border-red-500/30 hover:bg-red-500/30"
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

      {/* ───────────────── NEXT STEPS ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl mb-12 border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-[#32CD32]">🚀</span> Next Steps
        </h2>

        <ul className="space-y-4">
          {[
            "Complete your academic profile",
            "Upload SOP & documents",
            "Shortlist universities",
            "Book a counselor call",
          ].map((text, idx) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
            >
              <span className="text-gray-200 font-medium">{text}</span>
              <motion.button
                whileHover={{ x: 5 }}
                className="text-[#4169E1] font-semibold flex items-center gap-2"
              >
                Do Now <span>→</span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* ───────────────── SAVED UNIVERSITIES ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl mb-12 border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-[#32CD32]">🏛️</span> Saved Universities
        </h2>

        <div className="text-gray-500 text-base py-4">
          You haven’t shortlisted any universities yet. Start exploring!
        </div>

        <motion.button
          whileHover={{ x: 5 }}
          className="text-[#32CD32] font-semibold text-lg flex items-center gap-2"
        >
          Explore Universities <span>→</span>
        </motion.button>
      </motion.div>

      {/* ───────────────── COUNSELOR SUPPORT ───────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-[#112240] to-[#0A192F] text-white rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#4169E1]/5"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-3">Need Expert Guidance?</h2>
          <p className="text-gray-400 mb-6 text-lg">
            Our certified counselors have helped thousands navigate the study
            abroad process.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#32CD32] text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-[#2eb82e] transition-all"
          >
            Book Free Counseling Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
