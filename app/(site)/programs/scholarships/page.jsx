"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import MessageBox from "@/components/ui/MessageBox"; // adjust path

import {
  FaGlobeAmericas,
  FaUserGraduate,
  FaRocket,
  FaShieldAlt,
  FaLightbulb,
} from "react-icons/fa";

const Palette = {
  royalBlue: "#3B82F6",
  limeGreen: "#10B981",
  coral: "#F43F5E",
  softYellow: "#FEF08A",
  lightGray: "#E5E7EB",
  slate: "#475569",
  deepBg: "#0F172A",
};

export default function Scholarships() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentLevel: "",
    intake: "2026",
    preferredCountry: "",
    score: "",
    fundingGoal: "",
  });
  const [loading, setLoading] = useState(false);

  const [msg, setMsg] = useState({ status: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/scholarships`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 🔥 IMPORTANT for auth
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMsg({
          status: "error",
          message: data.message || "Something went wrong",
        });
        setLoading(false);
        return;
      }

      setMsg({
        status: "success",
        message: "Form submitted successfully 🚀",
      });

      // optional reset
      setFormData({
        fullName: "",
        email: "",
        currentLevel: "",
        intake: "2026",
        preferredCountry: "",
        score: "",
        fundingGoal: "",
      });
    } catch (error) {
      setMsg({
        status: "error",
        message: "Server error, try again later",
      });
    } finally {
      setLoading(false); // 🔥 ALWAYS RUNS
    }
  };

  useEffect(() => {
    if (msg.status) {
      const timer = setTimeout(() => {
        setMsg({ status: "", message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [msg]);

  return (
    <main
      ref={containerRef}
      className="relative mt-10 sm:mt-0 overflow-hidden font-sans"
      style={{ backgroundColor: Palette.deepBg, color: Palette.lightGray }}
    >
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{ scaleX, backgroundColor: Palette.coral }}
      />
      {/* HERO + LEAD FORM */}
      <section className="relative min-h-screen flex items-center justify-center px-5 sm:px-6 py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-32 -top-32 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          {/* Copy side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
          >
            <div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 border backdrop-blur-sm text-xs sm:text-sm md:text-base"
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
              <span className="font-semibold tracking-widest text-white uppercase">
                2026 Intake – Scholarships Still Open
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight text-white">
              Discover{" "}
              <span style={{ color: Palette.royalBlue }}>
                Scholarship Opportunities for
              </span>{" "}
              Study Abroad
            </h1>

            <p className="text-base sm:text-lg md:text-xl mb-6 max-w-xl opacity-90">
              We map your profile to high-probability global scholarships and
              build a done-with-you application plan so you stop guessing and
              start discovering scholarship opportunities.
            </p>

            {/* Micro proof row */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-xs sm:text-sm opacity-80">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span>Scholarship opportunities explored</span>
              </div>
              <span className="h-4 w-px bg-white/25" />
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span>5,000+ students supported</span>
              </div>
              <span className="h-4 w-px bg-white/25" />
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-pink-400" />
                <span>45+ study destinations</span>
              </div>
            </div>

            {/* Primary CTAs for non-form users */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <Link
                href="/assessment"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-white rounded-2xl transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-blue-500/30 text-sm sm:text-base font-semibold text-black"
              >
                Start Free Scholarship Check
                <FaRocket className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                style={{ borderColor: Palette.slate }}
              >
                Book 15-min Strategy Call
              </Link>
            </div>

            <p className="text-xs sm:text-sm opacity-70">
              Takes under 60 seconds · No payment required · Get a clear
              scholarship probability snapshot for your profile
            </p>
          </motion.div>

          {/* Lead form card */}
          <motion.div
            id="lead-form"
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-blue-500/70 via-emerald-400/60 to-pink-500/70 opacity-70 blur-xl" />
            <div className="relative rounded-3xl bg-[#020617]/95 border border-white/10 p-6 sm:p-7 lg:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Free Scholarship Eligibility Check
                  </h2>
                  <p className="text-xs sm:text-sm opacity-75 mt-1">
                    Answer a few questions and get a tailored scholarship
                    roadmap in your inbox.
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs uppercase tracking-widest opacity-60">
                    Scholarship Opportunities Available
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/70">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/60 placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/70">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/60 placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/70">
                      Current level of study
                    </label>
                    <select
                      name="currentLevel"
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/60"
                      required
                      value={formData.currentLevel}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      <option value="12th">Grade 12 / Junior College</option>
                      <option value="bachelors">Bachelor&apos;s ongoing</option>
                      <option value="completed_bachelors">
                        Completed Bachelor&apos;s
                      </option>
                      <option value="masters">Master&apos;s ongoing</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/70">
                      Target intake
                    </label>
                    <select
                      name="intake"
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/60"
                      value={formData.intake}
                      onChange={handleChange}
                      required
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="not_sure">Not sure</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/70">
                      Preferred countries
                    </label>
                    <select
                      name="preferredCountry"
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/60"
                      value={formData.preferredCountry}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      <option value="usa_uk">USA / UK</option>
                      <option value="canada_europe">Canada / Europe</option>
                      <option value="australia_nz">
                        Australia / New Zealand
                      </option>
                      <option value="mixed">Open to multiple</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/70">
                      Approx. CGPA / % score
                    </label>
                    <input
                      type="text"
                      name="score"
                      placeholder="e.g. 8.4 CGPA / 86%"
                      value={formData.score}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/60 placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-white/70">
                    What scholarship support are you looking for?
                  </label>
                  <select
                    name="fundingGoal"
                    className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/60"
                    value={formData.fundingGoal}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select option
                    </option>
                    <option value="tuition">Major part of tuition fee</option>
                    <option value="partial">
                      Tuition + partial living costs
                    </option>
                    <option value="full">Near full-ride funding</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white text-black text-sm sm:text-base font-semibold shadow-lg shadow-blue-500/40 hover:scale-[1.02] hover:shadow-blue-500/60 transition-all"
                >
                  {loading
                    ? "Submitting..."
                    : "Get My Scholarship Possibility Report"}
                  <FaRocket className="text-sm sm:text-base" />
                </button>

                <p className="text-[10px] sm:text-xs text-white/50 mt-2">
                  By submitting, you agree to be contacted via WhatsApp / email
                  with your report and scholarship suggestions. No spam,
                  unsubscribe anytime.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-5 py-4 text-xs text-white/60 border-y border-white/10">
        Disclaimer: Khizar Overseas is an education consulting platform. We do
        not provide loans, lend money, distribute scholarships, guarantee
        funding, or act as a financial institution. Scholarships, grants, and
        financial aid are offered solely by universities, governments, and
        third-party organizations. We only assist students in identifying and
        applying for relevant opportunities.
      </div>
      {/* SOCIAL PROOF STRIP */}
      <section className="py-6 bg-black/40 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 opacity-80">
            <FaUserGraduate className="text-emerald-400" />
            <span>Trusted by 5,000+ Indian students</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 opacity-70">
            <span>Featured admits to:</span>
            <div className="flex flex-wrap gap-3 text-[11px] sm:text-xs">
              <span className="rounded-full border border-white/10 px-2.5 py-1">
                Ivy League
              </span>
              <span className="rounded-full border border-white/10 px-2.5 py-1">
                Oxbridge
              </span>
              <span className="rounded-full border border-white/10 px-2.5 py-1">
                Top 100 QS
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* BENTO VALUE SECTION */}
      <BentoSection />
      {/* PROCESS + OUTCOMES */}
      <section className="py-20 sm:py-28 bg-[#020617]/70 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 grid lg:grid-cols-[1.4fr_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight text-white">
              Our <span style={{ color: Palette.limeGreen }}>3-step</span>{" "}
              Scholarship Engine
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-8 opacity-85 max-w-xl">
              We combine AI-matching with human admissions expertise to find
              scholarships you actually qualify for and guide you until
              submissions are in.
            </p>

            <div className="space-y-10">
              <ProcessStep
                num="01"
                title="Profile Deep Scan"
                desc="We analyse your academics, test scores, activities, finances and target countries to unlock all possible eligibility triggers you can leverage."
              />
              <ProcessStep
                num="02"
                title="High-Probability Shortlist"
                desc="You receive a curated list of 5–10 scholarships with timelines, competitiveness, and a realistic 90-day execution plan."
              />
              <ProcessStep
                num="03"
                title="Application Mastery"
                desc="We help sharpen SOPs, essays, and LOR talking points so your story stands out and aligns with each scholarship’s selection criteria."
              />
            </div>
          </div>

          {/* Outcomes card */}
          <div className="rounded-3xl bg-[#020617]/90 border border-white/10 p-6 sm:p-7 lg:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              What you walk away with
            </h3>
            <ul className="space-y-3 text-sm sm:text-base opacity-90">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  A personalised scholarship shortlist that fits your profile
                  and budget reality.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span>
                  A month-by-month execution plan with clear deadlines and
                  action items.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400" />
                <span>
                  Calibrated essay and SOP direction so you avoid generic,
                  rejected pitches.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                <span>
                  A realistic scholarship opportunity assessment so you know how
                  much to arrange beyond scholarships.
                </span>
              </li>
            </ul>

            <div className="mt-6 border-t border-white/10 pt-4 text-xs sm:text-sm flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="opacity-70">Avg. call-to-offer time</span>
                <span className="font-semibold text-emerald-400">
                  6–12 weeks
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="opacity-70">Student satisfaction</span>
                <span className="font-semibold text-blue-400">4.8 / 5</span>
              </div>
            </div>

            <Link
              href="#lead-form"
              className="mt-5 inline-flex items-center justify-center w-full px-4 py-3.5 rounded-2xl bg-white text-black text-sm sm:text-base font-semibold hover:scale-[1.02] transition-transform"
            >
              See my scholarship possibilities
            </Link>
          </div>
        </div>
      </section>
      {/* CATEGORIES GRID */}
      <section className="py-20 sm:py-28 bg-[#020617]/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
                Scholarships we regularly work on
              </h2>
              <p className="text-sm sm:text-base opacity-80 max-w-xl">
                From full-ride national schemes to university-specific grants,
                we help you layer multiple opportunities instead of betting on
                just one.
              </p>
            </div>
            <p className="text-xs sm:text-sm opacity-70 max-w-sm">
              Shortlisting is always profile-specific. You get a mix of safer,
              moderate and ambitious options—never random lists pulled from
              Google.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              "Merit-Based Excellence Awards",
              "Need-Based Tuition Support",
              "Government & Embassy Scholarships",
              "Country / Region-Specific Grants",
              "STEM & Research Fellowships",
              "Undergraduate Entry Awards",
              "Postgraduate & MBA Scholarships",
              "Diversity, Women-in-STEM & More",
            ].map((title, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-2xl bg-[#020617]/80 border border-white/8 hover:border-white/35 hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm opacity-65">
                  Included with guidance on eligibility, deadlines, and how to
                  position your profile.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* RESULTS / STATS + TESTIMONIAL CARD */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                Proven results, not guesses
              </h2>
              <p className="text-sm sm:text-base opacity-80 max-w-lg">
                We&apos;ve helped students move from &quot;I don&apos;t know if
                I can afford this&quot; to landing offers they once thought were
                out of reach.
              </p>
            </div>
            <p className="text-xs sm:text-sm opacity-70 max-w-sm">
              Data is based on students who completed the full scholarship plan
              and submitted all recommended applications on time.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-14">
            {[
              ["5,000+", "Students guided"],
              ["96%+", "Plan completion rate"],
              ["45+", "Countries covered"],
            ].map(([value, label], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1.5">
                  {value}
                </div>
                <div className="text-xs sm:text-sm opacity-75">{label}</div>
              </motion.div>
            ))}
          </div>

          {/* Objection buster row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-xs sm:text-sm">
            <div className="rounded-2xl bg-[#020617]/80 border border-white/10 p-4 sm:p-5">
              <h3 className="font-semibold mb-1.5">“My profile is average.”</h3>
              <p className="opacity-75">
                Most funded students didn&apos;t start with perfect profiles.
                The win is in targeting the right scholarships and telling your
                story sharply.
              </p>
            </div>
            <div className="rounded-2xl bg-[#020617]/80 border border-white/10 p-4 sm:p-5">
              <h3 className="font-semibold mb-1.5">
                “Scholarships are too competitive.”
              </h3>
              <p className="opacity-75">
                We focus on a mix of highly competitive and lesser-known options
                so you&apos;re not chasing only the 1% acceptance programs.
              </p>
            </div>
            <div className="rounded-2xl bg-[#020617]/80 border border-white/10 p-4 sm:p-5">
              <h3 className="font-semibold mb-1.5">
                “I don&apos;t have time to research.”
              </h3>
              <p className="opacity-75">
                Your roadmap comes with clear weekly tasks so even with a busy
                schedule you know exactly what to do each week.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* FINAL CTA */}
      <section className="relative py-24 sm:py-32 md:py-40 text-center overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.16, 0.35, 0.16] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/35 via-purple-600/25 to-blue-600/35 rounded-full blur-3xl w-[130%] h-[130%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-5 sm:mb-7 text-white tracking-tight leading-tight">
            Explore scholarship opportunities for your{" "}
            <span style={{ color: Palette.royalBlue }}>admission</span> offer
          </h2>

          <p className="text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 opacity-90 max-w-2xl mx-auto">
            2026 intakes are already filling up. Start with a free, no-pressure
            scholarship check and see which scholarship opportunities may be
            available for you
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link
              href="/assessment"
              className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.04] shadow-2xl shadow-blue-700/50 font-semibold text-sm sm:text-lg bg-white text-black"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Start Free Scholarship Check
                <FaRocket className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/contact"
              className="px-8 sm:px-12 py-4 sm:py-5 border-2 rounded-full font-semibold text-sm sm:text-lg transition-all duration-300 hover:scale-[1.03] hover:bg-white/10"
              style={{
                borderColor: Palette.limeGreen,
                color: Palette.limeGreen,
              }}
            >
              Talk to an Expert First
            </Link>
          </div>

          <p className="mt-4 text-[11px] sm:text-xs opacity-65">
            Priority slots for students targeting Fall 2026 and Jan 2027.
          </p>
        </div>
      </section>
      <MessageBox
        status={msg.status}
        message={msg.message}
        onClose={() => setMsg({ status: "", message: "" })}
      />
    </main>
  );
}

/* ================= SUB-COMPONENTS ================= */

function BentoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const tiles = [
    {
      span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
      icon: <FaGlobeAmericas />,
      title: "Global scholarship graph",
      desc: "12,000+ scholarships & grants mapped across 6 continents, from gov schemes to niche university awards.",
      color: Palette.royalBlue,
    },
    {
      span: "",
      icon: <FaShieldAlt />,
      title: "Process that protects you",
      desc: "98.4% of full-plan students submit zero-rejection documentation, thanks to tight compliance checks.",
      color: Palette.limeGreen,
    },
    {
      span: "",
      icon: <FaLightbulb />,
      title: "AI-powered shortlisting",
      desc: "Predictive matching surfaces scholarships that fit your academics, budget and target countries.",
      color: Palette.coral,
    },
    {
      span: "",
      icon: <FaUserGraduate />,
      title: "Mentors who’ve done it",
      desc: "Guidance from alumni of top global universities who’ve navigated scholarships themselves.",
      color: Palette.softYellow,
    },
  ];

  return (
    <section
      ref={ref}
      className="max-w-7xl mx-auto px-5 sm:px-6 py-20 sm:py-28"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Why students trust our process
          </h2>
          <p className="text-sm sm:text-base opacity-80 max-w-xl">
            It&apos;s not just about finding scholarships—it&apos;s about
            matching, planning and executing in a way that actually fits your
            reality.
          </p>
        </div>
        <p className="text-xs sm:text-sm opacity-70 max-w-sm">
          Whether you&apos;re from CBSE, ICSE, state boards or grads with years
          of work experience, the system flexes to your starting point.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {tiles.map((tile, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: i * 0.08 }}
            className={`${tile.span} group relative p-6 sm:p-7 md:p-8 rounded-3xl border border-white/12 bg-[#020617]/90 hover:bg-[#020617] transition-all duration-400 cursor-default overflow-hidden`}
          >
            <BentoTileContent
              icon={tile.icon}
              title={tile.title}
              desc={tile.desc}
              color={tile.color}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BentoTileContent({ icon, title, desc, color }) {
  return (
    <>
      <div
        className="absolute top-0 left-0 w-1.5 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />
      <div
        className="text-4xl sm:text-5xl mb-4 sm:mb-5 transition-transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-3 duration-500"
        style={{ color }}
      >
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-2.5 sm:mb-3 text-white tracking-tight">
        {title}
      </h3>
      <p className="text-sm sm:text-base opacity-80 leading-relaxed">{desc}</p>
      <div
        className="absolute -bottom-10 -right-6 sm:-bottom-10 sm:-right-10 text-7xl sm:text-8xl opacity-5 transition-transform group-hover:rotate-6 duration-600 pointer-events-none"
        style={{ color }}
      >
        {icon}
      </div>
    </>
  );
}

function ProcessStep({ num, title, desc }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative pl-10"
    >
      <div className="absolute left-0 top-1.5 flex items-center justify-center h-7 w-7 rounded-full border-2 border-white/50 bg-[#020617] text-xs font-semibold">
        {num}
      </div>
      <h4 className="text-lg sm:text-xl font-semibold mb-1 text-white">
        {title}
      </h4>
      <p className="text-sm sm:text-base opacity-80 max-w-xl">{desc}</p>
    </motion.div>
  );
}
