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
    const trimmed = search.trim();
    if (!trimmed) return;
    handleSearch(trimmed);
  };

  return (
    <section className="relative min-h-[100svh] w-full px-4 sm:px-5 pt-20 pb-16 md:hidden overflow-hidden bg-[#F7F9FC]">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[15%] -left-[15%] w-64 h-64 sm:w-72 sm:h-72 bg-[#4A6BFF]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-[15%] -right-[15%] w-64 h-64 sm:w-72 sm:h-72 bg-[#22C55E]/15 rounded-full blur-3xl" />
      </div>

      {/* Trust badge + headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-6 text-center sm:text-left"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full shadow-sm mb-4 mx-auto sm:mx-0">
          <MdStars className="text-yellow-500 text-lg" />
          <p className="text-xs font-semibold text-[#4A6BFF]">
            50,000+ Students Trust Us
          </p>
        </div>

        <h1 className="text-3xl sm:text-[32px] font-extrabold leading-tight text-gray-900">
          Start Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4A6BFF] to-[#22C55E]">
            Global Education Journey
          </span>
        </h1>
      </motion.div>

      {/* Glass info card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative z-10 mb-6"
      >
        <div className="bg-white/55 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-lg border border-white/30">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Your Personalized Path
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Get matched to universities, scholarships, and visa support — all in
            one place.
          </p>
        </div>
      </motion.div>

      {/* Search bar – only right icon, more left padding */}
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative z-10 mb-7 w-full max-w-md mx-auto"
      >
        <div
          className="
            flex items-center bg-white rounded-2xl shadow-md border border-gray-200
            overflow-hidden focus-within:ring-2 focus-within:ring-[#4A6BFF]/40
            focus-within:border-[#4A6BFF] transition-all duration-200
          "
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities, courses, countries…"
            enterKeyHint="search"
            aria-label="Search universities, courses or countries"
            className="
              flex-1 py-3.5 pl-4 pr-12
              text-[15px] outline-none bg-transparent
              placeholder:text-gray-400 placeholder:opacity-90
              min-w-0 caret-[#4A6BFF]
            "
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Only right-side search icon (submit) */}
          <button
            type="submit"
            aria-label="Submit search"
            className="
              absolute right-1 top-1/2 -translate-y-1/2
              p-3 text-gray-400 hover:text-[#4A6BFF] active:text-[#4A6BFF]
              active:scale-95 transition-all duration-150
            "
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </motion.form>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4 mb-10 px-1"
      >
        {[
          { value: "250+", label: "Universities" },
          { value: "93%", label: "Success Rate" },
          { value: "$50M+", label: "Scholarships" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-3 sm:p-4 text-center shadow-sm"
          >
            <h3 className="text-[17px] sm:text-[18px] font-bold text-gray-900">
              {stat.value}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-gray-500">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Primary CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative z-10 flex justify-center px-1"
      >
        <Link
          href="/assessment"
          className="
            w-full max-w-xs py-4 px-6 rounded-2xl
            bg-gradient-to-r from-[#4A6BFF] to-[#22C55E]
            text-white font-semibold text-center text-[15px] sm:text-base
            flex items-center justify-center gap-2.5 shadow-xl
            active:scale-[0.98] transition-transform duration-150
          "
        >
          <span className="p-2 bg-white/20 rounded-full">
            <IoIosRocket className="text-xl" />
          </span>
          <span>Book Free Counseling</span>
          <FiChevronRight className="text-xl opacity-90" />
        </Link>
      </motion.div>
    </section>
  );
}
