"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LazyMotion, m, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  X,
  GraduationCap,
  MessageCircle,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import CountryCard from "@/components/ui/CountryCard";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalPanel = {
  hidden: { opacity: 0, scale: 0.93, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.93, y: 20 },
};

const WA_NUMBER = "https://wa.me/918074708569";

/**
 * Key stored in localStorage.
 * If present → user has already seen the auto-popup → never show again.
 * Manual button clicks always open the modal regardless.
 */
const MODAL_SEEN_KEY = "khizar_countries_modal_seen";

// ── LEAD MODAL ────────────────────────────────────────────────────────────────
function LeadModal({ onClose, setMessage, setMessageStatus }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Guard: reCAPTCHA must be ready
      if (!executeRecaptcha) {
        setMessageStatus("error");
        setMessage("reCAPTCHA not ready. Please refresh and try again.");
        return;
      }

      const captchaToken = await executeRecaptcha("countries_lead_form");

      if (!captchaToken) {
        setMessageStatus("error");
        setMessage("reCAPTCHA failed. Please try again.");
        return;
      }

      const formData = new FormData(e.target);
      const payload = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        intake: formData.get("intake"),
        countryName: "General Study Abroad Inquiry",
        captchaToken,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/country/lead`,
        payload,
        { withCredentials: true },
      );

      if (response.data.success) {
        setMessageStatus("success");
        setMessage("We'll call you within 24 hours!");
        e.target.reset();
        onClose();
      }
    } catch (error) {
      console.error("Lead submit error:", error);
      setMessageStatus("error");
      setMessage(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <m.div
        variants={modalBackdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <m.div
          variants={modalPanel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-md bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <GraduationCap className="text-cyan-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Free Counseling</h3>
              <p className="text-sm text-gray-400">Study Abroad — 100% Free</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-5 leading-relaxed">
            Not sure which country fits you? Our Hyderabad counselors will
            evaluate your profile and shortlist the best options — for free.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Your Full Name"
              required
              autoComplete="name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
            />
            <input
              type="tel"
              name="phone"
              placeholder="WhatsApp Number"
              required
              autoComplete="tel"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              autoComplete="email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
            />
            <select
              name="intake"
              required
              defaultValue=""
              className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
            >
              <option value="" disabled>
                Preferred Intake
              </option>
              <option value="Sep">September</option>
              <option value="Jan">January</option>
              <option value="May">May</option>
              <option value="Others">Others</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] py-4 rounded-xl font-bold text-base hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Submitting..." : "Book My Free Session →"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            🔒 100% Free & Confidential · No spam, ever
          </p>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}

// ── FLOATING MOBILE CTA (always visible, button opens modal) ─────────────────
function FloatingCTA({ onOpen }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4">
      <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl">
        <button
          onClick={onOpen}
          className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] py-3.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg"
        >
          Get Free Counseling →
        </button>
        <a
          href={WA_NUMBER}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={22} />
        </a>
      </div>
    </div>
  );
}

// ── INLINE MID-PAGE CTA BANNER ────────────────────────────────────────────────
function InlineCTABanner({ onOpen }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 my-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <div className="flex-1">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
            Free · No Obligation
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Confused which country suits you?
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Our Hyderabad counselors will match your profile to the best
            country, university, and scholarship — in one free call.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              "Profile Evaluation",
              "University Shortlisting",
              "Visa Guidance",
              "Scholarship Search",
            ].map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 text-xs text-gray-300"
              >
                <CheckCircle2 size={12} className="text-cyan-400" /> {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 shrink-0">
          <button
            onClick={onOpen}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-7 py-4 rounded-xl font-bold text-sm sm:text-base hover:scale-[1.03] transition-transform shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            Get Free Counseling <ArrowRight size={16} />
          </button>
          <a
            href={WA_NUMBER}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-green-500/30 text-green-400 px-7 py-3 rounded-xl font-semibold text-sm hover:bg-green-500/10 transition-colors"
          >
            <MessageCircle size={14} /> WhatsApp Us
          </a>
        </div>
      </div>
    </m.div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CountriesClient({
  initialCountries = [],
  initialPagination,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [countries, setCountries] = useState(initialCountries);
  const [page, setPage] = useState(initialPagination.page);
  const [hasNextPage, setHasNextPage] = useState(initialPagination.hasNextPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  // Ref so the exit-intent handler closure always sees the latest value
  // without needing to be re-attached every render
  const autoOpenFired = useRef(false);

  // ── Manual open (buttons) — always works ──
  const openModal = useCallback(() => setModalOpen(true), []);

  // ── Close: also marks "seen" so auto-trigger never fires again ──
  const closeModal = useCallback(() => {
    setModalOpen(false);
    try {
      localStorage.setItem(MODAL_SEEN_KEY, "1");
    } catch (_) {
      // localStorage unavailable (private mode etc.) — fail silently
    }
  }, []);

  // ── Auto-open: only if user hasn't seen it yet ──
  const tryAutoOpen = useCallback(() => {
    // Already fired this session?
    if (autoOpenFired.current) return;
    // Already seen in a previous visit?
    try {
      if (localStorage.getItem(MODAL_SEEN_KEY)) return;
    } catch (_) {}
    autoOpenFired.current = true;
    setModalOpen(true);
  }, []);

  // Exit-intent trigger — desktop only, fires at most ONCE per session
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 5) {
        tryAutoOpen();
        // Remove immediately so it can never fire again
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [tryAutoOpen]);

  // Auto-clear toast after 4 s
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      setMessage("");
      setMessageStatus("");
    }, 4000);
    return () => clearTimeout(t);
  }, [message]);

  const fetchCountries = async (reset = false) => {
    try {
      if (reset) setLoading(true);
      const targetPage = reset ? 1 : page + 1;
      const regionQuery =
        selectedRegion !== "All Regions"
          ? `&continent=${encodeURIComponent(selectedRegion)}`
          : "";
      const searchQuery = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?page=${targetPage}&limit=20${regionQuery}${searchQuery}`,
      );
      const data = await res.json();
      if (reset) {
        setCountries(data.data);
      } else {
        setCountries((prev) => [...prev, ...data.data]);
      }
      setPage(data.pagination.page);
      setHasNextPage(data.pagination.hasNextPage);
    } catch (error) {
      console.error("Fetch countries error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchCountries(true), 400);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedRegion]);

  const clearSearch = () => setSearchTerm("");

  const loadMoreCountries = async () => {
    setLoadingMore(true);
    await fetchCountries(false);
  };

  const regions = [
    "All Regions",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Africa",
    "Oceania",
  ];

  return (
    <LazyMotion features={loadFeatures}>
      {/* Modal only mounted when open */}
      {modalOpen && (
        <LeadModal
          onClose={closeModal}
          setMessage={setMessage}
          setMessageStatus={setMessageStatus}
        />
      )}

      <FloatingCTA onOpen={openModal} />

      {/* Toast */}
      {message && (
        <div
          className={`fixed top-6 right-6 z-[1000] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl ${
            messageStatus === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message}
        </div>
      )}

      <main className="bg-gradient-to-b from-[#020617] to-[#0a0f1f] text-white min-h-screen">
        {/* ── HERO ── */}
        <m.section
          initial="hidden"
          animate="visible"
          variants={container}
          className="pt-40 pb-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <m.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
            >
              Discover Your Dream Study Destination
            </m.h1>
            <m.p
              variants={fadeUp}
              className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              Explore top countries with world-class education, scholarships,
              and global career opportunities.
            </m.p>
            <m.div
              variants={fadeUp}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={openModal}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#38BDF8] to-cyan-500 text-[#020617] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all"
              >
                Get Free Counseling <ArrowRight size={20} />
              </button>
              <a
                href={WA_NUMBER}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-green-500/40 text-green-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-500/10 transition-all"
              >
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </m.div>
            <m.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-4 justify-center"
            >
              {[
                "500+ Students Placed",
                "Free Profile Evaluation",
                "Hyderabad-Based Experts",
              ].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 text-sm text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full"
                >
                  <CheckCircle2 size={13} className="text-cyan-400" /> {t}
                </span>
              ))}
            </m.div>
          </div>
        </m.section>

        {/* ── SEARCH BAR ── */}
        <section className="relative -mt-16 z-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search country or keyword..."
                    className="w-full bg-transparent border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                      aria-label="Clear search"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-[#0B0F19] border border-white/20 rounded-2xl px-6 py-4 text-gray-300 focus:outline-none focus:border-cyan-400"
                >
                  {regions.map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </select>
                <button
                  onClick={openModal}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap hover:scale-[1.02] transition-transform"
                >
                  Free Counseling <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── COUNTRY GRID ── */}
        <m.section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-16 text-gray-400 text-xl">
                Searching countries...
              </div>
            ) : countries.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xl">
                No countries found matching your search.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {countries.map((country, index) => (
                    <CountryCard
                      key={country._id}
                      title={country.name}
                      slug={country.slug}
                      image={country.heroImage?.url}
                      flag={country.flagImage?.url}
                      capital={country.capital}
                      visaSuccessRate={country.visaSuccessRate}
                      visaSuccessRateEstimated={
                        country.visaSuccessRateEstimated
                      }
                      priority={index < 4}
                    />
                  ))}
                </div>

                {countries.length >= 8 && (
                  <InlineCTABanner onOpen={openModal} />
                )}

                {hasNextPage && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMoreCountries}
                      disabled={loadingMore}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] font-bold hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {loadingMore ? "Loading..." : "Load More Countries"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </m.section>

        {/* ── FINAL CTA ── */}
        <section className="py-16 border-t border-white/10 mb-24 lg:mb-8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0B0F19] to-[#0a1428] border border-cyan-500/20 rounded-3xl p-8 sm:p-12"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ready to Study Abroad?
              </h2>
              <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                Join hundreds of students from Hyderabad who trusted us for
                their journey abroad. Get your profile evaluated — completely
                free.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openModal}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-cyan-500/25 hover:scale-[1.03] transition-transform"
                >
                  Book Free Counseling <ArrowRight size={18} />
                </button>
                <a
                  href="tel:+918074708569"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/5 transition-colors"
                >
                  <PhoneCall size={18} className="text-cyan-400" /> Call Us Now
                </a>
              </div>
            </m.div>
          </div>
        </section>
      </main>
    </LazyMotion>
  );
}
