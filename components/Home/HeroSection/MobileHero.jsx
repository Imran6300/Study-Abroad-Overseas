"use client";

import { motion } from "framer-motion";
import { FaSearch, FaGraduationCap } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { IoIosRocket } from "react-icons/io";
import { MdStars } from "react-icons/md";

export default function MobileHero() {
  return (
    <div className="relative min-h-[100vh] w-full px-5 pt-28 pb-24 md:hidden overflow-hidden bg-[#F7F9FC]">
      {/* Soft background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-20%] w-72 h-72 bg-[#4A6BFF]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] w-72 h-72 bg-[#22C55E]/20 rounded-full blur-3xl" />
      </div>

      {/* Main text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full shadow-sm mb-3">
          <MdStars className="text-yellow-500 text-lg" />
          <p className="text-xs font-semibold text-[#4A6BFF]">
            50,000+ Students Trust Us
          </p>
        </div>

        <h2 className="text-[30px] font-bold leading-tight text-gray-900">
          Start Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4A6BFF] to-[#22C55E]">
            Study Abroad Journey
          </span>
          Today
        </h2>
      </motion.div>

      {/* Glass card — premium style */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative z-10 mb-6"
      >
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Your Personalized Path
          </h3>
          <p className="text-sm text-gray-600 leading-snug">
            Get matched to universities, scholarships, and visa support — all in
            one place.
          </p>
        </div>
      </motion.div>

      {/* Search bar clean + modern */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-5"
      >
        <div className="flex items-center bg-white rounded-xl shadow px-3 py-2 border border-gray-200">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search universities or programs"
            className="ml-3 w-full text-sm outline-none"
          />
        </div>
      </motion.div>

      {/* Stats simplified + premium */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-3 gap-3 relative z-10 mb-10"
      >
        {[
          { value: "250+", label: "Universities" },
          { value: "93%", label: "Success Rate" },
          { value: "$50M+", label: "Scholarships" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-xl p-3 text-center shadow"
          >
            <h3 className="text-[18px] font-bold text-gray-900">
              {stat.value}
            </h3>
            <p className="text-[11px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA at the bottom */}
      {/* <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 w-[90%] left-1/2 -translate-x-1/2"
      >
        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white font-semibold flex flex-col items-center justify-center gap-1 shadow-xl text-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-full">
              <IoIosRocket className="text-xl" />
            </div>
            <span>Book Free Counseling</span>
          </div>

          <FiChevronRight className="text-xl mt-1" />
        </button>
      </motion.div> */}
      {/* CTA centered inside the page */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full flex justify-center mt-6"
      >
        <button
          className="w-[85%] py-4 rounded-2xl bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] 
                     text-white font-semibold flex flex-col items-center justify-center 
                     gap-1 shadow-xl text-center"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-full">
              <IoIosRocket className="text-xl" />
            </div>
            <span>Book Free Counseling</span>
          </div>

          <FiChevronRight className="text-xl mt-1" />
        </button>
      </motion.div>
    </div>
  );
}
