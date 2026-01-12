"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";
import { useState } from "react";

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null);

  const services = [
    {
      title: "Profile Evaluation",
      description:
        "Free expert review of your academic background, test scores, work experience, and overall profile. We highlight strengths, identify gaps, and suggest the most suitable countries, programs, and universities for your goals.",
      icon: "📊",
      image: "/coreservices/profileevaluation.avif",
      alt: "Student profile evaluation and academic assessment",
    },
    {
      title: "University Shortlisting",
      description:
        "Personalized list of 8–12 universities tailored to your profile, budget, and career aspirations — including reach, target, and safety options across top study destinations like USA, UK, Canada, Australia, Germany, and Ireland.",
      icon: "🏫",
      image: "/coreservices/campusshortlisting.avif",
      alt: "University campus shortlisting for study abroad",
    },
    {
      title: "SOP / LOR Assistance",
      description:
        "Professional guidance to create compelling Statements of Purpose, essays, CVs, and Letters of Recommendation that showcase your unique story and increase your chances of admission.",
      icon: "✍️",
      image: "/coreservices/writingassistance.avif",
      alt: "Writing assistance for SOP and LOR documents",
    },
    {
      title: "Visa Guidance & Filing",
      description:
        "Step-by-step support for student visa applications: document checklists, form guidance, financial proof preparation, mock interviews, and appointment assistance to help secure approval.",
      icon: "🛂",
      image: "/coreservices/studentvisaapplication.avif",
      alt: "Student visa application guidance and filing",
    },
    {
      title: "Financial Planning",
      description:
        "Guidance on scholarships, education loans, proof of funds, budgeting, and cost planning — helping you present strong financial documents and explore affordable study options.",
      icon: "💰",
      image: "/coreservices/financialplanning.avif",
      alt: "Financial planning and budgeting support for international students",
    },
    {
      title: "Pre-Departure Support",
      description:
        "Full assistance before you travel: accommodation booking, flight guidance, forex, insurance, cultural orientation, and airport transfer support for a smooth transition abroad.",
      icon: "✈️",
      image: "/coreservices/pre-departuresupport.avif",
      alt: "Pre-departure support for international students",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Free Profile Evaluation",
      desc: "Submit your details — get expert feedback in 24-48 hours.",
    },
    {
      step: 2,
      title: "Counselling & Shortlisting",
      desc: "One-on-one session to finalise countries, courses, and universities.",
    },
    {
      step: 3,
      title: "Application & Documentation",
      desc: "We help with forms, SOP/LOR, and complete submission.",
    },
    {
      step: 4,
      title: "Visa Preparation & Filing",
      desc: "Mock interviews, document checks, and full support.",
    },
    {
      step: 5,
      title: "Pre-Departure & Beyond",
      desc: "Accommodation, travel, and settling-in guidance.",
    },
  ];

  const faqs = [
    {
      question: "Is the profile evaluation really free?",
      answer:
        "Yes — completely free with no obligation. We provide honest feedback to help you decide your next steps.",
    },
    {
      question: "How long does the entire process take?",
      answer:
        "It depends on your target intake (e.g., Fall/Jan/May). Typically 6–12 months from evaluation to visa, but we can fast-track where possible.",
    },
    {
      question: "Do you guarantee visa approval?",
      answer:
        "No consultancy can guarantee visas (as decisions are made by embassies), but our structured guidance gives you the highest possible success rate.",
    },
    {
      question: "What test preparation do you offer?",
      answer:
        "We provide coaching referrals and guidance for IELTS, TOEFL, PTE, GRE, GMAT, and Duolingo — helping you meet university requirements.",
    },
  ];

  // Variants for animations (optimized with reduced durations and once: true)
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Structured data for SEO (Schema.org for LocalBusiness and Services)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Khizar Overseas",
    description:
      "Study abroad consultancy in Hyderabad offering profile evaluation, university shortlisting, visa guidance, and more.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500001",
      addressCountry: "IN",
    },
    telephone: "+91 73299 922309",
    email: "info@studyabroad.com",
    url: "https://www.khizaroverseas.com/services",
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$$",
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>Study Abroad Services in Hyderabad | Khizar Overseas</title>
        <meta
          name="description"
          content="Comprehensive study abroad services including profile evaluation, university shortlisting, SOP/LOR assistance, visa guidance, financial planning, and pre-departure support. Trusted consultancy in Hyderabad."
        />
        <meta
          name="keywords"
          content="study abroad Hyderabad, overseas education consultants, visa guidance, university shortlisting, profile evaluation, SOP writing, student visa services"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.khizaroverseas.com/services" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="bg-gray-900 text-white py-28 md:py-36"
        >
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            >
              End-to-End Study Abroad Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-300"
            >
              Personalized support from profile assessment to visa approval and
              safe arrival — trusted by students in Hyderabad.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-5"
            >
              <Link
                href="/contact"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-9 py-4 rounded-lg shadow-md transition duration-300 text-lg"
              >
                Book Free Consultation
              </Link>
              <Link
                href="/success-stories"
                className="border border-white text-white font-semibold px-9 py-4 rounded-lg hover:bg-white/10 transition duration-300 text-lg"
              >
                See Success Stories
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Core Services Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-20 md:py-28 bg-gray-50"
        >
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                Our Core Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive guidance designed for Indian students — clear,
                reliable, and focused on results.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3} // Prioritize first 3 for LCP
                    />
                  </div>
                  <div className="p-7 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{service.icon}</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                      {service.description}
                    </p>
                    <Link
                      href="/contact"
                      className="text-blue-600 font-medium hover:text-blue-800 transition flex items-center gap-2 text-sm mt-auto"
                    >
                      Learn more →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Our Process (Timeline) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-24 md:py-32 bg-gradient-to-b from-white to-blue-50"
        >
          <div className="container mx-auto px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                How We Guide You
              </h2>
              <p className="text-lg text-gray-600">
                A clear, structured roadmap from your first consultation to
                successfully settling abroad.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative max-w-5xl mx-auto">
              {/* Center Line */}
              <div className="hidden md:block absolute left-1/2 top-0 h-full w-[2px] bg-blue-100 -translate-x-1/2" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  visible: { transition: { staggerChildren: 0.25 } },
                }}
                className="space-y-14"
              >
                {processSteps.map((step, index) => {
                  const isLeft = index % 2 === 0;

                  return (
                    <motion.div
                      key={index}
                      variants={stepVariants}
                      className={`flex flex-col md:flex-row ${
                        isLeft ? "md:justify-start" : "md:justify-end"
                      }`}
                    >
                      <div
                        className={`w-full md:w-[48%] ${
                          isLeft ? "md:pr-10" : "md:pl-10"
                        }`}
                      >
                        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 relative">
                          {/* Step Number */}
                          <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                            {step.step}
                          </div>

                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 mt-4">
                            {step.title}
                          </h3>

                          <p className="text-gray-600 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Test Preparation (Bonus Service) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-20 md:py-28 bg-gray-50"
        >
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Test Preparation Support
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-3xl mx-auto mb-10"
            >
              Meet university language & entrance requirements with confidence.
              We guide you toward reliable coaching for:
            </motion.p>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {[
                "IELTS",
                "TOEFL",
                "PTE",
                "Duolingo",
                "GRE",
                "GMAT",
                "SAT",
                "ACT",
              ].map((test) => (
                <motion.div
                  key={test}
                  variants={cardVariants}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <p className="text-xl font-semibold text-gray-800">{test}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-10 text-gray-600"
            >
              Not included in core package — we connect you with trusted
              partners.
            </motion.p>
          </div>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-20 bg-white border-t border-gray-200"
        >
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                Why Students Choose Khizar Overseas
              </h2>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              <motion.div variants={cardVariants} className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">
                  98%+
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Visa Success Rate
                </h3>
                <p className="text-gray-600">
                  Thanks to thorough preparation and real experience.
                </p>
              </motion.div>
              <motion.div variants={cardVariants} className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">
                  500+
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Students Placed
                </h3>
                <p className="text-gray-600">
                  Hyderabad students now thriving in top global universities.
                </p>
              </motion.div>
              <motion.div variants={cardVariants} className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">
                  100% Free
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Initial Counselling
                </h3>
                <p className="text-gray-600">
                  Transparent advice with no hidden costs upfront.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-20 md:py-28 bg-gray-50"
        >
          <div className="container mx-auto px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </motion.div>

            {/* Accordion */}
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    {/* Question */}
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left font-semibold text-lg text-gray-900"
                    >
                      {faq.question}

                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-2xl text-gray-500"
                      >
                        +
                      </motion.span>
                    </button>

                    {/* Answer */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{
                        height: { duration: 0.35, ease: "easeInOut" },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="bg-gray-900 text-white py-20 text-center"
        >
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto">
              Get your free profile evaluation today — no obligation, just clear
              next steps.
            </p>
            <Link
              href="/contact"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-5 rounded-lg shadow-md transition duration-300 text-lg inline-block"
            >
              Schedule Free Session
            </Link>
            <p className="mt-8 text-gray-400">
              Call/WhatsApp: +91 73299 922309 | +91 90321 76741
              <br />
              Email: info@studyabroad.com
            </p>
          </div>
        </motion.section>
      </div>
    </>
  );
}
