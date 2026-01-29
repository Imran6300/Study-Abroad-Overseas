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
  { title: "Engineering & Technology", slug: "engineering" },
  { title: "Business & Management", slug: "business" },
  { title: "Healthcare & Medicine", slug: "healthcare" },
];

const scholarshipPartners = [
  {
    name: "Merit-Based Scholarships",
    desc: "Awarded based on academic excellence and achievements",
    amount: "Up to 100% Tuition",
  },
  {
    name: "Country Government Scholarships",
    desc: "Funded by host country governments for international students",
    amount: "₹5L – ₹30L",
  },
  {
    name: "University Partner Scholarships",
    desc: "Exclusive scholarships from our partner universities",
    amount: "₹2L – ₹15L",
  },
  {
    name: "Need-Based Financial Aid",
    desc: "Support for students with financial constraints",
    amount: "Partial to Full Funding",
  },
];
const processSteps = [
  {
    step: "01",
    title: "Free Profile Assessment",
    desc: "We evaluate your academic background, budget, and career goals.",
  },
  {
    step: "02",
    title: "University & Program Shortlisting",
    desc: "Get personalized program and university recommendations.",
  },
  {
    step: "03",
    title: "Applications & Scholarships",
    desc: "We handle applications, SOPs, and scholarship opportunities.",
  },
  {
    step: "04",
    title: "Visa & Pre-Departure Support",
    desc: "End-to-end visa guidance and preparation before you fly.",
  },
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
          Study Abroad Programs at Top Global Universities
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 max-w-2xl text-gray-400 text-lg"
        >
          Explore undergraduate, postgraduate, diploma, and PhD programs abroad.
          Get expert guidance on university selection, scholarships, admissions,
          and visas for your international education journey.
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
            <Link
              href="/courses"
              className="inline-block mt-4 text-indigo-400 font-medium"
            >
              Browse Courses →
            </Link>
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
              <Link key={index} href={`/courses/${field.slug}`}>
                {field.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Scholarship Partners */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-semibold mb-4"
        >
          Scholarship & Funding Partners
        </motion.h2>

        <p className="text-gray-400 max-w-2xl mb-12">
          We collaborate with global universities and institutions to help
          students secure scholarships, grants, and financial aid for studying
          abroad.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scholarshipPartners.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-indigo-500/40 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>

              <p className="text-sm text-gray-400 mb-4">{item.desc}</p>

              <span className="inline-block text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                {item.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How We Help You */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-semibold mb-4"
        >
          How We Help You Study Abroad
        </motion.h2>

        <p className="text-gray-400 max-w-2xl mb-12">
          Our proven step-by-step process ensures a smooth journey from program
          selection to visa approval and successful enrollment abroad.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-indigo-500/40 transition"
            >
              <span className="text-indigo-400 font-bold text-sm">
                {item.step}
              </span>

              <h3 className="text-lg font-semibold mt-3 mb-2">{item.title}</h3>

              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Funnel CTA */}
        <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 px-8 py-8">
          <p className="text-lg font-medium">
            Not sure which program or country suits you best?
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 font-medium"
          >
            Get Free Assessment
          </Link>
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
