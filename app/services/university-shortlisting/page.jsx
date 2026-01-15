"use client";

import { useState, useEffect, useMemo } from "react";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineFilter,
  HiX,
  HiArrowRight,
  HiChevronDown,
} from "react-icons/hi";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Link from "next/link";
const MotionLink = motion(Link);

//importing universities data

import { universityItems } from "@/components/Home/Universities/TopUniversitiesData";

// ─── Static data & variants (moved outside component) ────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04, // reduced from 0.06 → feels snappier
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const heartVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.4, 1],
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ──────────────────────────────────────────────────────────────────────────────────────

export default function UniversityShortlisting() {
  const country = "Canada";

  const [shortlisted, setShortlisted] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [tempCountry, setTempCountry] = useState("All Countries");
  const [tempDegree, setTempDegree] = useState("All Degrees");
  const [tempBudget, setTempBudget] = useState("Any Budget");

  const [appliedCountry, setAppliedCountry] = useState("All Countries");
  const [appliedDegree, setAppliedDegree] = useState("All Degrees");
  const [appliedBudget, setAppliedBudget] = useState("Any Budget");

  const controls = useAnimation();

  // ─── Memoized derived data ───────────────────────────────────────────────────────────
  const shortlistedUnis = useMemo(
    () => universityItems.filter((uni) => shortlisted.includes(uni.id)),
    [shortlisted]
  );

  const filteredUnis = useMemo(() => {
    return universityItems.filter((uni) => {
      const countryMatch =
        appliedCountry === "All Countries" || uni.country === appliedCountry;

      const degreeMatch =
        appliedDegree === "All Degrees" ||
        uni.degree.toLowerCase().includes(appliedDegree.toLowerCase());

      let budgetMatch = appliedBudget === "Any Budget";

      if (appliedBudget !== "Any Budget") {
        const tuitionStr = uni.tuition
          .replace(/[^0-9]/g, "")
          .split("–")[0]
          .trim();
        const tuitionNum = parseInt(tuitionStr) || 0;

        if (appliedBudget === "Under $15,000") budgetMatch = tuitionNum < 15000;
        else if (appliedBudget === "$15,000 – $35,000")
          budgetMatch = tuitionNum >= 15000 && tuitionNum <= 35000;
        else if (appliedBudget === "Over $35,000")
          budgetMatch = tuitionNum > 35000;
      }

      return countryMatch && degreeMatch && budgetMatch;
    });
  }, [appliedCountry, appliedDegree, appliedBudget]);

  // ─── Effects ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setShowFloatingBar(shortlisted.length > 0);
  }, [shortlisted]);

  useEffect(() => {
    // Only re-animate when the number of visible items changes
    controls.start("visible");
  }, [filteredUnis.length, controls]);

  const handleApplyFilters = () => {
    setAppliedCountry(tempCountry);
    setAppliedDegree(tempDegree);
    setAppliedBudget(tempBudget);
    if (filtersOpen) setFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-5">
      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-[#2f4f4f] text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Top Universities in {country} for International Students
          </h1>
          <p className="mt-5 text-xl md:text-2xl opacity-90 max-w-4xl mx-auto">
            Compare 2026 QS rankings, tuition, intakes — find your perfect match
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <MotionLink
              href="/services/profile-evaluation"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#2f4f4f] px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-100 transition"
            >
              Free Profile Evaluation →
            </MotionLink>
            <MotionLink
              href="/all-countries"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition inline-block"
            >
              See All Countries
            </MotionLink>
          </div>
        </div>
      </motion.header>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <motion.aside
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-[#2f4f4f] mb-6 flex items-center gap-2">
                <HiOutlineFilter className="w-6 h-6 text-[#2f4f4f]" />
                Filter Universities
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <select
                    value={tempCountry}
                    onChange={(e) => setTempCountry(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-[#2f4f4f]/30 focus:border-[#2f4f4f]"
                  >
                    <option>All Countries</option>
                    <option>Canada</option>
                    <option>USA</option>
                    <option>UK</option>
                    <option>Germany</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Degree Level
                  </label>
                  <select
                    value={tempDegree}
                    onChange={(e) => setTempDegree(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-[#2f4f4f]/30 focus:border-[#2f4f4f]"
                  >
                    <option>All Degrees</option>
                    <option>Bachelors</option>
                    <option>Masters</option>
                    <option>PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Budget (per year)
                  </label>
                  <select
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-[#2f4f4f]/30 focus:border-[#2f4f4f]"
                  >
                    <option>Any Budget</option>
                    <option>Under $15,000</option>
                    <option>$15,000 – $35,000</option>
                    <option>Over $35,000</option>
                  </select>
                </div>

                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-[#2f4f4f] text-white py-3 rounded-xl font-semibold hover:bg-[#1e2f2f] transition mt-3"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Mobile filter trigger */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setFiltersOpen(true)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 font-medium flex items-center justify-between shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <HiOutlineFilter className="w-5 h-5 text-[#2f4f4f]" />
                  Filters & Sort
                </span>
                <HiChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* University Cards + No results */}
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate={controls}
            >
              <AnimatePresence>
                {filteredUnis.length > 0 ? (
                  filteredUnis.map((uni, i) => {
                    const isShortlisted = shortlisted.includes(uni.id);
                    return (
                      <motion.div
                        key={uni.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                          transition: { duration: 0.3 },
                        }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full"
                      >
                        <div className="h-28 bg-gray-50 relative flex items-center justify-center p-5 border-b border-gray-200">
                          <img
                            src={uni.logo}
                            alt={uni.name}
                            className="max-h-20 object-contain"
                            loading="lazy" // ← performance boost
                            onError={(e) =>
                              (e.target.src = "/uni-placeholder.png")
                            }
                          />
                          <div className="absolute top-3 right-3 text-3xl drop-shadow-sm">
                            {uni.flag}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="mb-1">
                            <span className="inline-block bg-[#2f4f4f]/10 text-[#2f4f4f] text-xs font-bold px-2.5 py-1 rounded-full">
                              {uni.ranking}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#2f4f4f] mb-3 line-clamp-2">
                            {uni.name}
                          </h3>

                          <div className="text-sm text-gray-700 space-y-1.5 mb-5 flex-1">
                            <p>
                              <span className="font-semibold text-[#2f4f4f]">
                                Degree:
                              </span>{" "}
                              {uni.degree}
                            </p>
                            <p>
                              <span className="font-semibold text-[#2f4f4f]">
                                Tuition:
                              </span>{" "}
                              {uni.tuition}
                            </p>
                          </div>

                          <div className="flex gap-3 mt-auto">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleShortlist(uni.id)}
                              className={`flex-1 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                                isShortlisted
                                  ? "bg-[#32cd32] text-white hover:bg-[#2ab92a]"
                                  : "bg-[#2f4f4f]/10 text-[#2f4f4f] hover:bg-[#2f4f4f]/20 border border-[#2f4f4f]/30"
                              }`}
                            >
                              <motion.div
                                animate={isShortlisted ? "animate" : "initial"}
                                variants={heartVariants}
                              >
                                {isShortlisted ? (
                                  <HiHeart className="w-4 h-4" />
                                ) : (
                                  <HiOutlineHeart className="w-4 h-4" />
                                )}
                              </motion.div>
                              {isShortlisted ? "Shortlisted" : "Shortlist"}
                            </motion.button>

                            <MotionLink
                              href={`/universities/${uni.slug}`} // or slug-based
                              whileHover={{ scale: 1.02 }}
                              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition text-center"
                            >
                              Details
                            </MotionLink>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-full py-16 flex flex-col items-center justify-center text-center"
                  >
                    <div className="text-6xl mb-4 opacity-40">🔍</div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                      No universities found
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Try adjusting your filters or select different options
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Why Study Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="mt-16 bg-white rounded-xl p-7 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-[#2f4f4f] mb-5">
                Why Study in {country}?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In 2026, Canada remains one of the top destinations for
                international students thanks to its world-class universities
                (four in global top 100 QS 2026), welcoming policies, and strong
                post-study opportunities.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Top-ranked education</strong>: McGill (#27),
                  University of Toronto (#29), UBC (top 40) lead globally with
                  excellent research and employability.
                </li>
                <li>
                  <strong>Post-Graduation Work Permit (PGWP)</strong>: Up to 3
                  years work rights after graduation — pathway to permanent
                  residency (PR) via Express Entry or PNPs.
                </li>
                <li>
                  <strong>Multicultural & safe environment</strong>: Diverse
                  campuses, high quality of life, and inclusive society.
                </li>
                <li>
                  <strong>Affordable compared to US/UK</strong>: Lower tuition
                  for many programs + scholarships available.
                </li>
                <li>
                  <strong>Master’s/PhD exemptions</strong>: From 2026, no PAL
                  required for graduate students at public DLIs — faster
                  processing.
                </li>
              </ul>
              <p className="text-gray-700">
                Canada issued ~408,000 study permits in 2026 plans, focusing on
                quality and sustainability.
              </p>
            </motion.section>

            {/* FAQs */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-12 bg-white rounded-xl p-7 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-[#2f4f4f] mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "What are the best universities in Canada in 2026?",
                    a: "According to QS World University Rankings 2026, top ones include McGill University (#27 globally), University of Toronto (#29), and UBC (top 40). They excel in research, employability, and international outlook.",
                  },
                  {
                    q: "How much does it cost to study in Canada?",
                    a: "Tuition for international students ranges from CAD 20,000–60,000/year depending on program and province. Living costs add ~CAD 15,000–20,000/year. Many scholarships exist for high-achieving students.",
                  },
                  {
                    q: "Can I work while studying?",
                    a: "Yes — up to 24 hours/week off-campus during sessions (2026 rules), full-time during breaks. Eligibility shown on study permit.",
                  },
                  {
                    q: "How to get PR after studying in Canada?",
                    a: "Via Post-Graduation Work Permit → Canadian Experience Class (Express Entry) or Provincial Nominee Programs. Many graduates successfully transition to PR.",
                  },
                  {
                    q: "Do I need a Provincial Attestation Letter (PAL)?",
                    a: "Most undergraduates do in 2026, but master's/doctoral students at public institutions are exempt.",
                  },
                ].map((faq, i) => (
                  <details
                    key={i}
                    className="border-b border-gray-200 pb-3 last:border-0"
                  >
                    <summary className="font-medium text-[#2f4f4f] cursor-pointer flex justify-between items-center">
                      {faq.q}
                    </summary>
                    <p className="mt-2 text-gray-700">{faq.a}</p>
                  </details>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      {/* Floating Shortlist Bar */}
      <AnimatePresence>
        {showFloatingBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 py-4 px-5 md:px-8"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#32cd32]/10 text-[#32cd32] px-4 py-2 rounded-lg font-semibold">
                  {shortlisted.length} Shortlisted
                </div>
                <span className="text-gray-600 hidden sm:inline">
                  Ready to compare?
                </span>
              </div>

              <button
                onClick={() => setShowCompareModal(true)}
                className="bg-[#2f4f4f] text-white px-6 md:px-10 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#1e2f2f] transition shadow-md"
              >
                Compare & Evaluate Now
                <HiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowCompareModal(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#2f4f4f]">
                    Compare Shortlisted Universities
                  </h2>
                  <button onClick={() => setShowCompareModal(false)}>
                    <HiX className="w-8 h-8 text-gray-600" />
                  </button>
                </div>

                <div className="p-6">
                  {shortlistedUnis.length === 0 ? (
                    <p className="text-center text-gray-600">
                      No universities shortlisted yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-4 font-semibold">University</th>
                            <th className="p-4 font-semibold">Ranking</th>
                            <th className="p-4 font-semibold">Degree</th>
                            <th className="p-4 font-semibold">Tuition</th>
                            <th className="p-4 font-semibold">Country</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shortlistedUnis.map((uni) => (
                            <tr key={uni.id} className="border-t">
                              <td className="p-4 font-medium">{uni.name}</td>
                              <td className="p-4">{uni.ranking}</td>
                              <td className="p-4">{uni.degree}</td>
                              <td className="p-4">{uni.tuition}</td>
                              <td className="p-4">
                                {uni.country} {uni.flag}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowCompareModal(false)}
                      className="bg-[#2f4f4f] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1e2f2f]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Filters Bottom Sheet */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            onClick={() => setFiltersOpen(false)}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#2f4f4f]">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)}>
                    <HiX className="w-7 h-7 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Country
                    </label>
                    <select
                      value={tempCountry}
                      onChange={(e) => setTempCountry(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    >
                      <option>All Countries</option>
                      <option>Canada</option>
                      <option>USA</option>
                      <option>UK</option>
                      <option>Germany</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Degree Level
                    </label>
                    <select
                      value={tempDegree}
                      onChange={(e) => setTempDegree(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    >
                      <option>All Degrees</option>
                      <option>Bachelors</option>
                      <option>Masters</option>
                      <option>PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Budget (per year)
                    </label>
                    <select
                      value={tempBudget}
                      onChange={(e) => setTempBudget(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    >
                      <option>Any Budget</option>
                      <option>Under $15,000</option>
                      <option>$15,000 – $35,000</option>
                      <option>Over $35,000</option>
                    </select>
                  </div>

                  <button
                    onClick={handleApplyFilters}
                    className="w-full bg-[#2f4f4f] text-white py-4 rounded-xl font-bold mt-6"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
