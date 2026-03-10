"use client";

import { motion } from "framer-motion";

export default function UniversitiesList({ universities }) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white/6 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <input
          placeholder="Search universities..."
          className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32CD32]"
        />
      </div>

      {/* Universities */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {universities.map((uni) => (
          <motion.div
            key={uni.name}
            whileHover={{ y: -6 }}
            className="bg-white/6 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-2">{uni.name}</h3>

            <p className="text-gray-400 text-sm mb-3">{uni.program}</p>

            <span className="text-[#32CD32] font-bold">{uni.match}% Match</span>

            <button className="mt-4 w-full bg-[#4169E1] text-white py-2 rounded-xl hover:bg-[#3258c9] transition">
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
