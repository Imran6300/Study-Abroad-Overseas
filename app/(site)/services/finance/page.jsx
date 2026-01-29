"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Optional: nicer variants for accordion items
const accordionVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 22,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3 },
  },
};

const iconVariants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

// Reusable variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

const cardHover = {
  rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  hover: {
    scale: 1.03,
    boxShadow:
      "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 },
  },
};

// ────────────────────────────────────────────────
// Your original data object (unchanged)
const FINANCIAL_PAGE_DATA = {
  hero: {
    title: "Financial Planning for Studying Abroad in 2026",
    description:
      "Get a realistic estimate of your total study abroad expenses — tuition fees, monthly living costs, hidden fees, scholarships, and education loan options — tailored for top destinations.",
    primaryCTA: {
      label: "Get Free Personalized Financial Assessment",
      href: "/free-assessment",
    },
    secondaryCTA: {
      label: "Use Cost Calculator Now",
      href: "#calculator",
    },
  },

  calculator: {
    title: "Study Abroad Cost Calculator",
    levels: [
      { value: "undergraduate", label: "Undergraduate / Bachelor’s" },
      { value: "postgraduate", label: "Postgraduate / Master’s" },
    ],
    duration: { min: 1, max: 6 },
    livingCostHint:
      "Typical range: $1,200 – $2,000 depending on city & lifestyle",
  },

  countries: {
    USA: {
      label: "USA",
      tuition: { undergraduate: 35000, postgraduate: 30000 },
      living: 1800,
    },
    UK: {
      label: "United Kingdom",
      tuition: { undergraduate: 28000, postgraduate: 26000 },
      living: 1500,
    },
    Canada: {
      label: "Canada",
      tuition: { undergraduate: 22000, postgraduate: 20000 },
      living: 1300,
    },
    Australia: {
      label: "Australia",
      tuition: { undergraduate: 28000, postgraduate: 30000 },
      living: 1700,
    },
  },

  breakdown: {
    title: "Average Study Abroad Costs by Country (2026)",
  },

  lead: {
    title: "Need Help Managing Study Abroad Finances?",
    description:
      "Our experts help with budgeting, scholarships, education loans, part-time work rules, and more — completely free consultation.",
    cta: {
      label: "Start Free Financial Consultation",
      href: "/free-assessment",
    },
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        q: "What is the average cost of studying abroad in 2026?",
        a: "Total cost (tuition + living) typically ranges from $25,000–$80,000+ per year depending on country, course, and city.",
      },
      {
        q: "How can I reduce my study abroad expenses?",
        a: "Apply early for scholarships, choose affordable cities, share accommodation, and compare low-interest education loans.",
      },
      {
        q: "Do scholarships cover full tuition for international students?",
        a: "Some scholarships do, but most cover 10–50% of tuition. We help identify realistic options during assessment.",
      },
    ],
  },
};

