"use client";

// app/(site)/courses/CoursesClient.jsx
//
// Everything interactive that used to live in page.jsx before the
// server/client split (Section 14 fix #1). No Redux, no client-side
// fetch — `initialCourses` arrives already server-rendered from
// page.jsx and every filter below runs client-side over that array,
// same as before, just without the network round-trip and without
// blocking Googlebot's first paint.
//
// FIX (review round 2): the previous version of this file called
// useSearchParams() to read/sync the active category to the URL. In
// the Next.js App Router, ANY client component that calls
// useSearchParams() must be wrapped in a <Suspense> boundary by its
// parent, or `next build` either fails outright or forces the whole
// route back into full client-side rendering — which would silently
// undo the point of the Step 2 fix (page.jsx was converted to a server
// component specifically so Googlebot gets real server-rendered HTML).
//
// The category chips here are a pure client-side filter over data
// that's already fully loaded (initialCourses) — there's no server
// re-fetch happening when you click a chip, so there was never a real
// reason to touch the URL/searchParams in the first place. Removed
// useSearchParams() and useRouter() entirely and replaced with plain
// local useState. This also matches the pattern your own
// UniversitiesClient.jsx and allCountriesClient.jsx use for anything
// that DOES need the URL (they read it server-side in page.jsx and
// pass it down as a prop, they never call useSearchParams()
// client-side) — so this keeps the whole app consistent, not just
// this one file.
//
// If category filtering is ever turned into real server-rendered
// /courses?category=X pages with distinct canonical URLs (the same
// way /programs/universities handles ?search=), that's the point to
// revisit this and move the read into page.jsx as a prop, same as
// everywhere else — not to reach for useSearchParams() again.

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import CourseCard from "@/components/ui/CourseCard";
import React from "react";

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

/* ================= ANIMATION VARIANTS ================= */
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

/* ================= COMPONENT ================= */
export default function CoursesClient({ initialCourses = [] }) {
  // Local UI state only — no URL sync, no useSearchParams(). See the
  // fix note at the top of this file for why.
  const [activeCategory, setActiveCategory] = useState("all");
  const [rawSearch, setRawSearch] = useState("");

  // No fetch, no loading state — data is already here from the server.
  const courses = initialCourses;

  // Debounce search input
  const [search, setSearch] = useState("");
  const debouncedSetSearch = useMemo(
    () => debounce((value) => setSearch(value), 300),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setRawSearch(value);
    debouncedSetSearch(value);
  };

  // Filter based on search & category
  const filteredCourses = useMemo(() => {
    let result = courses;

    if (activeCategory !== "all") {
      result = result.filter((course) => {
        const field = course.field?.toLowerCase() || "";
        const keywords = CATEGORY_FIELD_MAP[activeCategory] || [];
        return keywords.some((keyword) => field.includes(keyword));
      });
    }

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
              onChange={handleSearchChange}
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

      {/* COURSES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {filteredCourses.length === 0 ? (
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
            {filteredCourses.map((course) => (
              <React.Fragment key={course._id}>
                <CourseCard course={course} />
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
