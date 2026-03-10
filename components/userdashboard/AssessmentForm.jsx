"use client";

import { motion } from "framer-motion";

export default function AssessmentForm() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/6 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Study Abroad Assessment
      </h2>

      <form className="space-y-6">
        {/* Country */}
        <div>
          <label className="text-sm text-gray-400">Preferred Country</label>
          <select className="w-full mt-2 bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32CD32]">
            <option>USA</option>
            <option>Canada</option>
            <option>UK</option>
            <option>Australia</option>
          </select>
        </div>

        {/* Degree */}
        <div>
          <label className="text-sm text-gray-400">Degree Level</label>
          <select className="w-full mt-2 bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32CD32]">
            <option>Bachelors</option>
            <option>Masters</option>
            <option>MBA</option>
            <option>PhD</option>
          </select>
        </div>

        {/* GPA */}
        <div>
          <label className="text-sm text-gray-400">GPA / Percentage</label>
          <input
            type="text"
            placeholder="Enter your GPA"
            className="w-full mt-2 bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32CD32]"
          />
        </div>

        <button
          type="submit"
          className="bg-[#32CD32] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#28b428] transition"
        >
          Submit Assessment
        </button>
      </form>
    </motion.div>
  );
}
