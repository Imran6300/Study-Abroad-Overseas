"use client";

import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useDeferredValue,
  memo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { universityItems } from "@/components/Home/Universities/TopCountriesData";

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
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  hover: {
    y: -10,
    scale: 1.025,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
      mass: 0.6,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

/* ================= MEMOIZED CARD ================= */
const UniversityCard = memo(function UniversityCard({
  uni,
  index,
  mounted,
  shouldReduceMotion,
}) {
  return (
    <motion.div
      layout
      custom={index}
      variants={cardVariants}
      initial={mounted && !shouldReduceMotion ? "hidden" : false}
      animate="visible"
      whileHover={shouldReduceMotion ? undefined : "hover"}
    >
      <Link
        href={`/universities/${uni.slug}`}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md flex flex-col h-full"
      >
        <div className="relative h-52 sm:h-56 overflow-hidden">
          <Image
            src={uni.image}
            alt={uni.name}
            fill
            priority={index < 4} // ✅ above-the-fold only
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-sm">
            #{uni.rank}
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4">
            <div className="bg-white/95 backdrop-blur rounded-xl p-2.5 shadow-sm flex-shrink-0">
              <Image
                src={uni.logo}
                alt={`${uni.name} logo`}
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <h3 className="font-bold text-lg leading-tight drop-shadow-md">
                {uni.name}
              </h3>
              <p className="text-sm text-white/80 mt-0.5">{uni.location}</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <p className="text-gray-600 text-sm line-clamp-3 mb-6">{uni.desc}</p>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>🎓 {uni.students} Students</span>
              <span>📊 {uni.acceptance} Acceptance</span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <span className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                Explore University →
                <span className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

/* ================= PAGE ================= */
export default function UniversitiesPage() {
  const shouldReduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");

  // ✅ React 18 performance
  const deferredSearch = useDeferredValue(searchTerm);

  const onSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);

  const onCountryChange = useCallback(
    (country) => setSelectedCountry(country),
    []
  );

  const filteredUniversities = useMemo(() => {
    return universityItems.filter((uni) => {
      const matchesSearch =
        deferredSearch === "" ||
        uni.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        uni.location.toLowerCase().includes(deferredSearch.toLowerCase());

      const matchesCountry =
        selectedCountry === "All" || uni.location.includes(selectedCountry);

      return matchesSearch && matchesCountry;
    });
  }, [deferredSearch, selectedCountry]);

  return (
    <div className="min-h-screen bg-gray-50/40">
      {/* HERO */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gradient-to-br from-blue-600/10 via-indigo-50 to-purple-50/30 pt-28 pb-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Discover World-Class Universities
            </h1>
            <p className="mt-5 text-xl text-gray-700 leading-relaxed">
              Find your perfect university abroad — compare rankings, programs,
              acceptance rates, and student life.
            </p>
          </div>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-6 py-16 -mt-12">
        {/* SEARCH */}
        <motion.div layout initial={false} className="mb-12 space-y-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search universities or countries..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-lg transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {COUNTRIES.map((country) => (
              <button
                key={country}
                onClick={() => onCountryChange(country)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCountry === country
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </motion.div>

        {/* GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            layout
            variants={containerVariants}
            initial={false}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredUniversities.map((uni, index) => (
              <UniversityCard
                key={uni.slug}
                uni={uni}
                index={index}
                mounted={mounted}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
