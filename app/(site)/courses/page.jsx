"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/ui/CourseCard";
import StudentProCard from "@/components/upgrade/StudentProCard";
import React from "react";

/* ================= DATA ================= */
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "@/store/courseSlice";

const CATEGORY_META = {
  all: { label: "All Courses", color: "from-gray-500 to-gray-600" },
  engineering: {
    label: "Engineering & Technology",
    color: "from-indigo-500 to-blue-500",
  },
  business: {
    label: "Business & Management",
    color: "from-orange-500 to-amber-500",
  },
  healthcare: {
    label: "Healthcare & Medicine",
    color: "from-emerald-500 to-teal-500",
  },
};

const CATEGORY_FIELD_MAP = {
  engineering: ["computer science", "engineering", "it"],
  business: ["business", "management", "mba"],
  healthcare: ["medicine", "healthcare", "nursing"],
};

/* ================= OPTIMIZED ANIMATION VARIANTS ================= */
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -8, transition: { duration: 0.3 } },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* ================= PAGE COMPONENT ================= */
export default function Courses() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [rawSearch, setRawSearch] = useState("");

  const queryCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(queryCategory);

  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    if (!courses.length) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all";
    setActiveCategory(categoryFromUrl);
  }, [searchParams.toString()]);

  // Debounce search input
  const [search, setSearch] = useState("");
  useEffect(() => {
    const handler = debounce(() => {
      setSearch(rawSearch);
    }, 300);
    handler();
    return () => handler.cancel();
  }, [rawSearch]);

  // Filter based on search & category
  const filteredCourses = useMemo(() => {
    let result = courses;

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((course) => {
        const field = course.field?.toLowerCase() || "";
        const keywords = CATEGORY_FIELD_MAP[activeCategory] || [];

        return keywords.some((keyword) => field.includes(keyword));
      });
    }

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((course) =>
        course.title.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [search, activeCategory, courses]);

  return (
    <section className="min-h-screen bg-[#0b0f1a] text-white">
      {/* HERO SECTION */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
          >
            Find Your Global Career Path
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Discover world-class programs in engineering, business, healthcare,
            and beyond — designed for international success.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search programs (e.g., Cybersecurity, MBA, Nursing...)"
              value={rawSearch}
              onChange={(e) => setRawSearch(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 
                         focus:border-indigo-500 transition-all duration-300 text-lg"
            />
          </motion.div>

          {/* Category Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            {Object.entries(CATEGORY_META).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveCategory(key);
                  router.push(
                    key === "all" ? "/courses" : `/courses?category=${key}`,
                    { scroll: false },
                  );
                }}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300
                  ${
                    activeCategory === key
                      ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* COURSES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {loading ? (
          <p className="text-center text-gray-400 text-lg py-20">
            Loading courses...
          </p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-400 text-lg py-20">
            No courses found.
          </p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredCourses.map((course, i) => (
              <React.Fragment key={course._id}>
                {i === 3 && (
                  <div className="col-span-full">
                    <StudentProCard
                      variant="dark"
                      title="Get AI Course Recommendations"
                      description="Student Pro analyzes your academic background and recommends the best courses and universities for your career goals."
                    />
                  </div>
                )}

                <CourseCard course={course} />
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
