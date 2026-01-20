"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StudentStoryCard from "@/components/StudentCard/StudentStoryCard";
import { stories } from "@/data/testominals";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function SuccessStories() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">
      {/* HERO */}
      <section className="relative py-28 border-b border-white/10 overflow-hidden">
        {/* Background student image */}
        <div className="pointer-events-none absolute inset-0">
          {/* Mask + contrast control */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)]" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Real Students. <br />
            <span className="text-indigo-400">Real Success Stories.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            From dream to destination — explore how Khizar Overseas helped
            students secure admissions, visas, and scholarships at top global
            universities.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "5000+", label: "Students Placed" },
              { value: "98.7%", label: "Visa Success Rate" },
              { value: "250+", label: "Partner Universities" },
              { value: "$50M+", label: "Scholarships Secured" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/5 border border-white/10 py-6"
              >
                <p className="text-3xl font-bold text-indigo-400">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SUCCESS STORIES GRID */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Student Success Highlights
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <StudentStoryCard
                key={story.name}
                story={story}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY STUDENTS TRUST US */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Students & Parents Trust Khizar Overseas
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto mb-12">
            Every success story is backed by ethical counseling, expert
            documentation, and a student-first approach.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Transparent Process & Fees",
              "Expert SOP & Visa Guidance",
              "End-to-End Support Until Arrival",
            ].map((point, i) => (
              <div
                key={i}
                className="rounded-xl bg-[#0B0F19] border border-white/10 p-6"
              >
                <p className="text-lg font-semibold text-indigo-400">{point}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your Success Story Could Be Next
          </h2>

          <p className="text-xl text-gray-400 mb-10">
            Get personalized counseling and a clear roadmap for your study
            abroad journey — absolutely free.
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 transition px-10 py-5 text-lg font-semibold"
          >
            Get Free Assessment
          </Link>

          <p className="mt-6 text-sm text-gray-500">
            Trusted by 5000+ students & parents worldwide
          </p>
        </motion.div>
      </section>
    </main>
  );
}
