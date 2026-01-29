"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  FaPassport,
  FaFileAlt,
  FaUserCheck,
  FaPlaneDeparture,
  FaCheckCircle,
  FaQuoteLeft,
  FaQuestionCircle,
  FaCalendarCheck,
  FaShieldAlt,
  FaGraduationCap,
  FaBriefcase,
  FaUsers,
} from "react-icons/fa";

const services = [
  {
    icon: <FaPassport className="text-2xl sm:text-3xl md:text-4xl" />,
    title: "Visa Guidance",
    desc: "Personalized assessment based on latest country rules & your profile.",
  },
  {
    icon: <FaFileAlt className="text-2xl sm:text-3xl md:text-4xl" />,
    title: "Document Preparation",
    desc: "SOP writing, financial proofs, affidavits — 100% accurate & professional.",
  },
  {
    icon: <FaUserCheck className="text-2xl sm:text-3xl md:text-4xl" />,
    title: "Error-Free Filing",
    desc: "We handle online & offline submission to avoid refusals.",
  },
  {
    icon: <FaPlaneDeparture className="text-2xl sm:text-3xl md:text-4xl" />,
    title: "Interview Preparation",
    desc: "Mock sessions + real questions from recent approvals.",
  },
];

const whyChooseUs = [
  { icon: <FaCheckCircle />, text: "95%+ Visa Success Rate (2025–2026)" },
  { icon: <FaUsers />, text: "5000+ Students & Professionals Placed" },
  { icon: <FaShieldAlt />, text: "100% Transparent – No Hidden Fees" },
  {
    icon: <FaCalendarCheck />,
    text: "Dedicated Case Manager for Every Client",
  },
  { icon: <FaGraduationCap />, text: "Expert Team with 10+ Years Experience" },
  { icon: <FaBriefcase />, text: "Post-Landing Support Available" },
];

const testimonials = [
  {
    name: "Aisha Khan",
    country: "Canada – Study Permit",
    quote:
      "From profile evaluation to interview — they handled everything perfectly. Got my visa in 4 weeks!",
  },
  {
    name: "Rahul Sharma",
    country: "Australia – Skilled Visa",
    quote:
      "Excellent SOP guidance. Without their help my application would have been rejected.",
  },
  {
    name: "Maria Santos",
    country: "UK – Visitor Visa",
    quote:
      "Very professional team. Mock interview gave me full confidence. Highly recommended!",
  },
];

const faqs = [
  {
    q: "How long does it take to get a visa?",
    a: "Depends on country & visa type. Student visas: 3–12 weeks | Work visas: 2–8 months | Visit visas: 2–6 weeks. We give realistic timelines during consultation.",
  },
  {
    q: "What is the success rate?",
    a: "Our success rate is 95%+ for well-prepared applications (2025–2026 data). Refusals mostly happen due to incomplete documents or weak ties to home country.",
  },
  {
    q: "Do you guarantee visa approval?",
    a: "No agency can legally guarantee approval — it's decided by consulates. But we maximize chances with expert documentation & interview prep.",
  },
  {
    q: "What documents do I need?",
    a: "It varies by visa & country. After profile evaluation we provide a personalized checklist within 24 hours.",
  },
];

const countries = [
  "USA",
  "Canada",
  "UK",
  "Australia",
  "Germany",
  "Ireland",
  "New Zealand",
  "France",
  "Italy",
  "Singapore",
  "Dubai (UAE)",
  "Japan",
  "South Korea",
];

const steps = [
  "Free Profile Evaluation",
  "Customized Document Checklist",
  "SOP & Application Preparation",
  "Visa Filing & Tracking",
  "Biometrics / Interview Preparation",
  "Visa Outcome & Post-Landing Support",
];

// Unsplash image URLs (high-quality & relevant – you can replace if needed)
const images = {
  hero: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  services:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  whyChoose:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
  process:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  countries:
    "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
  testimonials:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  cta: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
};

