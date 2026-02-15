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
import { useSelector, useDispatch } from "react-redux";
import { fetchUniversities } from "@/store/universitySlice";

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
      delay: i * 0.06,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  hover: {
    y: -10,
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

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
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
      >
        <div className="relative h-52 sm:h-56 overflow-hidden">
          <Image
            src={
              uni.images?.[0]?.url ||
              uni.logo?.url ||
              "/university-placeholder.jpg"
            }
            alt={uni.name || "University"}
            fill
            priority={index < 5}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow">
            #{uni.qsRanking || "—"}
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4">
            <div className="bg-white/90 backdrop-blur rounded-xl p-2.5 shadow flex-shrink-0">
              <Image
                src={uni.logo?.url || "/logo-placeholder.png"}
                alt={`${uni.name} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <h3 className="font-bold text-lg leading-tight drop-shadow-md">
                {uni.name}
              </h3>
              <p className="text-sm text-white/85 mt-0.5">
                {uni.city && uni.country
                  ? `${uni.city}, ${uni.country}`
                  : uni.country || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <p className="text-gray-600 text-sm line-clamp-3 mb-6">
            {uni.description || uni.desc || "No description available."}
          </p>

          <div className="mt-auto space-y-5">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>
                🎓 {uni.totalStudents?.toLocaleString() || "—"} students
              </span>
              <span>
                📊 {uni.acceptanceRate ? `${uni.acceptanceRate}%` : "—"}{" "}
                acceptance
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <span className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                Explore University
                <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">
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

export default function UniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [maxRank, setMaxRank] = useState(null);
  const [maxAcceptance, setMaxAcceptance] = useState(null);
  const [sortBy, setSortBy] = useState("rank");

  const dispatch = useDispatch();
  const { list: universities, loading } = useSelector(
    (state) => state.universities,
  );

  useEffect(() => {
    if (universities.length === 0) {
      dispatch(fetchUniversities());
    }
  }, [dispatch, universities.length]);

  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const deferredSearch = useDeferredValue(searchTerm);

  const filteredUniversities = useMemo(() => {
    let result = [...universities];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/40 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse text-3xl font-bold text-gray-400">
            Loading universities...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="bg-gradient-to-br from-blue-600/5 via-indigo-50 to-purple-50/20 pt-28 pb-20">
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
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 -mt-12">
        <motion.div layout className="mb-14 space-y-7">
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
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
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
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
              <select
                value={maxRank ?? ""}
                onChange={(e) =>
                  setMaxRank(e.target.value ? Number(e.target.value) : null)
                }
                className="px-5 py-2.5 rounded-xl border bg-white text-sm focus:ring-2 focus:ring-blue-400/40 min-w-[140px]"
              >
                <option value="">All Rankings</option>
                <option value="10">Top 10</option>
                <option value="50">Top 50</option>
                <option value="100">Top 100</option>
                <option value="200">Top 200</option>
              </select>

              <select
                value={maxAcceptance ?? ""}
                onChange={(e) =>
                  setMaxAcceptance(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="px-5 py-2.5 rounded-xl border bg-white text-sm focus:ring-2 focus:ring-blue-400/40 min-w-[160px]"
              >
                <option value="">All Acceptance</option>
                <option value="10">≤ 10%</option>
                <option value="20">≤ 20%</option>
                <option value="30">≤ 30%</option>
                <option value="50">≤ 50%</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-2.5 rounded-xl border bg-white text-sm focus:ring-2 focus:ring-blue-400/40"
              >
                <option value="rank">Sort by Rank</option>
                <option value="students">Sort by Size</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition min-w-[110px]"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>

        {filteredUniversities.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No universities match your filters.
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              layout
              variants={containerVariants}
              initial={false}
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
