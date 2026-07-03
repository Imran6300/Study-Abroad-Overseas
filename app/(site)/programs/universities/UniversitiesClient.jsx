"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as gtag from "@/lib/gtag";
import UniversityCard from "@/components/ui/UniversityCard";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { PublicOnly } from "@/components/shared/PortalVisibility";
import axios from "axios";
import {
  GraduationCap,
  MessageCircle,
  ArrowRight,
  X,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { AnimatePresence, m, LazyMotion } from "framer-motion";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const WA_NUMBER = "https://wa.me/918074708569";

/**
 * Separate key from the countries page so the two pages track independently.
 * Stored in localStorage → persists across navigations, clears when user
 * clears browser data.
 */
const MODAL_SEEN_KEY = "khizar_universities_modal_seen";

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

// ── LEAD MODAL ────────────────────────────────────────────────────────────────
function LeadModal({ onClose, setMessage, setMessageStatus }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!executeRecaptcha) {
        setMessageStatus("error");
        setMessage("reCAPTCHA not ready. Please refresh and try again.");
        return;
      }

      const captchaToken = await executeRecaptcha("universities_lead_form");

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
        countryName: "University Shortlisting Inquiry",
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
          label: "universities_lead_form",
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
        className="relative w-full sm:max-w-sm bg-gray-900 border border-blue-500/30 rounded-t-3xl sm:rounded-3xl px-5 pt-5 pb-6 sm:p-6 shadow-2xl shadow-blue-500/10 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* drag handle on mobile */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <GraduationCap className="text-blue-400" size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">
              Free University Guidance
            </h3>
            <p className="text-xs text-gray-400">
              We'll shortlist the best for you
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Not sure which university fits your profile? Our counselors will match
          you with top options — completely free.
        </p>

        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Your Full Name"
            required
            autoComplete="name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors text-sm"
          />
          <input
            type="tel"
            name="phone"
            placeholder="WhatsApp Number"
            required
            autoComplete="tel"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors text-sm"
          />
          <select
            name="preferredCountry"
            required
            defaultValue=""
            className="w-full bg-gray-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-300 focus:outline-none focus:border-blue-400 transition-colors text-sm"
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
            className="w-full bg-gray-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-300 focus:outline-none focus:border-blue-400 transition-colors text-sm"
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
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Submitting..." : "Get Free Shortlist →"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-3">
          🔒 100% Free & Confidential · No spam, ever
        </p>
      </m.div>
    </m.div>
  );
}

