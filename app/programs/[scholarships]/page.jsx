"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import {
  FaGlobeAmericas,
  FaUserGraduate,
  FaRocket,
  FaArrowRight,
  FaShieldAlt,
  FaLightbulb,
} from "react-icons/fa";

/* ================= COLOR PALETTE ================= */
const Palette = {
  royalBlue: "#3B82F6",
  limeGreen: "#10B981",
  coral: "#F43F5E",
  softYellow: "#FEF08A",
  lightGray: "#E5E7EB",
  slate: "#475569",
  deepBg: "#0F172A",
};

/* ================= MAIN PAGE ================= */
export default function Scholarships() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <main
      ref={containerRef}
      className="relative overflow-hidden font-sans"
      style={{ backgroundColor: Palette.deepBg, color: Palette.lightGray }}
    >
      {/* Fixed Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{ scaleX, backgroundColor: Palette.coral }}
      />

      {/* ================== 1. HERO ================== */}
      <section className="relative min-h-screen flex items-center justify-center px-5 sm:px-6 py-16 sm:py-24">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] sm:w-[160vw] lg:w-[140vw] h-[200vw] sm:h-[160vw] lg:h-[140vw] border border-white/5 rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 border backdrop-blur-sm text-sm sm:text-base"
              style={{
                borderColor: `${Palette.royalBlue}50`,
                backgroundColor: `${Palette.royalBlue}15`,
              }}
            >
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: Palette.limeGreen }}
                />
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ backgroundColor: Palette.limeGreen }}
                />
              </span>
              <span className="font-extrabold uppercase tracking-widest text-white whitespace-nowrap">
                2026 Intake – Active
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tighter text-white">
              DECODE THE
              <br />
              <span style={{ color: Palette.royalBlue }}>FUNDING GALAXY</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl font-light mb-10 max-w-xl leading-relaxed opacity-90">
              Turn your academic potential into full or partial funding reality
              with AI-powered matching + expert strategy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                href="/apply"
                className="group relative px-8 py-5 sm:px-10 sm:py-6 bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 shadow-2xl shadow-blue-600/30 text-center font-bold text-lg sm:text-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 text-black">
                  Free Assessment
                  <FaRocket className="group-hover:rotate-12 transition-transform" />
                </span>
              </Link>

              <Link
                href="/consult"
                className="px-8 py-5 sm:px-10 sm:py-6 border-2 rounded-2xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105"
                style={{ borderColor: Palette.slate, color: Palette.lightGray }}
              >
                Strategy Call
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual - hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3 }}
            className="relative mt-12 lg:mt-0 hidden lg:block"
          >
            <div
              className="
      relative w-full aspect-square max-w-[500px] mx-auto
      rounded-[50px]
      p-4 sm:p-6
      overflow-hidden
      backdrop-blur-xl
      bg-white/5
      border
      shadow-[0_0_80px_rgba(59,130,246,0.25)]
    "
              style={{ borderColor: `${Palette.royalBlue}40` }}
            >
              {/* ambient glow */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-500/20 opacity-60" />

              {/* image wrapper */}
              <div className="relative w-full h-full rounded-[40px] overflow-hidden z-10">
                <img
                  src="/scholership/scholershipimage.jpg"
                  alt="International students celebrating scholarship success"
                  className="
          relative
          w-full h-full
          object-contain
          object-center
          grayscale
          hover:grayscale-0
          transition-all
          duration-1000
          rounded-lg
          rounded-full
        "
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================== 2. BENTO GRID ================== */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-20 sm:py-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <BentoTile
            span="sm:col-span-2 lg:col-span-2 lg:row-span-2"
            icon={<FaGlobeAmericas />}
            title="Global Reach"
            desc="12,000+ scholarships & grants across 6 continents"
            color={Palette.royalBlue}
          />
          <BentoTile
            span=""
            icon={<FaShieldAlt />}
            title="Near Perfect Compliance"
            desc="98.4% zero-rejection documentation success"
            color={Palette.limeGreen}
          />
          <BentoTile
            span=""
            icon={<FaLightbulb />}
            title="AI-Powered Matching"
            desc="Predictive algorithm finds hidden opportunities"
            color={Palette.coral}
          />
          <BentoTile
            span=""
            icon={<FaUserGraduate />}
            title="Elite Mentorship"
            desc="Ivy League & Oxbridge alumni advisors"
            color={Palette.softYellow}
          />
        </div>
      </section>

      {/* ================== 3. PROCESS PATHWAY ================== */}
      <section className="py-20 sm:py-32 bg-[#0F172A]/50 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-12 sm:mb-20 tracking-tighter text-white">
            OUR <span style={{ color: Palette.limeGreen }}>PRECISION</span>{" "}
            PIPELINE
          </h2>

          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50" />

            <div className="space-y-16 sm:space-y-24 md:space-y-32">
              <Step
                num="01"
                title="Profile Deep Scan"
                desc="AI + human analysis uncovers hidden eligibility triggers"
                align="left"
              />
              <Step
                num="02"
                title="High-Probability Selection"
                desc="Top 5–8 scholarships + realistic 90-day execution plan"
                align="right"
              />
              <Step
                num="03"
                title="Application Mastery"
                desc="Professional SOP, essays & LOR optimization"
                align="left"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================== 4. CATEGORIES ================== */}
      <section className="py-20 sm:py-32 bg-[#0F172A]/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-12 sm:mb-16 text-white">
            SCHOLARSHIP{" "}
            <span style={{ color: Palette.royalBlue }}>CATEGORIES</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Merit-Based Excellence",
              "Need-Based Financial Aid",
              "Country & Region Specific",
              "Research & STEM Fellowships",
              "Undergraduate Awards",
              "Postgraduate & PhD Grants",
              "Sport & Arts Scholarships",
              "Diversity & Inclusion Funds",
            ].map((title, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-2xl bg-[#172033]/70 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all text-center"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================== 5. RESULTS STATS ================== */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-12 sm:mb-16 text-white">
            PROVEN <span style={{ color: Palette.coral }}>RESULTS</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
            {[
              ["₹120 Cr+", "Total Funding Secured"],
              ["5,000+", "Students Funded"],
              ["96%+", "Success Rate"],
              ["45+", "Countries Covered"],
            ].map(([value, label], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 sm:mb-3">
                  {value}
                </div>
                <div className="text-base sm:text-lg opacity-80">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================== FINAL CTA ================== */}
      <section className="relative py-24 sm:py-40 md:py-48 text-center overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/20 to-blue-600/30 rounded-full blur-3xl w-[120%] h-[120%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 sm:mb-10 text-white tracking-tighter leading-tight">
            YOUR FUTURE
            <br />
            AWAITS – FULLY FUNDED
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 opacity-90 max-w-3xl mx-auto">
            Limited 2026 spots. Start your free assessment today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-8">
            <Link
              href="/apply"
              className="group relative px-10 sm:px-14 py-6 sm:py-8 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 shadow-2xl shadow-blue-700/50 font-bold text-lg sm:text-2xl bg-white"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 text-black">
                Free Assessment
                <FaRocket className="group-hover:rotate-12 transition-transform" />
              </span>
            </Link>

            <Link
              href="/consult"
              className="px-10 sm:px-14 py-6 sm:py-8 border-2 rounded-full font-bold text-lg sm:text-2xl transition-all duration-500 hover:scale-105 hover:bg-white/10"
              style={{
                borderColor: Palette.limeGreen,
                color: Palette.limeGreen,
              }}
            >
              Strategy Call
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= SUB-COMPONENTS ================= */
function BentoTile({ span, icon, title, desc, color }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9 }}
      className={`${span} group relative p-6 sm:p-8 md:p-10 rounded-3xl border border-white/10 bg-[#172033]/80 backdrop-blur-sm hover:bg-[#1E293B] transition-all duration-500 cursor-default overflow-hidden`}
    >
      <div
        className="absolute top-0 left-0 w-1.5 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-600"
        style={{ backgroundColor: color }}
      />
      <div
        className="text-5xl sm:text-6xl mb-4 sm:mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500"
        style={{ color }}
      >
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-white tracking-tight">
        {title}
      </h3>
      <p className="text-base sm:text-lg opacity-80 leading-relaxed">{desc}</p>
      <div
        className="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 text-8xl sm:text-9xl opacity-5 transition-transform group-hover:rotate-12 duration-700 pointer-events-none"
        style={{ color }}
      >
        {icon}
      </div>
    </motion.div>
  );
}

function Step({ num, title, desc, align }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: align === "left" ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`relative flex items-center ${
        align === "left"
          ? "justify-start pr-8 md:pr-12 lg:pr-20"
          : "justify-start pl-8 md:pl-12 lg:pl-20 md:justify-end"
      }`}
    >
      <div
        className={`flex flex-col ${
          align === "left" ? "items-start" : "items-start md:items-end"
        } max-w-md lg:max-w-xl`}
      >
        <div
          className="text-7xl sm:text-8xl md:text-9xl font-black mb-4 sm:mb-6 italic opacity-15 select-none"
          style={{ WebkitTextStroke: "1.5px white", color: "transparent" }}
        >
          {num}
        </div>
        <h4 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 text-white uppercase tracking-tighter">
          {title}
        </h4>
        <p className="text-base sm:text-lg md:text-xl opacity-85 leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="absolute left-4 md:left-1/2 top-10 md:top-12 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white bg-[#0F172A] z-20 shadow-[0_0_20px_rgba(59,130,246,0.7)]" />
    </motion.div>
  );
}