export default function FinancialPlanningPage() {
  const [form, setForm] = useState({
    country: "",
    level: "",
    duration: 1,
    livingCost: 1200,
  });

  const countryData = useMemo(() => {
    const result = {};
    Object.entries(FINANCIAL_PAGE_DATA.countries).forEach(([key, value]) => {
      result[key] = {
        undergrad: value.tuition.undergraduate,
        postgrad: value.tuition.postgraduate,
        living: value.living,
      };
    });
    return result;
  }, []);

  useEffect(() => {
    if (form.country && countryData[form.country]) {
      setForm((prev) => ({
        ...prev,
        livingCost: countryData[form.country].living,
      }));
    }
  }, [form.country, countryData]);

  const estimate = useMemo(() => {
    if (!form.country || !form.level || form.duration < 1) return 0;

    const data = countryData[form.country];
    if (!data) return 0;

    const tuitionPerYear =
      form.level === "undergraduate" ? data.undergrad : data.postgrad;

    return Math.round(
      tuitionPerYear * form.duration + form.livingCost * 12 * form.duration
    );
  }, [form, countryData]);

  const formatCurrency = (num) =>
    num.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <main className="min-h-screen bg-[#2F4F4F] text-[#DCDCDC] pt-28 px-6 md:px-12">
      {/* HERO */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto mb-20"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-white mb-5"
        >
          {FINANCIAL_PAGE_DATA.hero.title}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-300 max-w-3xl mb-8"
        >
          {FINANCIAL_PAGE_DATA.hero.description}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Link
              href={FINANCIAL_PAGE_DATA.hero.primaryCTA.href}
              className="bg-[#4169E1] px-8 py-4 rounded-xl font-bold text-white inline-block"
            >
              {FINANCIAL_PAGE_DATA.hero.primaryCTA.label}
            </Link>
          </motion.div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            href={FINANCIAL_PAGE_DATA.hero.secondaryCTA.href}
            className="border-2 border-[#4169E1] text-[#4169E1] px-8 py-4 rounded-xl font-semibold inline-block"
          >
            {FINANCIAL_PAGE_DATA.hero.secondaryCTA.label}
          </motion.a>
        </motion.div>
      </motion.section>

      {/* CALCULATOR */}
      <motion.section
        id="calculator"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-24"
      >
        <motion.div
          variants={itemVariants}
          className="bg-[#1E2A2A] p-8 rounded-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            {FINANCIAL_PAGE_DATA.calculator.title}
          </h2>

          <div className="space-y-6">
            <motion.select
              whileFocus={{ scale: 1.02 }}
              className="w-full bg-[#2F4F4F] p-4 rounded-lg border border-transparent focus:border-[#4169E1] transition"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            >
              <option value="">Select Country</option>
              {Object.entries(FINANCIAL_PAGE_DATA.countries).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.label}
                </option>
              ))}
            </motion.select>

            <motion.select
              whileFocus={{ scale: 1.02 }}
              className="w-full bg-[#2F4F4F] p-4 rounded-lg border border-transparent focus:border-[#4169E1] transition"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <option value="">Select Level</option>
              {FINANCIAL_PAGE_DATA.calculator.levels.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </motion.select>

            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              min={FINANCIAL_PAGE_DATA.calculator.duration.min}
              max={FINANCIAL_PAGE_DATA.calculator.duration.max}
              value={form.duration}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration: Math.max(1, Number(e.target.value)),
                })
              }
              className="w-full bg-[#2F4F4F] p-4 rounded-lg border border-transparent focus:border-[#4169E1] transition"
            />

            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              value={form.livingCost}
              onChange={(e) =>
                setForm({
                  ...form,
                  livingCost: Number(e.target.value),
                })
              }
              className="w-full bg-[#2F4F4F] p-4 rounded-lg border border-transparent focus:border-[#4169E1] transition"
            />
            <p className="text-xs text-gray-400">
              {FINANCIAL_PAGE_DATA.calculator.livingCostHint}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#1E2A2A] p-8 rounded-2xl flex flex-col"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Estimated Total Cost
          </h3>

          {estimate > 0 ? (
            <motion.p
              key={estimate}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="text-5xl font-extrabold text-[#32CD32]"
            >
              {formatCurrency(estimate)}
            </motion.p>
          ) : (
            <p className="text-gray-400">Select country, level and duration</p>
          )}

          <p className="text-gray-400 mt-2">for {form.duration} year(s)</p>

          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-auto"
          >
            <Link
              href="/free-assessment"
              className="block bg-[#4169E1] text-white px-6 py-4 rounded-xl text-center font-bold"
            >
              Get Accurate Personalized Plan
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* COUNTRY CARDS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="max-w-6xl mx-auto mb-24"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-10">
          {FINANCIAL_PAGE_DATA.breakdown.title}
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {Object.entries(FINANCIAL_PAGE_DATA.countries).map(([key, c]) => (
            <motion.div
              key={key}
              variants={{ ...itemVariants, ...cardHover }}
              initial="rest"
              whileHover="hover"
              className="bg-[#1E2A2A] p-6 rounded-xl text-center cursor-pointer"
            >
              <h3 className="text-xl font-bold text-[#4169E1] mb-3">
                {c.label}
              </h3>
              <p>${c.tuition.undergraduate.toLocaleString()} / year</p>
              <p>${c.living.toLocaleString()} / month</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* LEAD CTA BANNER */}
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-5xl mx-auto mb-24"
      >
        <div className="bg-gradient-to-br from-[#1E2A2A] to-[#2F4F4F] p-10 md:p-16 rounded-3xl text-center border border-gray-700/40">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Need Help Managing Study Abroad Finances?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Our experts can help with budgeting, finding scholarships, comparing
            education loans, part-time work rules, and more — completely free
            consultation.
          </p>

          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/free-assessment"
              className="inline-block bg-[#FF8C00] hover:bg-orange-700 text-black px-10 py-5 rounded-xl font-bold text-lg transition shadow-lg"
            >
              Start Free Financial Consultation
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="max-w-4xl mx-auto mb-30 py-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          {FINANCIAL_PAGE_DATA.faq.title}
        </h2>

        <div className="space-y-4">
          {FINANCIAL_PAGE_DATA.faq.items.map((faq, index) => {
            const [isOpen, setIsOpen] = useState(false);

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#1E2A2A] rounded-xl overflow-hidden border border-gray-700/30 shadow-sm"
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#252f2f] transition-colors duration-200"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-[#32CD32] pr-8">
                    {faq.q}
                  </h3>

                  <motion.span
                    animate={isOpen ? "open" : "closed"}
                    variants={iconVariants}
                    transition={{ duration: 0.4 }}
                    className="text-[#32CD32] text-2xl font-bold flex-shrink-0"
                  >
                    {isOpen ? "−" : "+"}
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      variants={accordionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="px-6 pb-5 text-gray-300 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </main>
  );
}
