"use client";

import Image from "next/image";
import { LazyMotion, m, AnimatePresence } from "framer-motion";
import { memo, useState, useCallback, useMemo } from "react";
import Link from "next/link";

import axios from "axios";

import MessageBox from "@/components/ui/MessageBox";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  PhoneCall,
  Star,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Award,
  ClipboardList,
  ChevronDown,
  ArrowRight,
  Users,
  TrendingUp,
  Globe,
  MessageCircle,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   PERF: Load Framer Motion animation features lazily —
   avoids shipping the full motion bundle in the initial JS.
───────────────────────────────────────────────────────── */
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

/* ─────────────────────────────────────────────────────────
   PERF: Animation variants at module scope, NOT inside
   components. Re-defining inside render creates new object
   references every cycle, breaking Framer Motion's diffing
   and causing unnecessary re-animations.
───────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
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

/* ─────────────────────────────────────────────────────────
   PERF: sectionMeta at module scope — not re-created per render.
   borderBase/borderHover split avoids runtime string splitting.
───────────────────────────────────────────────────────── */
const SECTION_META = {
  popular: {
    icon: GraduationCap,
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    borderBase: "border-cyan-500/20",
    borderHover: "hover:border-cyan-400/50",
  },
  career: {
    icon: Briefcase,
    accent: "text-purple-400",
    bg: "bg-purple-500/10",
    borderBase: "border-purple-500/20",
    borderHover: "hover:border-purple-400/50",
  },
  scholarships: {
    icon: Award,
    accent: "text-yellow-400",
    bg: "bg-yellow-500/10",
    borderBase: "border-yellow-500/20",
    borderHover: "hover:border-yellow-400/50",
  },
  eligibility: {
    icon: ClipboardList,
    accent: "text-green-400",
    bg: "bg-green-500/10",
    borderBase: "border-green-500/20",
    borderHover: "hover:border-green-400/50",
  },
};

/* PERF: Static arrays at module scope — never re-created. */
const STAR_INDICES = [0, 1, 2, 3, 4];
const SIDEBAR_SERVICES = [
  "Profile Evaluation",
  "University Shortlisting",
  "Visa Guidance",
  "Scholarship Search",
];
const WA_NUMBER = "https://wa.me/918074708569";
const PHONE_NUMBER = "tel:+918074708569";

