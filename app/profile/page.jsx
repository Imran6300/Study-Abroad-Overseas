"use client";

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  GraduationCap,
  Globe,
  Calendar,
  Percent,
  Pencil,
} from "lucide-react"; // ← add lucide-react icons

export default function ProfilePage() {
  const { user, loading } = useSelector((state) => state.auth); // assume you might have loading state

  const profileData = {
    name: user?.name || "Not provided",
    email: user?.email || "Not provided",
    avatar: user?.avatar || null, // you can add this field later in your auth/user slice
    qualification: user?.qualification || "Not added",
    field: user?.fieldOfStudy || "Not added",
    graduationYear: user?.graduationYear || "Not added",
    gpa: user?.gpa || "Not added",
    preferredCountry: user?.preferredCountry || "Not selected",
    intendedIntake: user?.intendedIntake || "Not selected",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1C2D] to-[#0f2440] pt-28 px-5 sm:px-8 md:px-12 pb-16 text-white">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 md:mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#32CD32]/30 to-[#4169E1]/30 flex items-center justify-center text-3xl">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              "👤"
            )}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              My Profile
            </h1>
            <p className="text-gray-400 mt-1.5 text-lg">
              Keep your details updated for the best university recommendations
            </p>
          </div>
        </div>
      </motion.div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl mx-auto bg-white/8 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* BASIC INFORMATION */}
        <section className="p-6 md:p-8 border-b border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-[#32CD32]">
            <User size={24} /> Basic Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            <InfoItem icon={User} label="Full Name" value={profileData.name} />
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={profileData.email}
            />
          </div>
        </section>

        {/* ACADEMIC DETAILS */}
        <section className="p-6 md:p-8 border-b border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-[#4169E1]">
            <GraduationCap size={24} /> Academic Details
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <InfoCard
              label="Highest Qualification"
              value={profileData.qualification}
            />
            <InfoCard label="Field of Study" value={profileData.field} />
            <InfoCard
              label="Graduation Year"
              value={profileData.graduationYear}
            />
            <InfoCard label="GPA / Percentage" value={profileData.gpa} />
          </div>
        </section>

        {/* STUDY PREFERENCES */}
        <section className="p-6 md:p-8 border-b border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-[#32CD32]">
            <Globe size={24} /> Study Preferences
          </h2>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            <InfoCard
              label="Preferred Country"
              value={profileData.preferredCountry}
            />
            <InfoCard
              label="Intended Intake"
              value={profileData.intendedIntake}
            />
          </div>
        </section>

        {/* TEST STATUS */}
        <section className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-[#4169E1]">
            <Calendar size={24} /> Test Status
          </h2>

          <div className="grid sm:grid-cols-3 gap-5 md:gap-6">
            {["IELTS", "TOEFL", "GRE", "PTE", "Duolingo"].map((test) => (
              <motion.div
                key={test}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-white/6 rounded-2xl p-5 text-center border border-white/5 transition-colors hover:bg-white/10"
              >
                <p className="text-gray-300 font-medium">{test}</p>
                <p className="mt-2 text-sm text-gray-400">Not planned</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ACTIONS */}
        <div className="p-6 md:p-8 bg-black/20 flex flex-col sm:flex-row gap-4 justify-end border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/10 text-white px-7 py-3.5 rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <Pencil size={18} /> Edit Profile
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#32CD32] text-black px-8 py-3.5 rounded-xl font-semibold shadow-lg flex items-center gap-2"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable small components

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div>
      <label className="text-gray-400 text-sm flex items-center gap-2 mb-1.5">
        <Icon size={16} />
        {label}
      </label>
      <div className="bg-white/6 rounded-xl px-4 py-3.5 border border-white/5 text-white">
        {value}
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white/6 rounded-2xl p-5 border border-white/5 hover:bg-white/9 transition-colors">
      <p className="text-gray-400 text-sm mb-1.5">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
