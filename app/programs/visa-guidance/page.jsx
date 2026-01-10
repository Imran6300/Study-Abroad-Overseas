"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function VisaGuidancePage() {
  return (
    <main className="bg-[#0a0f1f] text-white overflow-x-hidden">
      {/* ── HERO ── only this one gets priority */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 md:pt-16 pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=2400&auto=format&fit=crop"
            alt="Happy international students walking on campus"
            fill
            className="object-cover brightness-[0.22] scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            quality={78}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1f]/30 via-transparent to-[#0a0f1f]/80" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-block mb-6 px-6 py-3 bg-blue-600/20 backdrop-blur-md rounded-full text-blue-300 font-medium text-sm tracking-widest uppercase"
          >
            Your Global Education Journey Starts Here
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8"
          >
            Expert Student Visa
            <span className="block mt-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Guidance & Success
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-300/90 leading-relaxed mb-12"
          >
            We turn complex visa processes into clear, confident steps — higher
            approval rates • fewer rejections • real peace of mind
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/contact"
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold text-lg overflow-hidden shadow-xl shadow-blue-900/40 hover:shadow-blue-700/60 transition-all duration-400"
            >
              <span className="relative z-10">Start Your Visa Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </Link>

            <Link
              href="/programs"
              className="px-10 py-5 border-2 border-white/30 rounded-xl font-medium text-lg backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-400"
            >
              Explore Study Programs →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SUCCESS STATS ─────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop"
            alt="Students collaborating in library"
            fill
            className="object-cover brightness-[0.15] opacity-50"
            loading="lazy"
            quality={68}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1f]/90 to-[#0a0f1f]/70" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          {[
            { number: "94%", label: "First-time Approval Rate", icon: "✓" },
            { number: "2.4×", label: "Faster Processing", icon: "⚡" },
            {
              number: "1000+",
              label: "Students Successfully Placed",
              icon: "🎓",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl p-10"
            >
              <div className="text-5xl mb-4 text-blue-400">{stat.icon}</div>
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-300 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5-STEP PROCESS ────────────────────────────────────── */}
      <section className="py-28 relative border-t border-white/10">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1641939872097-8626e3134d88?w=1600&auto=format&fit=crop&q=80"
            alt="Passport, visa documents and laptop"
            fill
            className="object-cover brightness-[0.18] opacity-40"
            loading="lazy"
            quality={68}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1f]/95 via-[#0a0f1f]/85 to-[#0a0f1f]/95" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-center mb-20"
          >
            Clear 5-Step Visa Journey
          </motion.h2>

          <div className="grid md:grid-cols-5 gap-6 md:gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600/40 to-transparent z-0" />

            {[
              "University Offer & CAS",
              "Document Preparation",
              "Online Application",
              "Biometrics & Interview",
              "Visa Grant & Travel",
            ].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="relative bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl p-7 text-center hover:border-blue-500/60 transition-colors group z-10"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-blue-900/40 flex items-center justify-center text-2xl font-bold text-blue-300 group-hover:bg-blue-700/60 transition-colors">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg">{step}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&auto=format&fit=crop"
            alt="Student at airport ready for international study"
            fill
            className="object-cover brightness-[0.20] scale-105"
            loading="lazy"
            quality={72}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1f]/85 via-[#0a0f1f]/70 to-purple-900/30" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-10 leading-tight"
          >
            Stop worrying about visa rejection
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Let experts handle it
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-14"
          >
            Professional guidance • Document checklist • Mock interviews •
            Real-time tracking • Highest success rate
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-900/50 hover:shadow-blue-700/70 hover:scale-[1.03] active:scale-95 transition-all duration-400"
            >
              <span>Book Free Visa Consultation</span>
              <span className="text-2xl">→</span>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-10 text-gray-400 text-sm"
          >
            Most students get a response within 24 hours
          </motion.p>
        </div>
      </section>
    </main>
  );
}
