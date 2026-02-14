"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  matchCountry,
  matchCourse,
  matchUniversity,
  buildCourseIndex,
} from "@/lib/searchUtils";

import { useDispatch } from "react-redux";
import { fetchUniversities } from "@/store/universitySlice";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import { COUNTRIES } from "@/data/countries";
import { coursesData } from "@/data/coursesData";
import { categoryData } from "@/data/coursescategory";
import { universitiesByCategory } from "@/data/universitybycatogery";
import { COUNTRY_PAGE_DATA } from "@/data/countrydetail";

import { motion } from "framer-motion";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { list: universities } = useSelector((state) => state.universities);

  const query = searchParams.get("q")?.trim() || "";

  useEffect(() => {
    if (universities.length === 0) {
      dispatch(fetchUniversities());
    }
  }, [dispatch, universities.length]);

  const courseIndex = useMemo(
    () =>
      buildCourseIndex({
        coursesData,
        popularCourses: COUNTRY_PAGE_DATA.popularCourses,
        categoryData,
      }),
    [],
  );

  let intent = "unknown";

  if (query && universities.length > 0) {
    if (matchCountry(query, COUNTRIES)) intent = "country";
    else if (matchCourse(query, courseIndex)) intent = "course";
    else if (matchUniversity(query, universities, universitiesByCategory))
      intent = "university";
  }

  const titles = {
    country: "Country not found",
    course: "Course not found",
    university: "University not found",
    unknown: "No results found",
  };

  const messages = {
    country: "We couldn't locate any country matching your search.",
    course: "No courses match this name or keyword.",
    university: "No university matches your search.",
    unknown: "Sorry, nothing matched what you entered.",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.14,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 140,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -8 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 180,
        delay: 0.1,
      },
    },
  };

  const pillVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 160 },
    },
  };

  const suggestionVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.6 + i * 0.08,
        type: "spring",
        damping: 15,
        stiffness: 130,
      },
    }),
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0e17] via-[#0d1324] to-[#0a0e17] text-gray-100 overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      >
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"
          animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-emerald-900/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"
          animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.42, 0.25] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-32">
        <motion.div
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md"
            variants={itemVariants}
          >
            Search Results
          </motion.h1>

          <motion.div
            className="mt-5 inline-flex items-center gap-3 px-5 py-2.5 bg-black/30 backdrop-blur-md border border-white/10 rounded-full"
            variants={pillVariants}
          >
            <span className="text-gray-400">for</span>
            <code className="text-emerald-400 font-mono font-medium break-all">
              {query ? `"${query}"` : "—"}
            </code>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-10" variants={iconVariants}>
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-red-950/70 to-rose-950/40 border border-red-800/30 shadow-[0_0_40px_rgba(185,28,28,0.15)]">
              <span className="text-6xl opacity-90">✦</span>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6 tracking-wide"
            variants={itemVariants}
          >
            {titles[intent]}
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {messages[intent]}
          </motion.p>

          <motion.p className="mt-6 text-gray-500" variants={itemVariants}>
            Double-check spelling or try a broader term.
          </motion.p>

          {/* Suggestions */}
          <motion.div className="mt-8" variants={containerVariants}>
            <motion.p
              className="text-sm text-gray-500 mb-6"
              variants={itemVariants}
            >
              Popular searches right now:
            </motion.p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {[
                "Computer Science",
                "MBA",
                "Canada Study",
                "Australia Universities",
                "Data Science",
                "UK Masters",
              ].map((suggestion, i) => (
                <motion.a
                  key={suggestion}
                  href={`?q=${encodeURIComponent(suggestion)}`}
                  className="
                      group relative px-5 py-2.5 
                      bg-gradient-to-r from-white/5 to-white/3 
                      hover:from-emerald-950/40 hover:to-emerald-900/30
                      border border-white/10 hover:border-emerald-700/40
                      rounded-xl text-sm font-medium text-gray-300 
                      transition-all duration-300 hover:text-emerald-300
                      hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]
                      hover:-translate-y-0.5
                    "
                  custom={i}
                  variants={suggestionVariants}
                >
                  {suggestion}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.8 }}
      />
    </div>
  );
}
