// app/why-choose-us/page.jsx
"use client"; // Required for Framer Motion

import { motion } from "framer-motion";
import Link from "next/link";

// Very subtle fade + lift animation
const sectionFade = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// Slightly staggered for stat cards
const statItem = {
  hidden: { opacity: 0, y: 25 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const colorMap = {
  "blue-500": "text-blue-500",
  "green-500": "text-green-500",
};

export default function WhyChooseUs() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-200">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-900 to-gray-950">
        <motion.div
          className="container mx-auto px-6 md:px-10 max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionFade}
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Why <span className="text-blue-600">Khizar Overseas</span> is the
              Right Choice for Your Study Abroad Dream
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10">
              10+ Years | 5000+ Students Placed | 98.7% Visa Success |
              Transparent & Ethical Guidance
            </p>

            <motion.div
              className="flex flex-wrap justify-center gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  value: "5000+",
                  label: "Students Placed Worldwide",
                  color: "blue-500",
                },
                {
                  value: "98.7%",
                  label: "Visa Approval Rate",
                  color: "green-500",
                },
                {
                  value: "250+",
                  label: "Partner Universities",
                  color: "blue-500",
                },
                {
                  value: "10+",
                  label: "Years of Excellence",
                  color: "green-500",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={statItem}
                  className="bg-gray-800/60 backdrop-blur-sm px-8 py-6 rounded-xl border border-gray-700 text-center min-w-[220px]"
                >
                  <p className={`text-4xl font-bold ${colorMap[stat.color]}`}>
                    {stat.value}
                  </p>
                  <p className="text-gray-400 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Reasons Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionFade}
          >
            What Sets Khizar Overseas Apart as Hyderabad's Most Trusted
            Consultant?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* We keep cards static — they already have nice hover effects */}
            {/* Adding animation to every card would feel too busy */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-600/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-800/40 transition">
                <span className="text-2xl text-blue-500">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Proven Track Record
              </h3>
              <p className="text-gray-400 leading-relaxed">
                10+ years helping students achieve their global education goals
                with consistent, measurable success.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-green-600/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-green-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-800/40 transition">
                <span className="text-2xl text-green-500">✓</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Near-Perfect Visa Success
              </h3>
              <p className="text-gray-400 leading-relaxed">
                98.7% approval rate thanks to expert documentation, mock
                interviews & latest rule updates.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-600/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-800/40 transition">
                <span className="text-2xl text-blue-500">$</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Scholarships up to $50M+
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Helping students secure merit, need-based & university
                scholarships every year.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-600/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-800/40 transition">
                <span className="text-2xl text-blue-500">👥</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                100% Personalized Support
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Profile eval → university shortlist → SOP/LOR → visa → pre/post
                departure – full hand-holding.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-green-600/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-green-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-800/40 transition">
                <span className="text-2xl text-green-500">🌍</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Elite University Network
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Direct partnerships with 250+ top institutions – MIT, Stanford,
                Oxford, Toronto, Melbourne & more.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-600/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-800/40 transition">
                <span className="text-2xl text-blue-500">4.9</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Loved by Students
              </h3>
              <p className="text-gray-400 leading-relaxed">
                4.9★ average rating – transparent, ethical & student-first
                approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey / Timeline */}
      <section className="py-20 bg-gray-900/50">
        <motion.div
          className="container mx-auto px-6 md:px-10 max-w-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Our Journey – A Decade of Transforming Lives
          </h2>

          <div className="space-y-12 md:space-y-16 relative before:absolute before:inset-0 before:left-1/2 before:w-1 before:bg-gray-700 before:hidden md:before:block">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2 text-right">
                <p className="text-blue-400 font-bold text-xl">2015</p>
                <h3 className="text-2xl font-semibold mt-2">
                  Founded in Hyderabad
                </h3>
                <p className="text-gray-400 mt-3">
                  Started with a mission to make global education accessible &
                  stress-free.
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 font-bold text-2xl border-4 border-blue-600 hidden md:flex">
                1
              </div>
              <div className="md:w-1/2"></div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
              <div className="md:w-1/2 text-left">
                <p className="text-blue-400 font-bold text-xl">2018–2022</p>
                <h3 className="text-2xl font-semibold mt-2">
                  Rapid Growth & 2000+ Placements
                </h3>
                <p className="text-gray-400 mt-3">
                  Expanded team, built strong university ties, achieved
                  consistent high visa success.
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 font-bold text-2xl border-4 border-blue-600 hidden md:flex">
                2
              </div>
              <div className="md:w-1/2"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2 text-right">
                <p className="text-blue-400 font-bold text-xl">2023–Today</p>
                <h3 className="text-2xl font-semibold mt-2">
                  5000+ Dreams Fulfilled
                </h3>
                <p className="text-gray-400 mt-3">
                  98.7% visa rate, $50M+ scholarships secured, 4.9★ student
                  satisfaction.
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 font-bold text-2xl border-4 border-blue-600 hidden md:flex">
                3
              </div>
              <div className="md:w-1/2"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <motion.div
          className="container mx-auto px-6 md:px-10 max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            What Our Students Say
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <p className="text-gray-300 italic mb-6">
                "Khizar Overseas made my Canada PR dream come true. Visa in
                first attempt + scholarship! Best team in Hyderabad."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-white">Rahul Sharma</p>
                  <p className="text-gray-500 text-sm">
                    University of Toronto, 2024
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <p className="text-gray-300 italic mb-6">
                "98% visa success is real! Perfect SOP guidance & mock
                interviews helped me get into Imperial College London."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-white">Ayesha Khan</p>
                  <p className="text-gray-500 text-sm">
                    MSc Data Science, 2025
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <p className="text-gray-300 italic mb-6">
                "Transparent fees, 24/7 support & $25,000 scholarship. Couldn’t
                ask for better consultants!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-white">Vikram Reddy</p>
                  <p className="text-gray-500 text-sm">
                    University of Melbourne, 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted Partners */}
      <section className="py-16 bg-gray-900/70">
        <motion.div
          className="container mx-auto px-6 md:px-10 max-w-6xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
            Trusted by Top Universities Worldwide
          </h2>
          <p className="text-gray-400 mb-10 max-w-3xl mx-auto">
            We maintain strong partnerships with 250+ leading institutions
            across USA, UK, Canada, Australia, Germany, Ireland, New Zealand &
            more.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 opacity-80">
            <div className="bg-gray-800 h-20 rounded-lg flex items-center justify-center text-gray-500">
              MIT
            </div>
            <div className="bg-gray-800 h-20 rounded-lg flex items-center justify-center text-gray-500">
              Stanford
            </div>
            <div className="bg-gray-800 h-20 rounded-lg flex items-center justify-center text-gray-500">
              Oxford
            </div>
            <div className="bg-gray-800 h-20 rounded-lg flex items-center justify-center text-gray-500">
              Toronto
            </div>
            <div className="bg-gray-800 h-20 rounded-lg flex items-center justify-center text-gray-500">
              Imperial
            </div>
            <div className="bg-gray-800 h-20 rounded-lg flex items-center justify-center text-gray-500">
              + 244 more
            </div>
          </div>
        </motion.div>
      </section>

      {/* Certifications & Badges */}
      <section className="py-16 bg-gray-900/50">
        <motion.div
          className="container mx-auto px-6 md:px-10 max-w-6xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
            Certified Excellence – Our Accreditations & Awards
          </h2>
          <p className="text-gray-400 mb-10 max-w-3xl mx-auto">
            As certified study abroad consultants in Hyderabad, we're recognized
            by global bodies for ethical practices, high success rates, and
            student satisfaction. These badges ensure you're partnering with a
            proven leader.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-600/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-800/40 transition mx-auto">
                <span className="text-2xl text-blue-500">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                ICEF Certified Agent
              </h3>
              <p className="text-gray-500 text-sm">
                Global standard for ethical recruitment & training
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-green-600/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-800/40 transition mx-auto">
                <span className="text-2xl text-green-500">📜</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                British Council Partner
              </h3>
              <p className="text-gray-500 text-sm">
                Official advisor for UK study visas & programs
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-600/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-800/40 transition mx-auto">
                <span className="text-2xl text-blue-500">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                IDP Education Affiliate
              </h3>
              <p className="text-gray-500 text-sm">
                Authorized for IELTS & global university placements
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-green-600/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-800/40 transition mx-auto">
                <span className="text-2xl text-green-500">🎖️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Top Consultant Award 2024
              </h3>
              <p className="text-gray-500 text-sm">
                Recognized by Education Times for 98.7% success
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <motion.div
          className="container mx-auto px-6 md:px-10 max-w-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <details className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none">
                Is Khizar Overseas completely transparent with fees?
              </summary>
              <p className="mt-4 text-gray-400">
                Yes – no hidden charges. We explain every cost upfront and offer
                value-based packages with no surprises.
              </p>
            </details>

            <details className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none">
                How high is your actual visa success rate?
              </summary>
              <p className="mt-4 text-gray-400">
                98.7% across all countries (last 3 years average). We achieve
                this through thorough preparation & updates on rules.
              </p>
            </details>

            <details className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none">
                Do you help with scholarships?
              </summary>
              <p className="mt-4 text-gray-400">
                Absolutely. We identify & apply for scholarships worth millions
                every year – many students get 20–100% funding.
              </p>
            </details>

            <details className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none">
                What makes you different from other consultants in Hyderabad?
              </summary>
              <p className="mt-4 text-gray-400">
                Ethical practices, real results (not just promises), 24/7
                availability, strong university network & student-first
                approach.
              </p>
            </details>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-950">
        <motion.div
          className="container mx-auto px-6 md:px-10 max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">
            Don’t Just Dream About Studying Abroad – Make It Happen
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Book your FREE 1-on-1 counseling session today. No pressure, just
            honest guidance tailored to your profile & goals.
          </p>
          <Link
            href="/assessment"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl px-12 py-6 rounded-full transition shadow-xl shadow-blue-900/40 transform hover:scale-105"
          >
            Get Free Expert Consultation Now
          </Link>
          <p className="mt-6 text-gray-500">
            5000+ students already trusted us – your success story starts here.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
