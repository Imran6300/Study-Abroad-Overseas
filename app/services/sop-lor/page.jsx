// app/sop-lor/page.tsx

"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Palette = {
  royalBlue: "#3B82F6",
  limeGreen: "#10B981",
  coral: "#F43F5E",
  softYellow: "#FEF08A",
  lightGray: "#E5E7EB",
  slate: "#475569",
  deepBg: "#0F172A",
};

export default function SopLorPage() {
  return (
    <div
      className="min-h-screen font-sans antialiased relative"
      style={{ backgroundColor: Palette.deepBg, color: Palette.lightGray }}
    >
      {/* Hero - Updated for stronger hook + keywords */}
      <section className="relative py-24 lg:py-40 px-5 sm:px-8 lg:px-16 min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000"
            alt="Student crafting powerful Statement of Purpose SOP for study abroad"
            fill
            className="object-cover brightness-[0.32] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/75 to-[#0F172A]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight text-white"
          >
            Expert SOP & LOR Writing for
            <br />
            <span style={{ color: Palette.royalBlue }}>
              2026 Study Abroad Success
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="text-lg sm:text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90"
          >
            Stand out in ultra-competitive 2026 admissions to USA, Canada, UK,
            Australia & Germany. Get 100% original, tailored SOPs & strong LORs
            that showcase your real story — no templates, no rejections.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <button
              className="px-10 py-6 rounded-2xl font-bold text-xl shadow-2xl transition-all hover:scale-105"
              style={{ backgroundColor: "white", color: "black" }}
            >
              Free SOP Review Now
            </button>
            <button
              className="px-10 py-6 rounded-2xl font-bold text-xl border-2 transition-all hover:scale-105 hover:bg-white/10"
              style={{
                borderColor: Palette.royalBlue,
                color: Palette.royalBlue,
              }}
            >
              Speak to SOP Expert
            </button>
          </motion.div>
        </div>
      </section>

      {/* New Section: The Real Challenge (Educate + Build Trust) */}
      <section className="py-20 lg:py-32 px-5 sm:px-8 lg:px-16 bg-black/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-center mb-16 text-white"
          >
            Why Most 2026 Applications Get Rejected
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-black/40 border border-white/10">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Generic SOPs Full of Clichés
              </h3>
              <p className="opacity-85">
                “I want global exposure” — repeated thousands of times.
                Admissions teams spot templates instantly.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-black/40 border border-white/10">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Weak or Generic LORs
              </h3>
              <p className="opacity-85">
                Short, vague letters from recommenders who barely know you —
                zero impact.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-black/40 border border-white/10">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Ignoring Country-Specific Rules
              </h3>
              <p className="opacity-85">
                USA wants career vision, Canada needs GTE proof, Germany focuses
                on research fit — one-size-fits-all fails.
              </p>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-16 text-xl lg:text-2xl font-medium opacity-90"
          >
            In 2026, top universities reject 70-80% of applications due to poor
            SOP/LOR — not low scores.
          </motion.p>
        </div>
      </section>

      {/* Benefits / Our Edge (Replaced "Different" with stronger value prop) */}
      <section className="py-20 lg:py-32 px-5 sm:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-center mb-16 text-white"
          >
            Why Students Choose Our SOP & LOR Services
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "100% Original & Plagiarism-Free",
                color: Palette.limeGreen,
              },
              {
                text: "University & Visa-Specific Tailoring (USA F1, Canada GTE, UK, etc.)",
                color: Palette.royalBlue,
              },
              {
                text: "Experienced Writers + Unlimited Revisions",
                color: Palette.softYellow,
              },
              {
                text: "Proven 92%+ Admission & Visa Success Rate",
                color: Palette.coral,
              },
              {
                text: "Fast Delivery – 5-7 Days Average",
                color: Palette.royalBlue,
              },
              {
                text: "Free Profile Review + Consultation",
                color: Palette.limeGreen,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border bg-black/25 backdrop-blur-sm hover:bg-black/40 transition-all"
                style={{ borderColor: `${item.color}40` }}
              >
                <div className="text-5xl mb-6" style={{ color: item.color }}>
                  ✓
                </div>
                <p className="text-xl lg:text-2xl font-bold text-white">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Specialization */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-8 lg:px-16 bg-black/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="
        text-3xl sm:text-4xl lg:text-5xl 
        font-black text-center mb-12 sm:mb-16 
        text-white leading-tight
      "
          >
            Country-Specific SOP & LOR Mastery
          </motion.h2>

          {/* Grid */}
          <div
            className="
        grid grid-cols-1 
        xs:grid-cols-2 
        sm:grid-cols-3 
        lg:grid-cols-5 
        gap-4 sm:gap-6
      "
          >
            {["USA", "Canada", "UK", "Australia", "Germany"].map((country) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="
            p-5 sm:p-6 lg:p-8 
            rounded-2xl lg:rounded-3xl 
            bg-black/40 
            border border-white/10 
            text-center 
            backdrop-blur-md
            hover:border-white/20 
            transition-all
          "
              >
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  {country}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <p
            className="
        text-center mt-10 sm:mt-12 
        text-base sm:text-lg 
        text-white/80 
        max-w-3xl mx-auto
        leading-relaxed
      "
          >
            We know exactly what each country looks for — career clarity for
            USA, GTE compliance for Canada, research alignment for Germany, and
            more.
          </p>
        </div>
      </section>

      {/* Final CTA - Stronger, benefit-focused */}
      <section className="relative py-24 lg:py-40 px-5 sm:px-8 lg:px-16 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?auto=format&fit=crop&q=80&w=2000"
            alt="Graduate celebrating study abroad success after strong SOP LOR"
            fill
            className="object-cover brightness-[0.28] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight text-white"
          >
            Turn Your 2026 Dream University
            <br />
            <span style={{ color: Palette.royalBlue }}>Into Reality</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl mb-12 opacity-90 max-w-4xl mx-auto"
          >
            One exceptional SOP & powerful LOR can change rejection to multiple
            offers. Don't leave it to chance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-6 lg:gap-10"
          >
            <button
              className="px-12 py-7 rounded-full font-bold text-2xl shadow-2xl transition-all hover:scale-105"
              style={{ backgroundColor: "white", color: "black" }}
            >
              Start Your SOP & LOR Today
            </button>

            <button
              className="px-12 py-7 rounded-full font-bold text-2xl border-2 transition-all hover:bg-white/10 hover:scale-105"
              style={{
                borderColor: Palette.limeGreen,
                color: Palette.limeGreen,
              }}
            >
              Claim Free Profile + SOP Review
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
