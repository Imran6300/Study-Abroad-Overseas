"use client";

import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { IoIosRocket } from "react-icons/io";
import { MdStars } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { useHeroSearch } from "@/hooks/useHeroSearch";

export default function MobileHero() {
  const { handleSearch } = useHeroSearch();
  const [search, setSearch] = useState("");

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

      {/* Glass card */}
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

      {/* ✅ FUNCTIONAL SEARCH */}
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(search);
        }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-5"
      >
        <div className="flex items-center bg-white rounded-xl shadow px-4 py-3 border border-gray-200">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities or programs"
            className="flex-1 h-10 text-base outline-none bg-transparent"
          />

          <button
            type="submit"
            className="ml-2 p-2 text-gray-500 hover:text-blue-600 focus:text-blue-600 transition-colors"
            aria-label="Search"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </motion.form>

      {/* Stats */}
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

      {/* CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full flex justify-center mt-6"
      >
        <Link
          href="/assessment"
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
        </Link>
      </motion.div>
    </div>
  );
}
