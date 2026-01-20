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

  const onSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    handleSearch(search.trim());
  };

  return (
    <section className="relative min-h-[100svh] w-full px-5 pt-28 pb-24 md:hidden overflow-hidden bg-[#F7F9FC]">
      {/* 🌈 Soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-20%] w-72 h-72 bg-[#4A6BFF]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] w-72 h-72 bg-[#22C55E]/20 rounded-full blur-3xl" />
      </div>

      {/* ⭐ Trust badge + headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-7"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full shadow-sm mb-4">
          <MdStars className="text-yellow-500 text-lg" />
          <p className="text-xs font-semibold text-[#4A6BFF]">
            50,000+ Students Trust Us
          </p>
        </div>

        <h1 className="text-[30px] font-extrabold leading-tight text-gray-900">
          Start Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4A6BFF] to-[#22C55E]">
            Global Education Journey
          </span>
        </h1>
      </motion.div>

      {/* 🧊 Glass info card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative z-10 mb-7"
      >
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/30">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Your Personalized Path
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Get matched to universities, scholarships, and visa support — all in
            one place.
          </p>
        </div>
      </motion.div>

      {/* 🔍 Smart search */}
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative z-10 mb-6"
      >
        <div className="flex items-center bg-white rounded-2xl shadow-md px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-[#4A6BFF]/30 transition">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities, courses, countries"
            enterKeyHint="search"
            aria-label="Search universities or courses"
            className="flex-1 h-10 text-[15px] outline-none bg-transparent placeholder:text-gray-400"
          />

          <button
            type="submit"
            aria-label="Search"
            className="ml-2 p-2 rounded-full text-gray-500
                       active:scale-90 hover:text-[#4A6BFF]
                       transition-all duration-150"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </motion.form>

      {/* 📊 Quick stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 grid grid-cols-3 gap-3 mb-10"
      >
        {[
          { value: "250+", label: "Universities" },
          { value: "93%", label: "Success Rate" },
          { value: "$50M+", label: "Scholarships" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-3 text-center shadow-sm"
          >
            <h3 className="text-[18px] font-bold text-gray-900">
              {stat.value}
            </h3>
            <p className="text-[11px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* 🚀 Primary CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative z-10 flex justify-center"
      >
        <Link
          href="/assessment"
          className="w-[88%] py-4 rounded-2xl
                     bg-gradient-to-r from-[#4A6BFF] to-[#22C55E]
                     text-white font-semibold
                     flex flex-col items-center justify-center gap-1
                     shadow-xl active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-full">
              <IoIosRocket className="text-xl" />
            </span>
            <span>Book Free Counseling</span>
          </div>
          <FiChevronRight className="text-xl mt-1 opacity-90" />
        </Link>
      </motion.div>
    </section>
  );
}
