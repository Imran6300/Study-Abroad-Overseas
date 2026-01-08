"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe, Users, Award, ArrowRight, CheckCircle } from "lucide-react";

const categoryData = {
  engineering: {
    title: "Engineering & Technology",
    subtitle: "Innovate the future with world-class tech programs",
    heroImage:
      "https://www.ciee.org/sites/default/files/styles/530x324/public/images/2024-05/study-abroad-engineering-student-group.jpg?h=3f4d8c7e&itok=p0tTilNW", // Real engineering students
    gradient: "from-indigo-600 to-blue-700",
    tabs: {
      bachelor: [
        {
          name: "Computer Science",
          unis: "MIT, Stanford, ETH Zurich",
          duration: "4 years",
          fee: "$45K–$65K/year",
        },
        {
          name: "Mechanical Engineering",
          unis: "Imperial College, UC Berkeley",
          duration: "4 years",
          fee: "$40K–$60K/year",
        },
        {
          name: "Electrical Engineering",
          unis: "Caltech, Cambridge",
          duration: "4 years",
          fee: "$50K–$70K/year",
        },
      ],
      master: [
        {
          name: "Data Science & AI",
          unis: "Carnegie Mellon, Oxford, Toronto",
          duration: "1–2 years",
          fee: "$35K–$75K/year",
          popular: true,
        },
        {
          name: "Cybersecurity",
          unis: "Georgia Tech, NYU, Sydney",
          duration: "1–2 years",
          fee: "$30K–$55K/year",
          popular: true,
        },
        {
          name: "Software Engineering",
          unis: "Waterloo, TU Munich",
          duration: "1.5 years",
          fee: "$25K–$50K/year",
        },
      ],
      phd: [
        {
          name: "Artificial Intelligence",
          unis: "Stanford, MIT, DeepMind partners",
          funding: "Fully funded + stipend",
        },
        {
          name: "Robotics",
          unis: "CMU, EPFL Switzerland",
          funding: "Research assistantships",
        },
      ],
    },
  },
  business: {
    title: "Business & Management",
    subtitle: "Lead tomorrow's global enterprises",
    heroImage:
      "https://www.chicagobooth.edu/-/media/project/chicago-booth/mba/academic-experience/the-classroom-experience/chicago-booth-classroom.jpg?cx=0.6&cy=0.33&cw=940&ch=749&hash=974E0B9E5ECFA2783B220A35204F8C70", // Booth classroom
    gradient: "from-amber-600 to-orange-700",
    tabs: {
      bachelor: [
        {
          name: "Business Administration",
          unis: "Wharton, LSE, Singapore",
          duration: "3–4 years",
          fee: "$50K–$70K/year",
        },
        {
          name: "International Business",
          unis: "NYU Stern, Bocconi",
          duration: "4 years",
          fee: "$55K–$75K/year",
        },
      ],
      master: [
        {
          name: "MBA",
          unis: "Harvard, INSEAD, London Business School",
          duration: "1–2 years",
          fee: "$80K–$150K total",
          popular: true,
        },
        {
          name: "Finance & FinTech",
          unis: "Columbia, Chicago Booth",
          duration: "1 year",
          fee: "$70K–$100K/year",
          popular: true,
        },
        {
          name: "Entrepreneurship",
          unis: "Babson, Stanford GSB",
          duration: "1 year",
          fee: "$60K–$90K/year",
        },
      ],
    },
  },
  healthcare: {
    title: "Healthcare & Medicine",
    subtitle: "Transform lives with advanced medical education",
    heroImage:
      "https://cdn-clmkg.nitrocdn.com/jZJIONKWXmglJtuZWYfLRXrdMKSdTsmW/assets/images/optimized/rev-1adbbe8/www.eaglegatecollege.edu/wp-content/uploads/2023/07/shutterstock_1991555321-scaled-1.jpg", // Nursing sim lab
    gradient: "from-emerald-600 to-teal-700",
    tabs: {
      bachelor: [
        {
          name: "Nursing (BSN)",
          unis: "Johns Hopkins, Melbourne, King's College",
          duration: "4 years",
          fee: "$40K–$60K/year",
        },
        {
          name: "Public Health",
          unis: "Harvard, Imperial, Toronto",
          duration: "4 years",
          fee: "$45K–$65K/year",
        },
      ],
      master: [
        {
          name: "Master of Public Health (MPH)",
          unis: "Johns Hopkins, LSHTM, Emory",
          duration: "1–2 years",
          fee: "$50K–$80K/year",
          popular: true,
        },
        {
          name: "Healthcare Management (MHA)",
          unis: "Cornell, Michigan",
          duration: "2 years",
          fee: "$55K–$75K/year",
          popular: true,
        },
        {
          name: "Nursing (MSN)",
          unis: "Yale, Penn",
          duration: "2 years",
          fee: "$45K–$70K/year",
        },
      ],
    },
  },
};

const degreeTabs = ["bachelor", "master", "phd"].filter(
  (tab) => tab in categoryData.engineering.tabs
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
              )
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
          <button
            className={`px-12 py-6 rounded-full text-xl font-bold bg-gradient-to-r ${data.gradient} shadow-2xl hover:scale-105 transition-transform`}
          >
            Get Free Consultation Now
          </button>
        </div>
      </motion.div>
    </section>
  );
}
