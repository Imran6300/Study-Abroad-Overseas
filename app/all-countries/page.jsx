"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { memo } from "react";

/* ================= PERFORMANCE SAFE ANIMATIONS ================= */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ================= STATIC DATA (NO RE-CREATION) ================= */
const COUNTRIES = [
  {
    name: "Canada",
    desc: "Top universities & PR options",
    img: "/countries/canada.jpg",
  },
  {
    name: "USA",
    desc: "World-class education system",
    img: "/countries/usa.jpg",
  },
  {
    name: "UK",
    desc: "Shorter degrees & global exposure",
    img: "/countries/uk.jpg",
  },
  {
    name: "Australia",
    desc: "Work while studying",
    img: "/countries/australia.jpg",
  },
  {
    name: "Germany",
    desc: "Low-cost quality education",
    img: "/countries/germany.jpg",
  },
  { name: "Italy", desc: "Tech hub of Europe", img: "/countries/italy.jpg" },
  {
    name: "China",
    desc: "Safe & student-friendly",
    img: "/countries/china.jpg",
  },
  {
    name: "France",
    desc: "Affordable education & culture",
    img: "/countries/france.jpg",
  },
];

export default function Countries() {
  return (
    <main className="bg-[#020617] text-white min-h-screen">
      {/* HERO */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={container}
        className="pt-32 pb-20 bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#020617]"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold"
          >
            Explore Study Destinations
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Discover countries offering world-class education and global
            opportunities.
          </motion.p>
        </div>
      </motion.section>

      {/* SEARCH BAR (UNCHANGED UI) */}
      <section className="relative -mt-10 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
            <input
              placeholder="Search country..."
              className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white"
            />
            <select className="bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-gray-300">
              <option>Region</option>
              <option>Europe</option>
              <option>Asia</option>
              <option>America</option>
              <option>Australia</option>
            </select>
            <button className="bg-[#38BDF8] text-[#020617] px-6 py-3 rounded-xl font-semibold">
              Apply
            </button>
          </div>
        </div>
      </section>

      {/* GRID */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={container}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {COUNTRIES.map((country) => (
            <CountryCard key={country.name} country={country} />
          ))}
        </div>
      </motion.section>
    </main>
  );
}

/* ================= MEMOIZED CARD ================= */
const CountryCard = memo(function CountryCard({ country }) {
  return (
    <Link
      href={`/all-countries/${country.name.toLowerCase()}`}
      className="group"
    >
      <motion.div
        variants={fadeUp}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      >
        <div className="relative h-40 overflow-hidden">
          <motion.div whileHover={{ scale: 1.1 }} className="h-full w-full">
            <Image
              src={country.img}
              alt={country.name}
              fill
              sizes="(max-width:768px) 100vw, 25vw"
              className="object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>

        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-xl font-semibold">{country.name}</h3>
            <p className="mt-2 text-sm text-gray-400">{country.desc}</p>
          </div>
          <span className="mt-4 text-[#38BDF8] font-medium">Explore →</span>
        </div>
      </motion.div>
    </Link>
  );
});