/* ─────────────────────────────────────────────────────────
   PERF: FiveStars extracted — avoids inline Array(5) spread
   in JSX on every parent render. Static: never re-renders.
───────────────────────────────────────────────────────── */
const FiveStars = memo(function FiveStars({ size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      {STAR_INDICES.map((i) => (
        <Star key={i} size={size} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
});

/* ─────────────────────────────────────────────────────────
   LEAD MODAL
   PERF: memo + uncontrolled form inputs (no useState per
   field) eliminates re-renders on every keystroke.
   onClose is stable via useCallback in parent.
───────────────────────────────────────────────────────── */
const LeadModal = memo(function LeadModal({
  onClose,
  countryName,
  setMessage,
  setMessageStatus,
}) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!executeRecaptcha) {
        setMessageStatus("error");
        setMessage("Recaptcha not ready");
        return;
      }

      const formData = new FormData(e.target);

      const captchaToken = await executeRecaptcha("country_lead_form");

      const payload = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        intake: formData.get("intake"),
        countryName,
        captchaToken,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/country/lead`,
        payload,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setMessageStatus("success");

        setMessage("Lead submitted successfully!");

        e.target.reset();

        onClose();
      }
    } catch (error) {
      console.error(error);

      setMessageStatus("error");

      setMessage(error?.response?.data?.message || "Something went wrong");
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

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <GraduationCap className="text-cyan-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Free Counseling</h3>
              <p className="text-sm text-gray-400">Study in {countryName}</p>
            </div>
          </div>

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
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] py-4 rounded-xl font-bold text-base hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20"
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
});

/* ─────────────────────────────────────────────────────────
   FLOATING MOBILE CTA
   PERF: memo — never re-renders (onOpen is stable, no
   internal state).
───────────────────────────────────────────────────────── */
const FloatingCTA = memo(function FloatingCTA({ onOpen }) {
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
});

/* ─────────────────────────────────────────────────────────
   STAT BADGE
   PERF: memo + primitive props → zero wasted renders.
   colorClass as a single string avoids template literals at render.
───────────────────────────────────────────────────────── */
const StatBadge = memo(function StatBadge({
  icon: Icon,
  label,
  value,
  colorClass,
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-cyan-400/30 transition-colors">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${colorClass}`}
      >
        <Icon size={20} />
      </div>
      <span className="text-2xl font-extrabold text-white">{value}</span>
      <span className="text-xs text-gray-400 mt-1 leading-tight">{label}</span>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────
   FAQ ITEM
   PERF: memo, each item owns its open state independently —
   toggling one never re-renders siblings.
   CSS max-height transition replaces AnimatePresence/m.div,
   eliminating JS-driven layout per frame entirely.
───────────────────────────────────────────────────────── */
const FAQItem = memo(function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((p) => !p), []);

  return (
    <div className="bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/30 transition-colors">
      <button
        onClick={toggle}
        aria-expanded={open}
        className="w-full flex justify-between items-center gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-white text-sm sm:text-base leading-snug pr-2">
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`text-cyan-400 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* CSS transition — no JS per frame, browser-native performance */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </p>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────
   CONTENT BLOCK
   PERF: memo. item key uses index (stable for static data).
   safeItems computed once inside component.
───────────────────────────────────────────────────────── */
const ContentBlock = memo(function ContentBlock({
  title,
  items,
  type = "popular",
}) {
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  const meta = SECTION_META[type] || SECTION_META.popular;
  const Icon = meta.icon;

  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div
          className={`w-10 h-10 rounded-xl ${meta.bg} border ${meta.borderBase} flex items-center justify-center`}
        >
          <Icon size={18} className={meta.accent} />
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          {title}
        </h2>
      </div>

      <m.ul
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {safeItems.map((item, index) => {
          const label =
            typeof item === "object"
              ? item.title || item.name || "Unknown"
              : item;
          return (
            <m.li
              key={index}
              variants={fadeUp}
              className={`bg-[#0B0F19] border ${meta.borderBase} ${meta.borderHover} rounded-xl p-4 flex items-start gap-3 transition-colors`}
            >
              <CheckCircle2
                size={16}
                className={`${meta.accent} mt-0.5 shrink-0`}
              />
              <span className="text-gray-200 text-sm sm:text-base leading-snug">
                {label}
              </span>
            </m.li>
          );
        })}
      </m.ul>
    </m.div>
  );
});

