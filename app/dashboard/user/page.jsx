"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // For smooth animations

export default function DashboardPage() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Protect route
  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  // Animate progress bar on mount
  useEffect(() => {
    setProgress(65);
  }, []);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl mb-10 border border-white/10 hover:border-white/20 transition-all"
      >
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#4169E1] hover:bg-[#3258c9] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all"
          >
            Complete Profile
          </motion.button>
        </div>
      </motion.div>

      {/* ───────────────── QUICK STATS ───────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {[
          { title: "Applications", value: "0", emoji: "🎓" },
          { title: "Saved Universities", value: "0", emoji: "❤️" },
          { title: "Shortlisted", value: "0", emoji: "📌" },
          { title: "Tests Planned", value: "0", emoji: "📝" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/10 transition-all"
          >
            <div className="text-4xl mb-3">{stat.emoji}</div>
            <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
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
          You haven’t saved any universities yet. Start exploring!
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
