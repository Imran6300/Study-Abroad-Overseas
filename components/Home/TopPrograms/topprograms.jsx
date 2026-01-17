"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  BrainCircuit,
  Briefcase,
  Settings,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

const programs = [
  {
    icon: Laptop,
    title: "Computer Science & IT",
    short: "Future-proof careers in software, AI & cybersecurity.",
    desc: "CS is the #1 choice for overseas students, offering pathways in AI, cloud computing, and full-stack development with high global demand.",
    slug: "engineering",
  },
  {
    icon: BrainCircuit,
    title: "Data Science & Artificial Intelligence",
    short: "Master data analytics, ML, and AI algorithms.",
    desc: "Programs prepare students for machine learning, big data engineering, and automation roles with top-paying salaries worldwide.",
    slug: "engineering",
  },
  {
    icon: Briefcase,
    title: "Business & Management (MBA)",
    short: "Leadership programs for global professionals.",
    desc: "MBA programs build leadership and analytical skills with internship pathways in consulting, finance, and operations.",
    slug: "business",
  },
  {
    icon: Settings,
    title: "Engineering",
    short: "Build solutions shaping the future.",
    desc: "Hands-on learning in robotics, renewable energy, aerospace, and core engineering fields.",
    slug: "engineering",
  },
  {
    icon: HeartPulse,
    title: "Healthcare & Nursing",
    short: "High-demand global healthcare careers.",
    desc: "Healthcare programs offer job security, fast-track visas, and placements in UK, Canada, and Australia.",
    slug: "healthcare",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    short: "Protect digital systems worldwide.",
    desc: "Cybersecurity trains students in ethical hacking, network defense, and digital forensics.",
    slug: "engineering",
  },
];

const TopPrograms = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#F7F9FC]">
      {/* Heading */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#2F4F4F]">
          Top Programs Students Choose
        </h2>
        <p className="text-gray-600 mt-3 text-base md:text-lg">
          Explore in-demand study abroad programs shaping global career success.
        </p>
        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-[#4169E1] to-[#32CD32] mx-auto mt-4" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1200px] mx-auto">
        {programs.map((program, i) => {
          const Icon = program.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link href={`/courses/${program.slug}`} className="block h-full">
                <div
                  className="
                    h-[380px]
                    bg-white rounded-2xl p-8
                    border border-gray-100
                    shadow-[0_6px_20px_rgba(0,0,0,0.08)]
                    hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)]
                    hover:-translate-y-2
                    transition-all duration-300
                    cursor-pointer
                    flex flex-col
                  "
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-[#4169E110] border border-[#4169E140] text-[#4169E1] shadow-sm">
                      <Icon size={30} />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#2F4F4F] text-center mb-2">
                    {program.title}
                  </h3>

                  <p className="text-[#4169E1] text-sm font-medium text-center mb-4">
                    {program.short}
                  </p>

                  <p className="text-gray-600 text-sm leading-6 text-center flex-grow">
                    {program.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TopPrograms;
