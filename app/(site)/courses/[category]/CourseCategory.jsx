"use client";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe, Users, Award, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { categoryData } from "@/data/coursescategory";
import { universitiesByCategory } from "@/data/universitybycatogery";

export default function CourseCategory() {
  const params = useParams();
  const category = params?.category?.toString().toLowerCase();
  const data = categoryData[category];
  const [activeTab, setActiveTab] = useState("master");

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white">
        <h1 className="text-3xl sm:text-4xl font-bold text-center px-5">
          Category Not Found
        </h1>
      </div>
    );
  }

  const programs = data.tabs[activeTab] || [];
  const universities = universitiesByCategory?.[category]?.[activeTab] || [];
  const gradient = data.gradient || "from-blue-600 via-indigo-600 to-purple-600";

  return (
    <section className="bg-[#0a0e17] text-white overflow-x-hidden">
      {/* HERO - Better mobile height + readable text */}
<div
  className="
    relative 
    min-h-[55vh] xs:min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-screen 
    flex items-center justify-center 
    overflow-hidden
    max-sm:mt-12               {/* ← only on mobile (< sm breakpoint) */}
  "
>
  <div className="absolute inset-0">
    <img
      src={data.heroImage}
      alt={data.title}
      className="
        w-full h-full 
        object-cover 
        brightness-[0.6] sm:brightness-[0.65] 
        /* optional: remove scale on very small screens if it feels weird */
        scale-105 sm:scale-105
        transition-transform duration-[20s] 
      "
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/75 to-[#0a0e17] backdrop-blur-[1px]" />
  </div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.1, ease: "easeOut" }}
    className="relative z-10 text-center px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 max-w-5xl mx-auto"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25 }}
      className="inline-block mb-4 xs:mb-5 sm:mb-6 px-4 xs:px-5 py-1.5 xs:py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/10 backdrop-blur-lg border border-white/20 shadow-md"
    >
      <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
        Study Abroad Excellence
      </span>
    </motion.div>

<div className="overflow-visible">
  <h1
    className="
      inline-block
      text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
      font-extrabold tracking-tight
      leading-tight
      pb-[0.15em]
      bg-gradient-to-br from-white via-gray-200 to-gray-400
      bg-clip-text text-transparent
    "
  >
    {data.title}
  </h1>
</div>


    <p className="
      mt-4 xs:mt-5 sm:mt-6 
      text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl 
      text-gray-200/90 
      max-w-3xl mx-auto font-light 
      px-1 xs:px-2 sm:px-0
      line-clamp-3 sm:line-clamp-none
    ">
      {data.subtitle}
    </p>

    <div className="
      mt-6 xs:mt-7 sm:mt-8 md:mt-10 
      flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 
      text-xs xs:text-sm
    ">
      <div className="flex items-center gap-1.5 xs:gap-2 bg-white/7 px-3.5 xs:px-4 py-1.5 xs:py-2 rounded-full backdrop-blur-sm border border-white/10">
        <Globe className="w-4 h-4 xs:w-5 xs:h-5 text-blue-400" /> 50+ Countries
      </div>
      <div className="flex items-center gap-1.5 xs:gap-2 bg-white/7 px-3.5 xs:px-4 py-1.5 xs:py-2 rounded-full backdrop-blur-sm border border-white/10">
        <Users className="w-4 h-4 xs:w-5 xs:h-5 text-green-400" /> 10,000+ Placed
      </div>
      <div className="flex items-center gap-1.5 xs:gap-2 bg-white/7 px-3.5 xs:px-4 py-1.5 xs:py-2 rounded-full backdrop-blur-sm border border-white/10">
        <Award className="w-4 h-4 xs:w-5 xs:h-5 text-yellow-400" /> Up to 100% Scholarships
      </div>
    </div>
  </motion.div>
