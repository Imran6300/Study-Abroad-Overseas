"use client";

import { useState, useMemo, useEffect, useDeferredValue, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import UniversityCard from "@/components/ui/UniversityCard";

const COUNTRIES = [
  "All",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "Netherlands",
  "Switzerland",
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04, // faster stagger = better perceived speed
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  hover: {
    y: -8,
    scale: 1.025,
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 22,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const filterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function UniversitiesClient({ universities }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [maxRank, setMaxRank] = useState(null);
  const [maxAcceptance, setMaxAcceptance] = useState(null);
  const [sortBy, setSortBy] = useState("rank");

  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const deferredSearch = useDeferredValue(searchTerm);

  const filteredUniversities = useMemo(() => {
    let result = [...(universities || [])];

    const search = deferredSearch.toLowerCase().trim();

    if (search) {
      result = result.filter((uni) =>
        [uni.name, uni.country, uni.city, uni.description, uni.desc].some(
          (field) => field?.toLowerCase()?.includes(search),
        ),
      );
    }

    if (selectedCountry !== "All") {
      result = result.filter(
        (uni) => uni.country?.toLowerCase() === selectedCountry.toLowerCase(),
      );
    }

    if (maxRank) {
      result = result.filter(
        (uni) => uni.qsRanking && Number(uni.qsRanking) <= maxRank,
      );
    }

    if (maxAcceptance) {
      result = result.filter(
        (uni) =>
          uni.acceptanceRate && Number(uni.acceptanceRate) <= maxAcceptance,
      );
    }

    if (sortBy === "rank") {
      result.sort((a, b) => (a.qsRanking || 9999) - (b.qsRanking || 9999));
    } else if (sortBy === "students") {
      result.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));
    }

    return result;
  }, [
    universities,
    deferredSearch,
    selectedCountry,
    maxRank,
    maxAcceptance,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCountry("All");
    setMaxRank(null);
    setMaxAcceptance(null);
    setSortBy("rank");
  };

  return (
    <div className="min-h-screen bg-gray-50/40">
      {/* Hero with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-br from-blue-600/5 via-indigo-50 to-purple-50/20 pt-28 pb-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Discover World-Class Universities
            </h1>
            <p className="mt-5 text-xl text-gray-700 leading-relaxed">
              Find your perfect university — compare rankings, programs,
              acceptance rates & student experience.
            </p>
          </div>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-6 py-16 -mt-12">
        <motion.div
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          className="mb-14 space-y-7"
        >
          <div className="relative max-w-2xl mx-auto">
            <input
              type="search"
              placeholder="Search by name, country, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 text-lg transition"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <div className="space-y-6">
            <motion.div
              variants={filterVariants}
              className="flex flex-wrap gap-3 justify-center sm:justify-start"
            >
              {COUNTRIES.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCountry === country
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50 scale-105"
                      : "bg-white text-gray-700 border hover:bg-gray-50 hover:shadow"
                  }`}
                >
                  {country}
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {filteredUniversities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20 text-gray-500"
          >
            No universities match your filters.
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7"
            >
              {filteredUniversities.map((uni, i) => (
                <UniversityCard
                  key={uni._id || uni.slug}
                  uni={uni}
                  index={i}
                  mounted={mounted}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
