"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LazyMotion, m } from "framer-motion";
import {
  Search,
  ArrowRight,
  X,
  GraduationCap,
  MessageCircle,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import * as gtag from "@/lib/gtag";
import CountryCard from "@/components/ui/CountryCard";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectIsCounselorStudent } from "@/store/authSelectors";

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
        preferredCountry: formData.get("preferredCountry"),
        countryName: "General Study Abroad Inquiry",
        captchaToken,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/country/lead`,
        payload,
        { withCredentials: true },
      );

      if (response.data.success) {
        gtag.event({
          action: "lead_submit",
          category: "conversion",
          label: "countries_lead_form",
        });
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
    <m.div
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <m.div
        variants={modalPanel}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full sm:max-w-sm bg-[#0B0F19] border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl px-5 pt-5 pb-6 sm:p-6 shadow-2xl shadow-cyan-500/10 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* drag handle on mobile */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <GraduationCap className="text-cyan-400" size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">
              Free Counseling
            </h3>
            <p className="text-xs text-gray-400">Study Abroad — 100% Free</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Not sure which country fits you? Our counselors will shortlist the
          best options — for free.
        </p>

        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Your Full Name"
            required
            autoComplete="name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          />
          <input
            type="tel"
            name="phone"
            placeholder="WhatsApp Number"
            required
            autoComplete="tel"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          />
          <select
            name="preferredCountry"
            required
            defaultValue=""
            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-300 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          >
            <option value="" disabled>
              Preferred Country to Study
            </option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="Ireland">Ireland</option>
            <option value="New Zealand">New Zealand</option>
            <option value="France">France</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Singapore">Singapore</option>
            <option value="Other">Other</option>
          </select>
          <select
            name="intake"
            required
            defaultValue=""
            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-300 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
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
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Submitting..." : "Book My Free Session →"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-3">
          🔒 100% Free & Confidential · No spam, ever
        </p>
      </m.div>
    </m.div>
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
          onClick={() => {
            gtag.event({
              action: "whatsapp_click",
              category: "contact",
              label: "countries_whatsapp",
            });
          }}
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
            onClick={() => {
              gtag.event({
                action: "whatsapp_click",
                category: "contact",
                label: "countries_whatsapp",
              });
            }}
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

// ── PAGINATION NAV ────────────────────────────────────────────────────────────
// FIX (Organic Growth Audit, Section 12/14, item #3): replaces the old
// "Load More Countries" client-fetch button. Every page now has a real
// /all-countries?page=N (and &region=...&search=... when filtering) URL
// with a server-rendered <Link href>, so page 2+ of the 200-country
// directory is independently crawlable — same fix pattern as /blog and
// /programs/universities.
function buildCountriesHref(search, region, page) {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (region && region !== "All Regions") query.set("region", region);
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return qs ? `/all-countries?${qs}` : "/all-countries";
}

function PaginationNav({ search, region, currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Countries pagination"
      className="flex items-center justify-center flex-wrap gap-2 mt-10"
    >
      {currentPage > 1 && (
        <Link
          href={buildCountriesHref(search, region, currentPage - 1)}
          className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-200 font-medium hover:bg-white/10 transition"
        >
          ← Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2,
        )
        .reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) acc.push("ellipsis-" + p);
          acc.push(p);
          return acc;
        }, [])
        .map((p) =>
          typeof p === "string" ? (
            <span key={p} className="px-2 text-gray-600">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildCountriesHref(search, region, p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={`px-5 py-3 rounded-2xl font-semibold transition ${
                p === currentPage
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617]"
                  : "bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10"
              }`}
            >
              {p}
            </Link>
          ),
        )}

      {currentPage < totalPages && (
        <Link
          href={buildCountriesHref(search, region, currentPage + 1)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] font-bold hover:scale-105 transition-transform"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CountriesClient({
  initialCountries = [],
  initialPagination = {},
  initialSearch = "",
  initialRegion = "All Regions",
}) {
  const router = useRouter();

  // Data + pagination now come straight from the server-rendered props —
  // no client-side fetch duplicates the initial page load, and no
  // "load more" appends pages invisibly into local state. Changing the
  // search box or region filter below navigates to a new
  // /all-countries?... URL instead, which page.jsx re-fetches server-side.
  const countries = initialCountries;
  const currentPage = initialPagination.page || 1;
  const totalPages = initialPagination.totalPages || 1;

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const isCounselorStudent = useSelector(selectIsCounselorStudent);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Navigate (server re-fetch + real URL) once the debounced search or the
  // region filter actually changes from what the server already rendered.
  useEffect(() => {
    if (debouncedSearch === initialSearch && selectedRegion === initialRegion) {
      return;
    }

    if (debouncedSearch) {
      gtag.event({
        action: "search_used",
        category: "search",
        label: debouncedSearch,
      });
    }

    router.push(buildCountriesHref(debouncedSearch.trim(), selectedRegion, 1), {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedRegion]);

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
    if (isCounselorStudent) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 5) {
        tryAutoOpen();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isCounselorStudent, tryAutoOpen]);

  // Auto-clear toast after 4 s
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      setMessage("");
      setMessageStatus("");
    }, 4000);
    return () => clearTimeout(t);
  }, [message]);

  const clearSearch = () => setSearchTerm("");

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
      {!isCounselorStudent && <FloatingCTA onOpen={openModal} />}

      {!isCounselorStudent && modalOpen && (
        <LeadModal
          onClose={closeModal}
          setMessage={setMessage}
          setMessageStatus={setMessageStatus}
        />
      )}

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
            {!isCounselorStudent && (
              <m.div
                variants={fadeUp}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => {
                    gtag.event({
                      action: "cta_click",
                      category: "engagement",
                      label: "countries_free_counseling",
                    });

                    openModal();
                  }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#38BDF8] to-cyan-500 text-[#020617] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all"
                >
                  Get Free Counseling <ArrowRight size={20} />
                </button>
                <a
                  href={WA_NUMBER}
                  onClick={() => {
                    gtag.event({
                      action: "whatsapp_click",
                      category: "contact",
                      label: "countries_whatsapp",
                    });
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-green-500/40 text-green-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-500/10 transition-all"
                >
                  <MessageCircle size={20} /> WhatsApp Us
                </a>
              </m.div>
            )}
            {!isCounselorStudent && (
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
            )}
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
                {!isCounselorStudent && (
                  <button
                    onClick={() => {
                      gtag.event({
                        action: "cta_click",
                        category: "engagement",
                        label: "countries_free_counseling",
                      });

                      openModal();
                    }}
                    className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap hover:scale-[1.02] transition-transform"
                  >
                    Free Counseling <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── COUNTRY GRID ── */}
        <m.section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {countries.length === 0 ? (
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

                {!isCounselorStudent && countries.length >= 8 && (
                  <InlineCTABanner onOpen={openModal} />
                )}

                <PaginationNav
                  search={initialSearch}
                  region={selectedRegion}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        </m.section>

        {/* ── FINAL CTA ── */}
        {!isCounselorStudent && (
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
                    onClick={() => {
                      gtag.event({
                        action: "cta_click",
                        category: "engagement",
                        label: "countries_free_counseling",
                      });

                      openModal();
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-cyan-500/25 hover:scale-[1.03] transition-transform"
                  >
                    Book Free Counseling <ArrowRight size={18} />
                  </button>
                  <a
                    href="tel:+918074708569"
                    className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/5 transition-colors"
                  >
                    <PhoneCall size={18} className="text-cyan-400" /> Call Us
                    Now
                  </a>
                </div>
              </m.div>
            </div>
          </section>
        )}
      </main>
    </LazyMotion>
  );
}
