"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const programs = [
  {
    title: "Undergraduate Programs",
    desc: "Bachelor’s degrees across top global universities",
    tag: "UG",
  },
  {
    title: "Postgraduate Programs",
    desc: "Master’s programs with global career exposure",
    tag: "PG",
  },
  {
    title: "Diploma & Certificate",
    desc: "Short-term, skill-focused international programs",
    tag: "Diploma",
  },
  {
    title: "PhD & Research",
    desc: "Advanced research opportunities abroad",
    tag: "PhD",
  },
];

const fields = [
  "Computer Science & IT",
  "Business & Management",
  "Engineering",
  "Health & Medicine",
  "Data Science & AI",
  "Arts & Design",
  "Law & Humanities",
  "Hospitality & Tourism",
];

export default function Programs() {
  return (
    <div className="bg-[#0B0F19] text-white min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold leading-tight"
        >
          Explore Study Programs Abroad
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 max-w-2xl text-gray-400 text-lg"
        >
          Discover globally recognized programs, top universities, and
          career-focused courses designed for international students.
        </motion.p>
      </section>

      {/* Program Types */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {programs.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-indigo-500/40 transition"
          >
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
              {item.tag}
            </span>

            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Fields of Study */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-semibold mb-8">Popular Fields of Study</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fields.map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-gray-300 hover:bg-white/10 transition"
            >
              {field}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 className="text-2xl font-semibold">
            Confused about choosing the right program?
          </h3>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 font-medium"
          >
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  );
}
