"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe, Users, Award, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { categoryData } from "@/data/coursescategory";
import {universitiesByCategory} from "@/data/universitybycatogery"

const degreeTabs = ["bachelor", "master", "phd"].filter(
  (tab) => tab in categoryData.engineering.tabs,
); // Dynamic but safe

export default function CourseCategory() {
  const params = useParams();
  const category = params?.category?.toString().toLowerCase();
  const data = categoryData[category];

  const [activeTab, setActiveTab] = useState("master"); // Most popular default

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
      </div>
    );
  }

  const programs = data.tabs[activeTab] || [];
  const universities = universitiesByCategory?.[category]?.[activeTab] || [];

  return (
    <section className="min-h-screen bg-[#0b0f1a] text-white">
      {/* HERO WITH REAL IMAGE */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={data.heroImage}
            alt={data.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/70 to-[#0b0f1a]/30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`inline-block px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r ${data.gradient} shadow-2xl`}
          >
            Study Abroad Excellence
          </motion.span>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight">
            {data.title}
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            {data.subtitle}
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" /> 50+ Countries
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" /> 10,000+ Students Placed
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5" /> Scholarships up to 100%
            </div>
          </div>
        </motion.div>
      </div>

      {/* TABS & PROGRAMS */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {["bachelor", "master", "phd"].map(
            (tab) =>
              data.tabs[tab] && (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 rounded-2xl font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? `bg-gradient-to-r ${data.gradient} text-white shadow-xl`
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {tab === "phd" ? "PhD & Research" : tab + "'s"}
                </button>
              ),
          )}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {programs.map((prog, i) => (
            <motion.div
              key={prog.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all hover:shadow-2xl"
            >
              {prog.popular && (
                <span className="inline-block px-4 py-1 text-xs font-bold rounded-full bg-yellow-500/20 text-yellow-300 mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                {prog.name}
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <strong>Top Universities:</strong> {prog.unis}
                </p>
                <p>
                  <strong>Duration:</strong> {prog.duration || prog.funding}
                </p>
                {prog.fee && (
                  <p>
                    <strong>Avg. Fees:</strong> {prog.fee}
                  </p>
                )}
              </div>
              <button className="mt-8 flex items-center gap-3 text-indigo-400 font-semibold group-hover:gap-5 transition-all">
                Explore Programs <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* UNIVERSITIES OFFERING THIS PROGRAM */}
      {universities.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Universities Offering This Program
          </motion.h2>

          <p className="text-gray-400 max-w-2xl mb-12">
            Study at globally ranked universities known for academic excellence,
            research impact, and international student success.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {universities.map((uni, index) => (
              <motion.div
                key={uni.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Link
                  href={`/universities/${uni.slug}`}
                  className="group flex h-full min-h-[280px] flex-col rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-white/30 hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 line-clamp-2">
                    {uni.name}
                  </h3>

                  {/* Meta Info */}
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-center gap-2">
                      <Globe className="w-4 h-4" /> {uni.country}
                    </p>
                    <p className="flex items-center gap-2">
                      <Award className="w-4 h-4" /> {uni.ranking}
                    </p>
                  </div>

                  {/* CTA pushed to bottom */}
                  <span className="mt-auto pt-6 inline-flex items-center gap-3 text-indigo-400 font-semibold group-hover:gap-4 transition-all">
                    Visit University <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-32 pb-20 text-center px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Global Education Journey Starts Here
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Free counseling • University shortlisting • Visa guidance •
            Scholarship support
          </p>
          <Link
            href={"/assessment"}
            className={`px-12 py-6 rounded-full text-xl font-bold bg-gradient-to-r ${data.gradient} shadow-2xl hover:scale-105 transition-transform`}
          >
            Get Free Consultation Now
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
