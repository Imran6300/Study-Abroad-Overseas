"use client";

import { useState, useMemo, memo } from "react";
import { LazyMotion, m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, X } from "lucide-react";

// Lazy load only needed features
const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

/* ================= ANIMATIONS ================= */
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

/* ================= COUNTRY DATA ================= */
const COUNTRIES = [
  {
    name: "Canada",
    desc: "Top unis & strong PR pathways",
    img: "/countries/canada.jpg",
    flag: "🇨🇦",
    region: "North America",
  },
  {
    name: "USA",
    desc: "World-class universities & innovation",
    img: "/countries/usa.jpg",
    flag: "🇺🇸",
    region: "North America",
  },
  {
    name: "UK",
    desc: "Prestigious degrees in 1–3 years",
    img: "/countries/uk.jpg",
    flag: "🇬🇧",
    region: "Europe",
  },
  {
    name: "Australia",
    desc: "Great work rights & lifestyle",
    img: "/countries/australia.jpg",
    flag: "🇦🇺",
    region: "Asia & Oceania",
  },
  {
    name: "Germany",
    desc: "Tuition-free or low-cost quality",
    img: "/countries/germany.jpg",
    flag: "🇩🇪",
    region: "Europe",
  },
  {
    name: "Ireland",
    desc: "Tech hub & post-study stay",
    img: "/countries/ireland.jpg",
    flag: "🇮🇪",
    region: "Europe",
  },
  {
    name: "New Zealand",
    desc: "Safe & nature-rich education",
    img: "/countries/newzealand.jpg",
    flag: "🇳🇿",
    region: "Asia & Oceania",
  },
  {
    name: "France",
    desc: "Affordable & cultural richness",
    img: "/countries/france.jpg",
    flag: "🇫🇷",
    region: "Europe",
  },
  {
    name: "Italy",
    desc: "Design, fashion & historic unis",
    img: "/countries/italy.jpg",
    flag: "🇮🇹",
    region: "Europe",
  },
  {
    name: "Netherlands",
    desc: "English-taught programs & innovation",
    img: "/countries/netherland.jpg",
    flag: "🇳🇱",
    region: "Europe",
  },
  {
    name: "Singapore",
    desc: "Asia's top education & safety",
    img: "/countries/singapore.jpg",
    flag: "🇸🇬",
    region: "Asia & Oceania",
  },
  {
    name: "Dubai/UAE",
    desc: "Modern campuses & job opportunities",
    img: "/countries/dubai.jpg",
    flag: "🇦🇪",
    region: "Middle East",
  },
];

/* ================= SEARCH NORMALIZATION ================= */
const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function Countries() {
  const [searchTerm, setSearchTerm] = useState(""); // what user is typing
  const [appliedSearch, setAppliedSearch] = useState(""); // only updated on button click
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setAppliedSearch("");
  };

  /* ================= FILTER LOGIC ================= */
  const filteredCountries = useMemo(() => {
    const query = normalize(appliedSearch);
    const keywords = query.split(" ").filter(Boolean);

    return COUNTRIES.filter((country) => {
      const searchableText = normalize(
        `${country.name} ${country.desc} ${country.region}`
      );

      const matchesSearch =
        keywords.length === 0 ||
        keywords.every((word) => searchableText.includes(word));

      const matchesRegion =
        selectedRegion === "All Regions" || country.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [appliedSearch, selectedRegion]);

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
                href="/contact"
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
                  <option>All Regions</option>
                  <option>North America</option>
                  <option>Europe</option>
                  <option>Asia & Oceania</option>
                  <option>Middle East</option>
                </select>

                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-[#38BDF8] to-cyan-500 text-[#020617] px-10 py-4 rounded-2xl font-bold hover:brightness-110 hover:scale-105 transition-all duration-300"
                >
                  Search
                </button>
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
                    key={country.name}
                    country={country}
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

/* ================= COUNTRY CARD ================= */
const CountryCard = memo(function CountryCard({ country, priority }) {
  return (
    <Link
      href={`/all-countries/${country.name.toLowerCase()}`}
      className="group block"
    >
      <m.div
        variants={fadeUp}
        whileHover={{ y: -12, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-gradient-to-b from-[#0B0F19] to-[#0a0f1f] border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-shadow h-full flex flex-col"
      >
        <div className="relative h-52 overflow-hidden">
          <Image
            src={country.img}
            alt={`Study in ${country.name} – Top universities, scholarships & visa guidance`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading={priority ? undefined : "lazy"}
            priority={!!priority}
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 text-4xl drop-shadow-lg">
            {country.flag}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-2xl font-bold">{country.name}</h3>
          <p className="mt-2 text-gray-400 text-base">{country.desc}</p>
          <div className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 text-[#38BDF8] font-semibold group-hover:text-cyan-300 transition">
              Explore Programs <ArrowRight size={18} />
            </span>
          </div>
        </div>
      </m.div>
    </Link>
  );
});
