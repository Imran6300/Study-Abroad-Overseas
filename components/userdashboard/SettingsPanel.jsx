"use client";

import { motion } from "framer-motion";

export default function SettingsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/6 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-400">Full Name</label>
          <input
            type="text"
            className="w-full mt-2 bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32CD32]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            className="w-full mt-2 bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32CD32]"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-400">Change Password</label>
          <input
            type="password"
            className="w-full mt-2 bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32CD32]"
          />
        </div>

        <button className="bg-[#4169E1] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3258c9] transition">
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
