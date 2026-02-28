"use client";

import { useState, useMemo, memo, useEffect } from "react";
import { LazyMotion, m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, X } from "lucide-react";
import CountryCard from "@/components/ui/CountryCard";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function CountriesClient({ countries = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  useEffect(() => {
    const delay = setTimeout(() => {
      setAppliedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setAppliedSearch("");
  };

  const filteredCountries = useMemo(() => {
    const query = normalize(appliedSearch);
    const keywords = query.split(" ").filter(Boolean);

    return countries.filter((country) => {
      const searchableText = normalize(
        `${country.name} ${country.capital} ${country.continent}`,
      );

      const matchesSearch =
        keywords.length === 0 ||
        keywords.every((word) => searchableText.includes(word));

      const matchesRegion =
        selectedRegion === "All Regions" ||
        country.continent === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [countries, appliedSearch, selectedRegion]);

  const regions = [
    "All Regions",
    ...new Set(countries.map((c) => c.continent)),
  ];

  return (
    <LazyMotion features={loadFeatures}>
      <main className="bg-gradient-to-b from-[#020617] to-[#0a0f1f] text-white min-h-screen">
        {/* HERO */}
        <m.section
          initial="hidden"
          animate="visible"
          variants={container}
          className="pt-40 pb-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <m.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
            >
              Discover Your Dream Study Destination
            </m.h1>
            <m.p
              variants={fadeUp}
              className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              Explore top countries with world-class education, scholarships,
              and global career opportunities.
            </m.p>
            <m.div variants={fadeUp} className="mt-10">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#38BDF8] to-cyan-500 text-[#020617] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all"
              >
                Book Free Counseling <ArrowRight size={20} />
              </Link>
            </m.div>
          </div>
        </m.section>

        {/* SEARCH BAR */}
        <section className="relative -mt-16 z-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search country or keyword..."
                    className="w-full bg-transparent border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                      aria-label="Clear search"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-[#0B0F19] border border-white/20 rounded-2xl px-6 py-4 text-gray-300 focus:outline-none focus:border-cyan-400"
                >
                  {regions.map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* COUNTRY GRID */}
        <m.section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {filteredCountries.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xl">
                No countries found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCountries.map((country, index) => (
                  <CountryCard
                    key={country._id}
                    title={country.name}
                    slug={country.slug}
                    image={country.heroImage?.url}
                    flag={country.flagImage?.url}
                    capital={country.capital}
                    visaSuccessRate={country.visaSuccessRate}
                    priority={index < 4}
                  />
                ))}
              </div>
            )}
          </div>
        </m.section>
      </main>
    </LazyMotion>
  );
}