export default function VisaGuidancePage() {
  return (
    <>
      <Head>
        <title>Expert Visa Guidance | YourVisaExperts</title>
        <meta
          name="description"
          content="Professional visa consultants for student, work, visitor, skilled migration & PR visas. Highest approval rate with end-to-end support and zero hidden charges."
        />
        <meta
          name="keywords"
          content="visa guidance, visa application, student visa, work visa, PR visa, visa consultants"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-[#0a0f1c] text-gray-100">
        {/* MOBILE NAVIGATION */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1c]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 md:hidden">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#6c7cff] to-[#22d3ee] bg-clip-text text-transparent">
              YourVisaExperts
            </div>
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* HERO SECTION - Fully Responsive */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 xl:px-20 pt-16 md:pt-0"
        >
          <div className="absolute inset-0">
            <Image
              src={images.hero}
              alt="Travel and visa success"
              fill
              className="object-cover brightness-[0.45] object-center"
              priority
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c]/40 via-[#0a0f1c]/60 to-[#0a0f1c]/95" />
          </div>

          <div className="relative z-10 max-w-4xl sm:max-w-5xl mx-auto py-3 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#6c7cff] via-[#22d3ee] to-[#6c7cff] tracking-tight">
              Expert Visa Guidance &
              <br className="sm:hidden" />
              <span className="block sm:inline">Application Filing</span>
              <br />
              <span className="text-sm md:text-base text-gray-400 tracking-wide font-normal block mt-2">
                2025–2026
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Professional visa consultants for student, work, visitor, skilled
              migration & PR visas.
              <strong>
                Highest approval rate • End-to-end support • Zero hidden
                charges.
              </strong>
            </p>

            <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-2xl mx-auto">
              <Link
                href="/consultation"
                className="px-6 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#6c7cff] to-[#22d3ee] rounded-full text-lg sm:text-xl font-bold hover:shadow-2xl hover:shadow-[#6c7cff]/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#6c7cff]/50 whitespace-nowrap"
              >
                Book FREE Consultation
              </Link>
              <Link
                href="/services/profile-evaluation"
                className="px-6 sm:px-10 md:px-12 py-4 sm:py-5 border-2 border-[#6c7cff] rounded-full text-lg sm:text-xl font-bold hover:bg-[#6c7cff]/20 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#6c7cff]/50 whitespace-nowrap"
              >
                Check Eligibility
              </Link>
            </div>
          </div>
        </motion.section>

        {/* TRUST BADGES */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12"
        >
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[
              "Regulated Consultants",
              "5-Star Rated",
              "Secure Payments",
              "24×7 Support",
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 md:gap-3 bg-[#12172a]/80 backdrop-blur-sm px-4 sm:px-6 py-3 md:py-4 rounded-full border border-[#6c7cff]/30 shadow-xl hover:shadow-2xl hover:border-[#6c7cff]/60 transition-all duration-300 min-w-[160px] sm:min-w-[180px]"
              >
                <FaShieldAlt className="text-[#22d3ee] text-lg sm:text-xl md:text-2xl flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base md:text-lg text-center">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SERVICES SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 my-16 sm:my-24">
          <div className="relative h-40 sm:h-56 md:h-72 lg:h-80 xl:h-96 mb-10 sm:mb-12 lg:mb-16 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={images.services}
              alt="Professional visa document preparation"
              fill
              className="object-cover brightness-75 object-center"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 70vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/90 via-[#0a0f1c]/50 to-transparent" />
            <h2 className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
              Our Visa Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {services.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-gradient-to-b from-[#12172a]/90 to-[#0d1425]/90 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl hover:border-[#6c7cff]/60 hover:shadow-[#6c7cff]/10 transition-all duration-500 hover:bg-[#12172a]"
              >
                <div className="text-[#22d3ee] mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-[#6c7cff] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-base xl:text-base text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 my-20 sm:my-32">
          <div className="relative h-40 sm:h-56 md:h-72 lg:h-80 xl:h-96 mb-10 sm:mb-12 lg:mb-16 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={images.whyChoose}
              alt="Team celebrating success"
              fill
              className="object-cover brightness-75 object-center"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 70vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c]/80 via-[#0a0f1c]/40 to-transparent" />
            <h2 className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
              Why Choose Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="flex items-start gap-4 sm:gap-5 lg:gap-6 bg-[#12172a]/90 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#6c7cff]/50 transition-all duration-500"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl text-[#22d3ee] flex-shrink-0 mt-1">
                  {item.icon}
                </div>
                <p className="text-base sm:text-lg lg:text-xl font-semibold leading-relaxed text-gray-100">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 my-20 sm:my-32">
          <div className="relative h-40 sm:h-56 md:h-72 lg:h-80 xl:h-96 mb-10 sm:mb-12 lg:mb-16 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={images.process}
              alt="Step by step journey planning"
              fill
              className="object-cover brightness-75 object-center"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 70vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/90 via-[#0a0f1c]/40 to-transparent" />
            <h2 className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
              Simple 6-Step Visa Process
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 sm:gap-6 bg-gradient-to-r from-[#12172a]/90 to-[#0d1425]/90 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-2xl border border-white/10 shadow-xl hover:border-[#6c7cff]/50 hover:shadow-2xl transition-all duration-500"
              >
                <div className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#6c7cff] to-[#22d3ee] text-white text-xl sm:text-2xl lg:text-3xl font-bold shadow-lg">
                  {i + 1}
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold flex-1">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COUNTRIES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 my-20 sm:my-32">
          <div className="relative h-40 sm:h-56 md:h-72 lg:h-80 xl:h-96 mb-10 sm:mb-12 lg:mb-16 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={images.countries}
              alt="World travel destinations"
              fill
              className="object-cover brightness-75 object-center"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 70vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c]/80 via-[#0a0f1c]/30 to-transparent" />
            <h2 className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
              Countries We Specialize In
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {countries.map((country, i) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -8 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#12172a]/90 backdrop-blur-sm py-6 sm:py-8 md:py-10 rounded-2xl border border-white/10 hover:border-[#6c7cff]/70 hover:shadow-2xl hover:shadow-[#6c7cff]/20 transition-all duration-500 text-center font-bold text-sm sm:text-base md:text-lg shadow-xl cursor-pointer"
              >
                {country}
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 my-20 sm:my-32">
          <div className="relative h-40 sm:h-56 md:h-72 lg:h-80 xl:h-96 mb-10 sm:mb-12 lg:mb-16 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={images.testimonials}
              alt="Happy clients success stories"
              fill
              className="object-cover brightness-75 object-center"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 70vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/90 via-[#0a0f1c]/40 to-transparent" />
            <h2 className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-[#12172a]/90 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl hover:shadow-[#6c7cff]/10 hover:border-[#6c7cff]/50 transition-all duration-500 relative overflow-hidden"
              >
                <FaQuoteLeft className="text-4xl sm:text-5xl lg:text-6xl text-[#6c7cff]/20 absolute -top-4 sm:-top-6 -left-2 sm:-left-4 -z-10" />
                <p className="text-sm sm:text-base lg:text-lg text-gray-200 italic mb-6 sm:mb-8 leading-relaxed relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="relative z-10">
                  <p className="font-bold text-lg sm:text-xl text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm sm:text-base text-[#22d3ee] font-medium mt-1">
                    {testimonial.country}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 my-20 sm:my-32">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-[#6c7cff] to-[#22d3ee] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-[#12172a]/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/10 group shadow-2xl hover:shadow-[#6c7cff]/10 transition-all duration-500 hover:border-[#6c7cff]/50"
              >
                <summary className="flex items-center gap-4 sm:gap-6 cursor-pointer text-lg sm:text-xl font-semibold hover:text-[#6c7cff] transition-all duration-300 list-none relative after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-6 after:h-6 after:bg-gradient-to-r after:from-[#6c7cff] after:to-[#22d3ee] after:rounded-full after:opacity-0 group-open:after:opacity-100 after:transition-all after:duration-300">
                  <FaQuestionCircle className="text-2xl sm:text-3xl text-[#22d3ee] flex-shrink-0" />
                  {faq.q}
                </summary>
                <div className="mt-6 sm:mt-8 text-gray-300 text-sm sm:text-base lg:text-lg pl-0 sm:pl-12 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto my-20 sm:my-32 px-4 sm:px-6 md:px-8 lg:px-12 rounded-3xl overflow-hidden border-2 border-[#6c7cff]/30 shadow-2xl"
        >
          <div className="absolute inset-0">
            <Image
              src={images.cta}
              alt="Start your visa journey"
              fill
              className="object-cover brightness-50 object-center"
              loading="lazy"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#6c7cff]/40 via-[#22d3ee]/30 to-[#0a0f1c]/90" />
          </div>

          <div className="relative z-10 py-16 sm:py-20 lg:py-28 px-6 sm:px-8 md:px-12 text-center">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-white drop-shadow-2xl leading-tight">
              Start Your Visa Journey
              <br className="md:hidden" />
              Today
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Get expert help from profile check to visa stamping —
              <strong>book your FREE consultation in 60 seconds.</strong>
            </p>
            <Link
              href="/assessment"
              className="inline-block px-10 sm:px-16 md:px-20 py-5 sm:py-6 bg-gradient-to-r from-[#6c7cff] to-[#22d3ee] rounded-full text-xl sm:text-2xl lg:text-3xl font-bold hover:shadow-2xl hover:shadow-[#6c7cff]/60 transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#6c7cff]/50 tracking-wide"
            >
              Get Free Assessment →
            </Link>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 text-center text-gray-400">
          <p className="text-lg sm:text-xl mb-4 sm:mb-6">
            Want latest visa rule updates?{" "}
            <Link
              href="/blog"
              className="text-[#22d3ee] hover:text-[#6c7cff] font-semibold hover:underline transition-colors duration-300"
            >
              Check our blog →
            </Link>
          </p>
          <p className="text-sm sm:text-base md:text-lg">
            © 2026 YourVisaExperts • All Rights Reserved • 100% Confidential
            Process
          </p>
        </footer>
      </div>
    </>
  );
}
