"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

//all cards
import UniversityCard from "@/components/ui/UniversityCard";
import CourseCard from "@/components/ui/CourseCard";
import CountryCard from "@/components/ui/CountryCard";

export default function SearchClient() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const query = searchParams.get("q")?.trim() || "";

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setResult(null);
      return;
    }

    async function searchData() {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`,
        );

        if (!res.ok) {
          setResult({ type: "unknown" });
          return;
        }

        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error("Search failed:", err);
        setResult({ type: "unknown" });
      } finally {
        setLoading(false);
      }
    }

    searchData();
  }, [query]);

  const universities = result?.results?.universities || [];
  const courses = result?.results?.courses || [];
  const countries = result?.results?.countries || [];

  const hasResults =
    universities.length > 0 || courses.length > 0 || countries.length > 0;

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

  const pillVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 160 },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0e17] via-[#0d1324] to-[#0a0e17] text-gray-100 overflow-hidden">
      {/* Animated background orbs */}
      <p className="text-gray-400 mb-8">
        {universities.length + courses.length + countries.length} results found
      </p>
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
          {loading && (
            <h2 className="text-3xl font-bold text-white">Searching...</h2>
          )}

          {!loading && hasResults && (
            <div className="space-y-12 text-left">
              {/* Universities */}
              {universities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Universities</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {universities.map((uni, i) => (
                      <UniversityCard
                        key={uni._id || uni.slug}
                        uni={uni}
                        index={i}
                        mounted={true}
                        shouldReduceMotion={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {courses.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Courses</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {courses.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {/* Countries */}
              {countries.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Countries</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {countries.map((country, i) => (
                      <CountryCard
                        key={country._id}
                        title={country.name}
                        slug={country.slug}
                        image={country.heroImage?.url}
                        flag={country.flagImage?.url}
                        capital={country.capital}
                        visaSuccessRate={country.visaSuccessRate}
                        priority={i < 2}
                        variant="light"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !hasResults && (
            <h2 className="text-3xl font-bold text-white">No results found</h2>
          )}
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