// ── FLOATING MOBILE CTA ───────────────────────────────────────────────────────
function FloatingCTA({ onOpen }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl">
        <button
          onClick={onOpen}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg"
        >
          Get Free University Shortlist →
        </button>
        <a
          href={WA_NUMBER}
          onClick={() => {
            gtag.event({
              action: "whatsapp_click",
              category: "contact",
              label: "floating_cta_whatsapp",
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

// ── INLINE CTA BANNER ─────────────────────────────────────────────────────────
function InlineCTABanner({ onOpen }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="col-span-full bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-500/20 rounded-3xl p-6 sm:p-8 my-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <div className="flex-1">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
            Free · No Obligation
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Not sure which university to apply to?
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Our Hyderabad counselors will match your grades, budget, and goals
            to the best universities abroad — for free.
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
                <CheckCircle2 size={12} className="text-blue-400" /> {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 shrink-0">
          <button
            onClick={onOpen}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-7 py-4 rounded-xl font-bold text-sm sm:text-base hover:scale-[1.03] transition-transform shadow-lg shadow-blue-500/20 whitespace-nowrap"
          >
            Get Free Shortlist <ArrowRight size={16} />
          </button>
          <a
            href={WA_NUMBER}
            onClick={() => {
              gtag.event({
                action: "whatsapp_click",
                category: "contact",
                label: "floating_cta_whatsapp",
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

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function UniversitiesClient({
  universities,
  initialSearch = "",
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [results, setResults] = useState(universities ?? []);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const autoOpenFired = useRef(false);

  // ── Manual open ──
  const openModal = useCallback(() => setModalOpen(true), []);

  // ── Close + mark seen ──
  const closeModal = useCallback(() => {
    setModalOpen(false);
    try {
      localStorage.setItem(MODAL_SEEN_KEY, "1");
    } catch (_) {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm.trim()) return;

      setDebouncedSearch(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearch) return;

    gtag.event({
      action: "search_used",
      category: "search",
      label: debouncedSearch,
    });
  }, [debouncedSearch]);

  // ── Auto-open: only once per user ──
  const tryAutoOpen = useCallback(() => {
    if (autoOpenFired.current) return;
    try {
      if (localStorage.getItem(MODAL_SEEN_KEY)) return;
    } catch (_) {}
    autoOpenFired.current = true;
    setModalOpen(true);
  }, []);

  // Exit-intent — desktop only, fires at most once
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 5) {
        tryAutoOpen();
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [tryAutoOpen]);

  // Auto-clear toast
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      setMessage("");
      setMessageStatus("");
    }, 4000);
    return () => clearTimeout(t);
  }, [message]);

  // Search effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = searchTerm.trim()
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${encodeURIComponent(searchTerm)}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities`;
        const res = await fetch(endpoint);
        const data = await res.json();
        setResults(data?.universities ?? []);
        setPage(1);
        setHasMore(true);
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const endpoint = searchTerm.trim()
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${encodeURIComponent(searchTerm)}&page=${nextPage}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=${nextPage}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const newUniversities = data?.universities ?? [];
      setResults((prev) => {
        const map = new Map();
        [...prev, ...newUniversities].forEach((u) => {
          if (!u) return;
          map.set(u._id ?? u.slug ?? JSON.stringify(u), u);
        });
        return Array.from(map.values());
      });
      setPage(nextPage);
      if (newUniversities.length === 0) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const BANNER_AFTER_INDEX = 7; // inject after the 8th card (0-indexed: 7)

  return (
    <LazyMotion features={loadFeatures}>
      <PublicOnly>
        {modalOpen && (
          <LeadModal
            onClose={closeModal}
            setMessage={setMessage}
            setMessageStatus={setMessageStatus}
          />
        )}
      </PublicOnly>

      <PublicOnly>
        <FloatingCTA onOpen={openModal} />
      </PublicOnly>

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

      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* ── HERO ── */}
        <div className="bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-gray-950 pt-28 pb-24 border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-200">
                Top Universities Abroad for Indian Students
              </h2>
              <p className="mt-6 text-xl text-gray-300 leading-relaxed">
                Find your perfect university — compare rankings, programs,
                acceptance rates & student experience.
              </p>
              <PublicOnly>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      gtag.event({
                        action: "cta_click",
                        category: "engagement",
                        label: "free_shortlist_button",
                      });

                      openModal();
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg hover:scale-[1.03] transition-transform"
                  >
                    Get Free University Shortlist <ArrowRight size={18} />
                  </button>
                  <a
                    href={WA_NUMBER}
                    onClick={() => {
                      gtag.event({
                        action: "whatsapp_click",
                        category: "contact",
                        label: "floating_cta_whatsapp",
                      });
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-green-500/40 text-green-400 px-8 py-4 rounded-2xl font-bold text-base hover:bg-green-500/10 transition-all"
                  >
                    <MessageCircle size={18} /> WhatsApp Us
                  </a>
                </div>
              </PublicOnly>
              <PublicOnly>
                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    "500+ Students Placed",
                    "Free Shortlisting",
                    "Hyderabad-Based Experts",
                  ].map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 text-sm text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full"
                    >
                      <CheckCircle2 size={13} className="text-blue-400" /> {t}
                    </span>
                  ))}
                </div>
              </PublicOnly>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-16 -mt-16 mb-24 lg:mb-8">
          {/* ── SEARCH ── */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search university name, country, city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-800/60 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-gray-800/90 transition-all outline-none text-lg shadow-lg shadow-black/20"
            />
          </div>

          {/* ── RESULTS ── */}
          {results.length === 0 ? (
            <div className="text-center py-24 text-gray-500 text-lg">
              No universities match your search
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {results.map((uni, i) => (
                  <div
                    key={uni?._id ?? uni?.slug ?? `uni-${i}`}
                    className="opacity-100 transition-all duration-500"
                  >
                    <UniversityCard uni={uni} index={i} />
                  </div>
                ))}
              </div>

              {/* Inline CTA after 8 results — rendered outside the grid */}
              {results.length > BANNER_AFTER_INDEX && (
                <PublicOnly>
                  <InlineCTABanner onOpen={openModal} />
                </PublicOnly>
              )}

              {hasMore && (
                <div className="flex justify-center mt-8 mb-10">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/30 disabled:opacity-50 transition-all duration-200 text-lg"
                  >
                    {loadingMore ? "Loading..." : "Load More Universities"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── FINAL CTA ── */}
          <PublicOnly>
            <div className="mt-16 bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-500/20 rounded-3xl p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Still Searching? Let Us Do It For You
              </h2>
              <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                Our counselors in Hyderabad will evaluate your profile and
                shortlist the best universities — completely free.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    gtag.event({
                      action: "cta_click",
                      category: "engagement",
                      label: "free_shortlist_button",
                    });

                    openModal();
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:scale-[1.03] transition-transform"
                >
                  Book Free Counseling <ArrowRight size={18} />
                </button>
                <a
                  href="tel:+918074708569"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/5 transition-colors"
                >
                  <PhoneCall size={18} className="text-blue-400" /> Call Us Now
                </a>
              </div>
            </div>
          </PublicOnly>
        </main>
      </div>
    </LazyMotion>
  );
}