</div>

      {/* TABS - Better spacing + mobile stacking */}
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 -mt-12 sm:-mt-20 lg:-mt-24 relative z-20">
        <div className="flex justify-center gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 mb-10 sm:mb-14 lg:mb-16 flex-wrap">
          {["bachelor", "master", "phd"].map(
            (tab) =>
              data.tabs[tab] && (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    relative px-5 xs:px-6 sm:px-8 md:px-9 py-3 sm:py-3.5 md:py-4 
                    rounded-full font-semibold text-sm sm:text-base md:text-lg 
                    transition-all duration-300 flex-shrink-0
${
  activeTab === tab
    ? `
        text-white 
        bg-gradient-to-r ${gradient}
        border-2 border-white
        shadow-xl shadow-black/40
      `
    : `
        text-gray-300 
        hover:text-white 
        bg-white/6 hover:bg-white/12 
        backdrop-blur-md 
        border border-white/10
      `
}

                  `}
                >
                  {tab === "phd"
                    ? "PhD & Research"
                    : tab.charAt(0).toUpperCase() + tab.slice(1) + "'s"}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} opacity-20 -z-10`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
          >
            {programs.map((prog, i) => (
              <motion.div
                key={prog.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.6 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 border border-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-black/40 transition-all duration-400 hover:-translate-y-1.5 sm:hover:-translate-y-2"
              >
                {prog.popular && (
                  <span className="inline-block px-3.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-600/30 to-amber-600/30 text-yellow-100 mb-3 sm:mb-4 backdrop-blur-sm border border-yellow-500/20">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                  {prog.name}
                </h3>
                <div className="space-y-2.5 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                  <p>
                    <strong className="text-gray-200">Top Universities:</strong> {prog.unis}
                  </p>
                  <p>
                    <strong className="text-gray-200">Duration:</strong>{" "}
                    {prog.duration || prog.funding}
                  </p>
                  {prog.fee && (
                    <p>
                      <strong className="text-gray-200">Avg. Fees:</strong> {prog.fee}
                    </p>
                  )}
                </div>
                <div className="mt-6 sm:mt-7 flex items-center gap-2.5 sm:gap-3 text-indigo-400 font-semibold group-hover:gap-4 transition-all duration-300 text-sm sm:text-base">
                  <Link href="/programs">Explore Programs</Link>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* UNIVERSITIES section – similar padding & text size adjustments */}
      {universities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 py-16 sm:py-20 lg:py-32">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 text-center sm:text-left"
          >
            Top Universities Offering This Program
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-3xl mb-10 sm:mb-12 lg:mb-16 text-center sm:text-left mx-auto sm:mx-0">
            Join globally ranked institutions known for cutting-edge research, vibrant campuses, and outstanding support for international students.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {universities.map((uni, index) => (
              <motion.div
                key={uni.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.7 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/universities/${uni.slug}`}
                  className="group flex flex-col h-full rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-6 lg:p-8 hover:border-white/30 hover:shadow-2xl hover:shadow-black/30 transition-all duration-400 hover:-translate-y-1.5 sm:hover:-translate-y-2"
                >
                  <div className="h-14 sm:h-16 mb-4 sm:mb-5 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <img src={uni.logo} alt={uni.name} className="h-8 sm:h-10 opacity-90 max-w-[80%]" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                    {uni.name}
                  </h3>
                  <div className="space-y-2.5 sm:space-y-3 text-gray-300 text-sm sm:text-base mt-auto">
                    <p className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" /> {uni.country}
                    </p>
                    <p className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" /> {uni.ranking}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                      <Star size={16} />
                      <span className="text-gray-400 ml-1.5 text-sm">4.8</span>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 inline-flex items-center gap-2.5 sm:gap-3 text-indigo-400 font-semibold group-hover:gap-4 transition-all duration-300 text-sm sm:text-base">
                    Visit University <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA - adjusted for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-32 text-center px-4 xs:px-5 sm:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 leading-tight">
            Launch Your Global Academic Journey Today
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Personalized counseling • University shortlisting • Application support • Visa & scholarship guidance — all 100% free.
          </p>
          <Link
            href="/assessment"
            className={`
              inline-flex items-center justify-center
              px-8 sm:px-10 lg:px-14 py-4 sm:py-5 lg:py-6
              rounded-full text-base sm:text-lg lg:text-xl font-bold
              text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
              shadow-xl shadow-emerald-500/30
              hover:shadow-2xl hover:shadow-emerald-600/50
              hover:scale-105 active:scale-95
              transition-all duration-300 ease-out
              border border-emerald-400/30
            `}
          >
            Get Free Personalized Consultation Now
            <ArrowRight className="ml-2.5 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}