/* ─────────────────────────────────────────────────────────
   SIDEBAR CTA
   PERF: memo. onOpen is stable (useCallback in parent).
   SIDEBAR_SERVICES is module-scope — never re-created.
───────────────────────────────────────────────────────── */
const CTACard = memo(function CTACard({ onOpen }) {
  return (
    <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-7 shadow-xl sticky top-28">
      <div className="flex items-center gap-2 mb-5">
        <FiveStars size={14} />
        <span className="text-xs text-gray-400 ml-1">4.9 · 500+ Students</span>
      </div>

      <h3 className="text-xl font-bold text-white leading-snug">
        Book Your Free Counseling Session
      </h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">
        Our Hyderabad experts guide you from shortlisting to visa — completely
        free.
      </p>

      <button
        onClick={onOpen}
        className="mt-5 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] py-4 rounded-xl font-bold text-base hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
      >
        Get Started <ArrowRight size={18} />
      </button>

      <a
        href={WA_NUMBER}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 w-full border border-green-500/30 text-green-400 py-3.5 rounded-xl font-semibold text-sm hover:bg-green-500/10 transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle size={16} /> Chat on WhatsApp
      </a>

      <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
        {SIDEBAR_SERVICES.map((s) => (
          <div
            key={s}
            className="flex items-center gap-2 text-sm text-gray-300"
          >
            <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
            {s}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500 mt-5">
        🔒 Free · No spam · Hyderabad-based experts
      </p>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────
   UNIVERSITY CARD
   PERF: Extracted memo component — each card renders
   independently, no cascade re-renders across the grid.
───────────────────────────────────────────────────────── */
const UniCard = memo(function UniCard({ uni, index }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.42) }}
      viewport={{ once: true }}
      className="bg-[#0B0F19] border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-cyan-400/40 transition-colors group"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <GraduationCap size={18} className="text-cyan-400" />
      </div>
      <h3 className="text-base font-semibold text-white leading-snug group-hover:text-cyan-300 transition-colors">
        {uni.name}
      </h3>
      <p className="text-sm text-gray-400 mt-2">QS Rank #{uni.qsRanking}</p>
      <Link
        href={`/programs/universities/${uni.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
      >
        View Details <ArrowRight size={13} />
      </Link>
    </m.div>
  );
});

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function CountryDetail({ country, universities = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");

  const [message, setMessage] = useState("");

  /* PERF: useCallback → stable refs → memo'd children never
     re-render when parent state changes for other reasons. */
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  if (!country) return null;

  const {
    slug,
    name,
    heroImage,
    visaSuccessRate,
    popularCourses,
    careerOpportunities,
    scholarships,
    eligibilityRequirements,
    whyStudyCards,
  } = country;

  /* PERF: useMemo — faqs only recompute when country data changes,
     not on modal open/close or any other state update. */
  const faqs = useMemo(
    () => [
      {
        question: `Is ${name} a good choice for Indian students in 2026?`,
        answer: `${name} is still one of the top study abroad destinations for Indian students in 2026. It offers globally ranked universities, generous post-study work visas (2–5 years in most cases), high student visa success rates (${visaSuccessRate}% for Indian applicants based on recent trends), part-time work rights (20–40 hours/week), strong job markets in IT, engineering, healthcare, business & data science, plus safe, multicultural cities with English as the primary language. Thousands of Indian students enroll every year and many secure PR pathways. Contact our Hyderabad experts for free profile evaluation and university shortlisting.`,
      },
      {
        question: `What is the student visa success rate for ${name}?`,
        answer: `The current student visa success rate for ${name} is around ${visaSuccessRate}% for Indian applicants (based on recent immigration data and consultancy reports). Approval chances improve significantly with strong academics (65–85%+), sufficient financial proof, clear Statement of Purpose, genuine intent to return home after studies, and complete documentation. Our team in Hyderabad specializes in visa guidance, mock interviews, and application strengthening to maximize your chances.`,
      },
      {
        question: `Which courses are most popular for international students in ${name}?`,
        answer: `The most popular and in-demand courses in ${name} for international students include ${(popularCourses || []).join(", ")}. These programs are highly employable, often come with scholarship options, co-op/internship opportunities, and clear post-study work visa pathways. Many lead to high-paying jobs in global companies. We help Indian students choose the right course based on their background, budget, and career goals.`,
      },
      {
        question: `What scholarships are available for Indian students in ${name}?`,
        answer: `Indian students can apply for a wide range of scholarships in ${name}, including ${(scholarships || []).slice(0, 5).join(", ")} and many university-specific, government-funded, and merit-based awards. Scholarships range from 10–100% tuition waivers to full-ride packages including living expenses. Most require strong academics (70–90%+), good IELTS/TOEFL/PTE scores, and sometimes essays or interviews. Our Hyderabad counselors identify the best scholarships for your profile and assist with applications — completely free.`,
      },
    ],
    [name, visaSuccessRate, popularCourses, scholarships],
  );

  /* PERF: useMemo — schema is expensive to serialize; skip recompute
     unless the actual content changes. */
  const schemasJson = useMemo(() => {
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Study in ${name} 2026 – Top Universities, Visa, Scholarships for Indian Students`,
        description: `Complete 2026 guide to studying in ${name}: top universities, ${visaSuccessRate}% visa success rate, popular courses, scholarships, eligibility, post-study work & career opportunities for Indian students.`,
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/all-countries/${slug}`,
        publisher: {
          "@type": "Organization",
          name: "Khizar Overseas",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
        },
        mainEntity: { "@type": "Country", name },
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Khizar Overseas",
        url: process.env.NEXT_PUBLIC_FRONTEND_URL,
        logo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/logo.png`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          addressCountry: "IN",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: process.env.NEXT_PUBLIC_FRONTEND_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Study Abroad Destinations",
            item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/all-countries`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Study in ${name} 2026`,
            item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/all-countries/${slug}`,
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      ...(universities.length > 0
        ? [
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `Top Universities in ${name} for International Students`,
              itemListElement: universities.slice(0, 12).map((uni, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "CollegeOrUniversity",
                  name: uni.name,
                  url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/programs/universities/${uni.slug}`,
                },
              })),
            },
          ]
        : []),
    ];
    return JSON.stringify(schemas);
  }, [name, slug, visaSuccessRate, faqs, universities]);

  /* PERF: Derived values computed once — not inline in JSX. */
  const uniCount = universities.length > 0 ? `${universities.length}+` : "50+";
  const scholarshipCount = `${(scholarships || []).length || "20"}+`;
  const careerCount = `${(careerOpportunities || []).length || "15"}+`;
  const uniSearchHref = `/programs/universities?search=${encodeURIComponent(name)}`;

  return (
    <LazyMotion features={loadFeatures} strict>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemasJson }}
      />

      {/* PERF: Modal only mounted when open — eliminates DOM nodes
          and all Framer Motion overhead when not needed. */}
      {modalOpen && (
        <LeadModal
          onClose={closeModal}
          countryName={name}
          setMessage={setMessage}
          setMessageStatus={setMessageStatus}
        />
      )}

      <FloatingCTA onOpen={openModal} />

      <MessageBox
        status={messageStatus}
        message={message}
        onClose={() => {
          setMessageStatus("");
          setMessage("");
        }}
      />

      <main className="bg-[#020617] text-white min-h-screen relative">
        {/* ── HERO ── */}
        <section className="relative h-[70vh] sm:h-[75vh] min-h-[480px] overflow-hidden">
          {/* PERF: priority=true triggers <link rel="preload"> in <head>,
              eliminating LCP delay. fetchPriority="high" reinforces it. */}
          <Image
            src={heroImage?.url || "/fallback.jpg"}
            alt={`Study in ${name} 2026 – Best Universities, Visa Success & Scholarships for Indian Students`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#020617]" />

          <div className="relative z-10 h-full flex flex-col justify-end pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
              <nav
                className="text-xs sm:text-sm text-gray-400 mb-4 flex items-center gap-2 flex-wrap"
                aria-label="Breadcrumb"
              >
                <Link
                  href="/"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href="/all-countries"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Destinations
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white" aria-current="page">
                  Study in {name}
                </span>
              </nav>

              <m.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl"
              >
                Study in{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                  {name}
                </span>{" "}
                2026
              </m.h1>

              <m.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.12 }}
                className="mt-5 flex flex-wrap gap-3"
              >
                <span className="inline-flex items-center gap-2 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                  <TrendingUp size={14} />
                  {visaSuccessRate}% Visa Success
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-gray-200 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                  <Users size={14} />
                  Top Choice for Indians
                </span>
                <Link
                  href={uniSearchHref}
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-gray-200 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm hover:border-cyan-400/40 transition-colors"
                >
                  <Globe size={14} />
                  View Universities
                </Link>
              </m.div>

              <m.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.22 }}
                className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <button
                  onClick={openModal}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:scale-[1.03] transition-transform"
                >
                  Get Free Counseling <ArrowRight size={18} />
                </button>
                <a
                  href={WA_NUMBER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:bg-white/15 transition-colors"
                >
                  <MessageCircle size={18} className="text-green-400" />
                  WhatsApp Us
                </a>
              </m.div>
            </div>
          </div>
        </section>

        {/* ── QUICK STATS BAR ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            <StatBadge
              icon={TrendingUp}
              label="Visa Success Rate"
              value={`${visaSuccessRate}%`}
              colorClass="bg-cyan-500/10 text-cyan-400"
            />
            <StatBadge
              icon={GraduationCap}
              label="Top Universities"
              value={uniCount}
              colorClass="bg-purple-500/10 text-purple-400"
            />
            <StatBadge
              icon={Award}
              label="Scholarships"
              value={scholarshipCount}
              colorClass="bg-yellow-500/10 text-yellow-400"
            />
            <StatBadge
              icon={Briefcase}
              label="Career Paths"
              value={careerCount}
              colorClass="bg-green-500/10 text-green-400"
            />
          </m.div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className="pt-16 pb-32 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_380px] gap-10 xl:gap-14 items-start">
            {/* LEFT COLUMN */}
            <div className="space-y-16 lg:space-y-20 min-w-0">
              <ContentBlock
                title={`Popular Courses in ${name} in 2026`}
                items={popularCourses}
                type="popular"
              />
              <ContentBlock
                title={`Career Opportunities After Studying in ${name}`}
                items={careerOpportunities}
                type="career"
              />
              <ContentBlock
                title="Scholarships & Financial Aid"
                items={scholarships}
                type="scholarships"
              />
              <ContentBlock
                title={`Eligibility Requirements for ${name}`}
                items={eligibilityRequirements}
                type="eligibility"
              />

              {/* WHY STUDY */}
              {whyStudyCards?.length > 0 && (
                <m.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Star size={18} className="text-blue-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                      Why Study in {name} in 2026?
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    {whyStudyCards.map((item, i) => (
                      <m.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.08, 0.4) }}
                        viewport={{ once: true }}
                        className="bg-[#0B0F19] border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-cyan-400/30 transition-colors group"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
                          {item.description}
                        </p>
                      </m.div>
                    ))}
                  </div>
                </m.div>
              )}

              {/* INLINE LEAD CAPTURE */}
              <m.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/20 rounded-3xl p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
                      Free · No Obligation
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Not sure where to start?
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Our counselors in Hyderabad will evaluate your profile and
                      suggest the best universities & scholarships in {name}.
                    </p>
                  </div>
                  <button
                    onClick={openModal}
                    className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-7 py-4 rounded-xl font-bold text-sm sm:text-base hover:scale-[1.03] transition-transform shadow-lg shadow-cyan-500/20 whitespace-nowrap"
                  >
                    Talk to an Expert <ArrowRight size={16} />
                  </button>
                </div>
              </m.div>

              {/* FAQ */}
              <m.section
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="border-t border-white/10 pt-14"
              >
                <div className="mb-10">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
                    Common Questions
                  </p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    Frequently Asked Questions
                  </h2>
                  <p className="mt-3 text-gray-400 text-sm sm:text-base">
                    Everything Indian students ask before choosing {name} in
                    2026
                  </p>
                </div>

                {/* PERF: plain div — FAQs use CSS transitions not Framer Motion,
                    so a stagger wrapper adds overhead with no benefit. */}
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <FAQItem
                      key={i}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </m.section>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="hidden lg:block">
              <CTACard onOpen={openModal} />
            </aside>
          </div>
        </section>

        {/* ── TOP UNIVERSITIES ── */}
        {Array.isArray(universities) && universities.length > 0 && (
          <section className="py-16 sm:py-20 lg:py-28 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <m.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12"
              >
                <div>
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
                    World-Class Institutions
                  </p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Top Universities in {name} 2026
                  </h2>
                </div>
                <Link
                  href={uniSearchHref}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 shrink-0"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </m.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {universities.slice(0, 12).map((uni, i) => (
                  <UniCard key={uni._id} uni={uni} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FINAL CTA BANNER ── */}
        <section className="py-16 sm:py-20 border-t border-white/10 mb-20 lg:mb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0B0F19] to-[#0a1428] border border-cyan-500/20 rounded-3xl p-8 sm:p-12"
            >
              <div className="flex justify-center mb-5">
                <FiveStars size={18} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                Ready to Study in {name}?
              </h2>
              <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                Join hundreds of students from Hyderabad who trusted us for
                their journey. Get your profile evaluated — completely free.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openModal}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-cyan-500/25 hover:scale-[1.03] transition-transform"
                >
                  Book Free Counseling <ArrowRight size={18} />
                </button>
                <a
                  href={PHONE_NUMBER}
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/5 transition-colors"
                >
                  <PhoneCall size={18} className="text-cyan-400" />
                  Call Us Now
                </a>
              </div>
            </m.div>
          </div>
        </section>
      </main>
    </LazyMotion>
  );
}
