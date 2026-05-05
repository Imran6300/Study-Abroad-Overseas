"use client";

import { useState, useEffect, useMemo } from "react";
import StudentProCard from "@/components/upgrade/StudentProCard";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineFilter,
  HiX,
  HiChevronDown,
} from "react-icons/hi";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Link from "next/link";
const MotionLink = motion(Link);
import MessageBox from "@/components/ui/MessageBox";

import { useDispatch, useSelector } from "react-redux";
import { fetchUniversities } from "@/store/universitySlice";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
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

export default function CanadaUniversitiesClient() {
  const dispatch = useDispatch();
  const { list: universities } = useSelector((state) => state.universities);
  const { user } = useSelector((state) => state.auth);

  const [messageBox, setMessageBox] = useState({
    status: null,
    message: "",
  });

  useEffect(() => {
    if (universities.length === 0) {
      dispatch(fetchUniversities());
    }
  }, [dispatch, universities.length]);

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

  useEffect(() => {
    const loadShortlist = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/shortlist`,
          { credentials: "include" },
        );

        if (!res.ok) return;

        const data = await res.json();

        const ids = data.shortlist?.map((u) => u.id) || [];

        setShortlisted(ids);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      loadShortlist();
    }
  }, [user]);

  const toggleShortlist = async (uni) => {
    if (!user) {
      setMessageBox({
        status: "error",
        message: (
          <span className="text-red-400">
            Please login to save universities to your dashboard.
          </span>
        ),
      });

      setTimeout(() => {
        setMessageBox({ status: null, message: "" });
      }, 3000);

      return;
    }

    const isAlreadyShortlisted = shortlisted.includes(String(uni._id));

    try {
      if (isAlreadyShortlisted) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/university/shortlist/${uni._id}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        setShortlisted((prev) => prev.filter((id) => id !== String(uni._id)));

        setMessageBox({
          status: "success",
          message: (
            <span className="text-yellow-400">
              University removed from shortlist.
            </span>
          ),
        });
      } else {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/university/shortlist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              universityId: uni._id,
            }),
          },
        );

        setShortlisted((prev) => [...prev, String(uni._id)]);

        setMessageBox({
          status: "success",
          message: (
            <span className="text-green-400">
              University added to your shortlist.
            </span>
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      setMessageBox({ status: null, message: "" });
    }, 3000);
  };

  const filteredUnis = useMemo(() => {
    return universities.filter((uni) => {
      const countryMatch =
        appliedCountry === "All Countries" ||
        uni.country?.toLowerCase() === appliedCountry.toLowerCase();

      const degreeMatch =
        appliedDegree === "All Degrees" ||
        uni.courses?.some((course) => {
          const level = course.level?.toLowerCase() || "";

          if (appliedDegree === "Bachelors") return level === "bachelor";
          if (appliedDegree === "Masters") return level === "master";
          if (appliedDegree === "PhD") return level === "phd";

          return true;
        });

      let budgetMatch = appliedBudget === "Any Budget";

      if (appliedBudget !== "Any Budget") {
        const fees =
          uni.courses?.map((c) => {
            const value = c.fees?.replace(/,/g, "").split("–")[0].trim();
            return parseInt(value) || 0;
          }) || [];

        const minFee = fees.length ? Math.min(...fees) : 0;

        if (appliedBudget === "Under $15,000") budgetMatch = minFee < 15000;
        else if (appliedBudget === "$15,000 – $35,000")
          budgetMatch = minFee >= 15000 && minFee <= 35000;
        else if (appliedBudget === "Over $35,000") budgetMatch = minFee > 35000;
      }

      return countryMatch && degreeMatch && budgetMatch;
    });
  }, [universities, appliedCountry, appliedDegree, appliedBudget]);

  // ─── Effects ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setShowFloatingBar(shortlisted.length > 0);
  }, [shortlisted]);

  useEffect(() => {
    controls.start("visible");
  }, [filteredUnis.length, controls]);

  const handleApplyFilters = () => {
    setAppliedCountry(tempCountry);
    setAppliedDegree(tempDegree);
    setAppliedBudget(tempBudget);
    if (filtersOpen) setFiltersOpen(false);
  };

  return (
    <>
      <MessageBox
        status={messageBox.status}
        message={messageBox.message}
        onClose={() => setMessageBox({ status: null, message: "" })}
      />
      <div className="min-h-screen bg-gray-50 mt-5">
        {/* Hero – Optimized H1 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-[#2f4f4f] text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              University Shortlisting Tool for Study Abroad 2026
            </h1>

            <p className="mt-5 text-xl md:text-2xl opacity-90 max-w-4xl mx-auto">
              Compare top universities worldwide by country, degree, tuition
              fees, rankings and courses. Find the best universities for
              studying abroad and shortlist them easily with Khizar Overseas.
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
            {/* Desktop Filters – Unchanged */}
            <motion.aside
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-[#2f4f4f] mb-6 flex items-center gap-2">
                  <HiOutlineFilter className="w-6 h-6 text-[#2f4f4f]" />
                  Filter Universities in Canada
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
              {/* Mobile filter trigger – Unchanged */}
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

              {/* University Cards – Add alt to img */}
              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate={controls}
              >
                <AnimatePresence>
                  {filteredUnis.length > 0 ? (
                    filteredUnis.map((uni, i) => {
                      const isShortlisted = shortlisted.includes(
                        String(uni._id),
                      );
                      return (
                        <div key={uni._id} className="contents">
                          {i === 3 && (
                            <div className="sm:col-span-2 lg:col-span-3">
                              <StudentProCard variant="light" compact />
                            </div>
                          )}

                          <motion.div
                            key={uni._id}
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
                                src={uni.logo?.url}
                                alt={`${uni.name} logo – top university in Canada 2026 QS ranking`}
                                className="max-h-20 object-contain"
                                loading="lazy"
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
                                  {uni.qsRanking}
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
                                  {[
                                    ...new Set(
                                      uni.courses?.map(
                                        (course) => course.level,
                                      ),
                                    ),
                                  ].join(", ")}
                                </p>
                                <p>
                                  <span className="font-semibold text-[#2f4f4f]">
                                    Tuition:
                                  </span>{" "}
                                  {uni.tuitionFee}
                                </p>
                              </div>

                              <div className="flex gap-3 mt-auto">
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleShortlist(uni)}
                                  className={`flex-1 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                                    isShortlisted
                                      ? "bg-[#32cd32] text-white hover:bg-[#2ab92a]"
                                      : "bg-[#2f4f4f]/10 text-[#2f4f4f] hover:bg-[#2f4f4f]/20 border border-[#2f4f4f]/30"
                                  }`}
                                >
                                  <motion.div
                                    animate={
                                      isShortlisted ? "animate" : "initial"
                                    }
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
                                  href={`/programs/universities/${uni.slug}`}
                                  whileHover={{ scale: 1.02 }}
                                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition text-center"
                                >
                                  Details
                                </MotionLink>
                              </div>
                            </div>
                          </motion.div>
                        </div>
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
                        for top Canada universities 2026
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Why Study Section – Optimized with keywords */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="mt-16 bg-white rounded-xl p-7 border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-[#2f4f4f] mb-5">
                  Why Study in Top Canada Universities 2026? – Guide for
                  Hyderabad Students
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In 2026, Canada is the #1 choice for Indian students from
                  Hyderabad due to world-class QS-ranked universities,
                  affordable tuition, and PR pathways. Khizar Overseas helps
                  with free shortlisting & 98.7% visa success.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>
                    <strong>QS Top-Ranked Education</strong>: University of
                    Toronto (#29), McGill (#27), UBC (top 40) – excellent for
                    masters/bachelors.
                  </li>
                  <li>
                    <strong>Post-Graduation Work Permit (PGWP)</strong>: Up to 3
                    years work → PR via Express Entry. 5000+ Hyderabad students
                    transitioned.
                  </li>
                  <li>
                    <strong>Multicultural & Safe</strong>: Diverse campuses,
                    high quality of life – ideal for international students.
                  </li>
                  <li>
                    <strong>Affordable Tuition</strong>: CAD 20,000–60,000/year
                    + scholarships up to 50%.
                  </li>
                  <li>
                    <strong>2026 Updates</strong>: No PAL for graduate students
                    at public DLIs – faster visas.
                  </li>
                </ul>
                <p className="text-gray-700">
                  Canada plans ~408,000 study permits in 2026 – focus on
                  quality. Contact Khizar Overseas for personalized Canada
                  university shortlisting.
                </p>
              </motion.section>

              {/* FAQs – Expanded & Keyword-Rich */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-12 bg-white rounded-xl p-7 border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-[#2f4f4f] mb-6">
                  FAQs: Top Universities in Canada 2026 for Indian Students
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      q: "What are the top universities in Canada for Indian students in 2026?",
                      a: "QS 2026: University of Toronto (#29), McGill (#27), UBC (top 40). Khizar Overseas in Hyderabad offers free shortlisting with 98.7% visa success.",
                    },
                    {
                      q: "How much does it cost to study in top Canadian universities 2026?",
                      a: "Tuition: CAD 20,000–60,000/year. Living: CAD 15,000–20,000. Scholarships available – get free cost guide from Khizar Overseas Hyderabad.",
                    },
                    {
                      q: "What are the 2026 intakes for Canada universities?",
                      a: "Fall (Sept), Winter (Jan), Summer (May). Deadlines 6–12 months prior. We help Hyderabad students with applications & scholarships.",
                    },
                    {
                      q: "Can Indian students get PR after studying in Canada 2026?",
                      a: "Yes – PGWP (3 years) → Express Entry/PR. 5000+ students placed by Khizar Overseas.",
                    },
                    {
                      q: "How to shortlist best Canada universities from Hyderabad?",
                      a: "Use our free filter tool for QS rankings, tuition, courses. Book evaluation – Call/WhatsApp +91 73298 22309.",
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

        {/* Mobile Filters Bottom Sheet */}
        {/* Mobile Filters Bottom Sheet */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            >
              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // 🔥 THIS FIXES IT
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#2f4f4f]">
                      Filters
                    </h2>
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
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 text-base"
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
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 text-base"
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
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 text-base"
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
