"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { debounce } from "lodash"; // Install: npm install lodash

/* ================= DATA ================= */
const coursesData = [
  {
    title: "Computer Science",
    category: "engineering",
    desc: "AI, Software, Systems & more",
  },
  {
    title: "Data Science",
    category: "engineering",
    desc: "Analytics, AI, Big Data",
  },
  {
    title: "Cybersecurity",
    category: "engineering",
    desc: "Security, Networks, Cloud",
  },
  { title: "MBA", category: "business", desc: "Management & Leadership" },
  {
    title: "Finance & Accounting",
    category: "business",
    desc: "Banking, FinTech, CPA",
  },
  {
    title: "Nursing",
    category: "healthcare",
    desc: "Clinical & Healthcare Studies",
  },
];

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
  const [rawSearch, setRawSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Debounce search input to reduce filtering frequency
  const [search, setSearch] = useState("");
  useEffect(() => {
    const handler = debounce(() => {
      setSearch(rawSearch);
    }, 300);
    handler();
    return () => handler.cancel();
  }, [rawSearch]);

  // Memoize filtered results to prevent recalculation on every render
  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <section className="min-h-screen bg-[#0b0f1a] text-white">
      {/* HERO SECTION - Lightweight animations */}
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

          {/* Category Chips - Minimal motion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            {Object.entries(CATEGORY_META).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
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

      {/* COURSES GRID - Optimized for performance */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {filteredCourses.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 text-lg py-20"
          >
            No courses found matching your search.
          </motion.p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredCourses.map((course) => {
              const meta = CATEGORY_META[course.category];

              return (
                <motion.div
                  key={course.title}
                  variants={cardVariants}
                  whileHover="hover"
                  className="h-full"
                >
                  <Link
                    href={`/courses/${course.category}`}
                    className="block h-full group"
                  >
                    <div className="relative h-full rounded-3xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-500 hover:border-transparent hover:shadow-2xl group-hover:bg-white/8">
                      <div
                        className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${meta.color}`}
                      />

                      <span
                        className={`inline-block px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${meta.color} text-white shadow-md`}
                      >
                        {meta.label}
                      </span>

                      <h3 className="mt-6 text-2xl font-bold group-hover:text-indigo-300 transition-colors">
                        {course.title}
                      </h3>

                      <p className="mt-3 text-gray-400 leading-relaxed">
                        {course.desc}
                      </p>

                      <div className="mt-10 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          USA • UK • Canada • Australia
                        </span>
                        <span className="text-indigo-400 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                          Explore <span>→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
