"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe, Calendar, DollarSign, GraduationCap, Users, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CourseDetailPage({ program, category }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [openAccordion, setOpenAccordion] = useState(null);

  // Use the REAL program data passed from server page
  // Fallbacks ensure nothing crashes if a field is missing
  const course = {
    name: program?.name || "Program Details",
    tagline: program?.tagline || "World-class education abroad",
    heroImage: program?.heroImage || "https://images.unsplash.com/photo-1555949963-aa79d0ebc8fb?w=1200&q=80",
    overview: program?.overview || "This program offers advanced knowledge and global career opportunities.",
    highlights: program?.highlights || [
      "Industry-aligned curriculum",
      "Hands-on practical training",
      "International exposure",
      "Career guidance & internships",
    ],
    duration: program?.duration || "1–2 years",
    tuition: program?.tuition || "USD 25,000 – 60,000 per year",
    scholarships: program?.scholarships || "Up to 100% available",
    entryRequirements: program?.entryRequirements || [
      "Bachelor’s degree in relevant field",
      "English proficiency (IELTS 6.5+ / TOEFL 90+)",
      "Strong academic background",
    ],
    topUniversities: program?.topUniversities || [
      { name: "Top University 1", location: "USA", ranking: "World Top 10" },
      { name: "Top University 2", location: "UK", ranking: "Top 5" },
    ],
    careerOutcomes: program?.careerOutcomes || [
      "Relevant Job Role 1",
      "Relevant Job Role 2",
      "Average salary: USD 90,000+",
    ],
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "requirements", label: "Entry Requirements" },
    { id: "universities", label: "Top Universities" },
    { id: "careers", label: "Career Outcomes" },
  ];

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#0b0f1a] text-white">
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={course.heroImage}
            alt={course.name}
            className="w-full h-full object-cover brightness-[0.45] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-5 py-2 mb-6 text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-indigo-600/30 to-blue-600/30 backdrop-blur-lg rounded-full border border-indigo-500/30">
              {category?.toUpperCase() || "PROGRAM"} • Master's Program
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-indigo-200 to-blue-300 bg-clip-text text-transparent">
              {course.name}
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-200/90 max-w-4xl mx-auto font-light">
              {course.tagline}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="relative z-10 -mt-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Calendar, label: "Duration", value: course.duration },
            { icon: DollarSign, label: "Tuition", value: course.tuition.split("–")[0]?.trim() + " +" || "Varies" },
            { icon: Award, label: "Scholarships", value: course.scholarships || "Up to 100%" },
            { icon: Users, label: "Career Salary", value: "USD 90k+" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white/10 text-gray-300 hover:bg-white/15 backdrop-blur-sm"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-12">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold mb-6 text-indigo-300">Program Overview</h2>
                  <p className="text-lg leading-relaxed text-gray-200">{course.overview}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Award className="text-indigo-400" /> Key Highlights
                    </h3>
                    <ul className="space-y-4 text-gray-200">
                      {course.highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <GraduationCap className="text-indigo-400" /> Career Prospects
                    </h3>
                    <ul className="space-y-4 text-gray-200">
                      {course.careerOutcomes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8 text-indigo-300">Entry Requirements</h2>
                <div className="space-y-4">
                  {course.entryRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 cursor-pointer"
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-medium">{req.split(" (")[0] || req}</p>
                        <ChevronDown
                          className={`w-6 h-6 transition-transform ${
                            openAccordion === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {req.includes("(") && openAccordion === index && (
                        <p className="mt-4 text-gray-300">{req}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "universities" && (
              <div className="space-y-12">
                <h2 className="text-3xl font-bold mb-8 text-indigo-300">Top Universities Offering This Program</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course.topUniversities.map((uni, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-7 border border-white/10 hover:border-indigo-500/50 transition-all group"
                    >
                      <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">
                        {uni.name}
                      </h3>
                      <div className="space-y-2 text-gray-300">
                        <p className="flex items-center gap-2">
                          <Globe size={18} /> {uni.location}
                        </p>
                        <p className="flex items-center gap-2">
                          <Award size={18} className="text-yellow-400" /> {uni.ranking}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "careers" && (
              <div className="space-y-12">
                <h2 className="text-3xl font-bold mb-8 text-indigo-300">Career Outcomes</h2>
                <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/10 backdrop-blur-xl rounded-3xl p-10 border border-indigo-500/20">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Popular Job Roles</h3>
                      <ul className="space-y-4">
                        {course.careerOutcomes.slice(0, 4).map((role, i) => (
                          <li key={i} className="flex items-center gap-3 text-lg">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            {role}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Salary Expectations</h3>
                      <p className="text-4xl font-bold text-emerald-400 mb-2">USD 90,000+</p>
                      <p className="text-gray-300">Average starting salary (US/Europe)</p>
                      <p className="mt-6 text-gray-400 text-sm">
                        Highest salaries in USA, UK, Switzerland, Australia, Singapore
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your {course.name} Journey?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Get personalized university recommendations, scholarship guidance, application support — completely free.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg rounded-full shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-600/50 hover:scale-[1.03] transition-all duration-300"
          >
            Get Free Personalized Consultation
            <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}