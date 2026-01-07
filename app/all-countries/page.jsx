"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export default function Countries() {
  const countries = [
    {
      name: "Canada",
      desc: "Top universities & PR options",
      img: "countries/canada.jpg",
    },
    {
      name: "USA",
      desc: "World-class education system",
      img: "countries/usa.jpg",
    },
    {
      name: "UK",
      desc: "Shorter degrees & global exposure",
      img: "countries/uk.jpg",
    },
    {
      name: "Australia",
      desc: "Work while studying",
      img: "countries/australia.jpg",
    },
    {
      name: "Germany",
      desc: "Low-cost quality education",
      img: "countries/germany.jpg",
    },
    { name: "Italy", desc: "Tech hub of Europe", img: "countries/italy.jpg" },
    {
      name: "China",
      desc: "Safe & student-friendly",
      img: "countries/china.jpg",
    },
    {
      name: "France",
      desc: "Affordable education & culture",
      img: "countries/france.jpg",
    },
  ];

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

      {/* SEARCH BAR */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        className="relative -mt-10 z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search country..."
              className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            />

            <select className="bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-gray-300">
              <option>Region</option>
              <option>Europe</option>
              <option>Asia</option>
              <option>America</option>
              <option>Australia</option>
            </select>

            <button className="bg-[#38BDF8] text-[#020617] px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
              Apply
            </button>
          </div>
        </div>
      </motion.section>

      {/* COUNTRIES GRID - COMPACT FIXED HEIGHT CARDS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {countries.map((country) => (
              <Link
                key={country.name}
                href={`/all-countries/${country.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                  className="group bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden hover:border-[#38BDF8]/40 cursor-pointer h-full flex flex-col"
                >
                  {/* Reduced Image Height */}
                  <div className="h-40 overflow-hidden bg-gray-800">
                    <motion.img
                      src={country.img}
                      alt={country.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>

                  {/* Compact Content Area */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{country.name}</h3>
                      <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                        {country.desc}
                      </p>
                    </div>

                    {/* Explore link at bottom */}
                    <div className="mt-4">
                      <span className="inline-block text-[#38BDF8] font-medium group-hover:text-[#22D3EE] transition">
                        Explore →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
