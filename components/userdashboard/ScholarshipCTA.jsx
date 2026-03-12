"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ScholarshipsPage() {
  const [scholarships] = useState([
    {
      name: "Global Excellence Scholarship",
      university: "University of Toronto",
      amount: "$10,000",
      deadline: "30 June 2026",
      country: "Canada",
    },
    {
      name: "International Merit Scholarship",
      university: "University of Manchester",
      amount: "$5,000",
      deadline: "15 July 2026",
      country: "UK",
    },
    {
      name: "Future Leaders Scholarship",
      university: "Monash University",
      amount: "$15,000",
      deadline: "10 August 2026",
      country: "Australia",
    },
    {
      name: "STEM Excellence Award",
      university: "MIT",
      amount: "$25,000",
      deadline: "1 December 2026",
      country: "USA",
    },
  ]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Scholarships & Funding
        </h1>
        <p className="text-gray-400 mt-2">
          Discover scholarships that can help reduce your study abroad costs.
        </p>
      </div>

      {/* Hero CTA */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-950/40 to-yellow-950/20 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="text-yellow-400 text-3xl">💰</span>
            Scholarships
          </h2>

          <p className="text-gray-300 mb-6">
            You could be eligible for <strong>$5k–$25k</strong> in funding.
            Explore scholarships available for international students.
          </p>

          <button className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition">
            Explore Scholarships
          </button>
        </motion.div>

        {/* Funding Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Funding Tips
          </h2>

          <ul className="space-y-3 text-gray-300 text-sm">
            <li>✔ Apply early to maximize your chances.</li>
            <li>✔ Many universities offer automatic scholarships.</li>
            <li>✔ Maintain strong academic performance.</li>
            <li>✔ Prepare a strong Statement of Purpose.</li>
          </ul>
        </motion.div>
      </div>

      {/* Scholarship List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => (
          <motion.div
            key={scholarship.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
          >
            <h3 className="text-white font-semibold mb-2">
              {scholarship.name}
            </h3>

            <p className="text-sm text-gray-400 mb-1">
              {scholarship.university}
            </p>

            <p className="text-yellow-400 font-semibold mb-3">
              {scholarship.amount}
            </p>

            <div className="text-xs text-gray-400 mb-4">
              Deadline: {scholarship.deadline}
            </div>

            <button className="bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#3555c8] transition">
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
