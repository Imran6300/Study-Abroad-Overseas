"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StudentStoryCard from "@/components/StudentCard/StudentStoryCard";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stories = [
  {
    name: "Rahul Sharma",
    course: "MS in Data Science",
    university: "University of Toronto",
    country: "Canada",
    visa: "Approved in 1st Attempt",
    scholarship: "$25,000",
    year: "2024",
    image: "/student/student1.jpg",
    review:
      "Khizar Overseas guided me from profile evaluation to visa interview. I secured a scholarship and my visa was approved in the first attempt. The entire process was transparent and stress-free.",
  },
  {
    name: "Ayesha Khan",
    course: "MSc Artificial Intelligence",
    university: "Imperial College London",
    country: "UK",
    visa: "Approved",
    scholarship: "£15,000",
    year: "2025",
    image: "/student/student1.jpg",
    review:
      "Their SOP guidance and mock interviews were extremely helpful. I received an offer from Imperial College London with a scholarship. The team was always available for support.",
  },
  {
    name: "Vikram Reddy",
    course: "MBA",
    university: "University of Melbourne",
    country: "Australia",
    visa: "Approved",
    scholarship: "AUD 30,000",
    year: "2024",
    image: "/student/student1.jpg",

    review:
      "From university shortlisting to visa filing, everything was handled professionally. I received a strong scholarship and my visa was approved smoothly.",
  },
  {
    name: "Sneha Patel",
    course: "BS Nursing",
    university: "University of Michigan",
    country: "USA",
    visa: "Approved",
    scholarship: "$18,000",
    year: "2025",
    image: "/student/student1.jpg",

    review:
      "Khizar Overseas helped me choose the right nursing program and prepared me perfectly for documentation and visa. I am grateful for their honest guidance.",
  },
  {
    name: "Arjun Mehta",
    course: "MS Cybersecurity",
    university: "New York University",
    country: "USA",
    visa: "Approved in 1st Attempt",
    scholarship: "$20,000",
    year: "2024",
    image: "/student/student1.jpg",

    review:
      "Their technical program knowledge and SOP structuring made a big difference. I got into NYU with a scholarship and cleared my visa interview confidently.",
  },
  {
    name: "Zara Ali",
    course: "MSc Business Analytics",
    university: "University of Warwick",
    country: "UK",
    visa: "Approved",
    scholarship: "£12,000",
    year: "2025",
    image: "/student/student1.jpg",

    review:
      "I was confused about course selection initially, but the counselors helped me choose the right program. Visa and scholarship support was excellent.",
  },
  {
    name: "Karthik Nair",
    course: "MS Mechanical Engineering",
    university: "RWTH Aachen University",
    country: "Germany",
    visa: "Approved",
    scholarship: "DAAD Partial Funding",
    year: "2024",
    image: "/student/student1.jpg",

    review:
      "Khizar Overseas guided me through APS, university applications, and visa filing. Their Germany-specific knowledge was very accurate and helpful.",
  },
  {
    name: "Neha Verma",
    course: "Master of Public Health (MPH)",
    university: "Johns Hopkins University",
    country: "USA",
    visa: "Approved",
    scholarship: "$22,000",
    year: "2025",
    image: "/student/student1.jpg",

    review:
      "From SOP refinement to interview prep, everything was handled professionally. I secured admission at Johns Hopkins with financial support.",
  },
  {
    name: "Mohammed Faiz",
    course: "BSc Computer Science",
    university: "University of British Columbia",
    country: "Canada",
    visa: "Approved in 1st Attempt",
    scholarship: "$15,000",
    year: "2024",
    image: "/student/student1.jpg",

    review:
      "As an undergraduate student, I needed a lot of guidance. Khizar Overseas supported me throughout and ensured my visa was approved without issues.",
  },
  {
    name: "Pooja Kulkarni",
    course: "MSc Finance",
    university: "London School of Economics",
    country: "UK",
    visa: "Approved",
    scholarship: "£18,000",
    year: "2025",
    image: "/student/student1.jpg",

    review:
      "The counselors helped me build a strong finance-focused SOP and prepared me well for the visa process. I’m thankful for their constant support.",
  },
];

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
