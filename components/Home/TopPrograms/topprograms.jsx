"use client";

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
  },
  {
    icon: BrainCircuit,
    title: "Data Science & Artificial Intelligence",
    short: "Master data analytics, ML, and AI algorithms.",
    desc: "Data Science & AI programs prepare students for machine learning, big data engineering, and automation roles with top-paying salaries worldwide.",
  },
  {
    icon: Briefcase,
    title: "Business & Management (MBA)",
    short: "Leadership programs for tomorrow’s global professionals.",
    desc: "MBA and Business programs build strong leadership and analytical skills with internship pathways in consulting, finance, and global operations.",
  },
  {
    icon: Settings,
    title: "Engineering",
    short: "Build solutions shaping the future of industries.",
    desc: "Engineering students gain hands-on experience in robotics, renewable energy, aerospace, and core engineering fields across top universities.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare & Nursing",
    short: "Join one of the most respected, highest-demand professions.",
    desc: "Nursing and healthcare programs offer global job security, direct placements, and fast-track visa pathways in UK, Canada, and Australia.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    short: "Protect digital systems and fight cybercrime.",
    desc: "Cybersecurity programs train students in ethical hacking, network security, and digital forensics—one of the fastest-growing professions globally.",
  },
];

const TopPrograms = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#F7F9FC] flex flex-col items-center">
      {/* Heading */}
      <div className="text-center mb-14 max-w-3xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#2F4F4F]">
          Top Programs Students Choose
        </h2>

        <p className="text-gray-600 mt-3 text-base md:text-lg">
          Explore in-demand study-abroad programs shaping global career success.
        </p>

        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-[#4169E1] to-[#32CD32] mx-auto mt-4" />
      </div>

      {/* Cards */}
      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
          gap-10 w-full max-w-[1200px]
        "
      >
        {programs.map((program, i) => {
          const Icon = program.icon;

          return (
            <div
              key={i}
              className="
                bg-white 
                rounded-2xl p-8
                shadow-[0_4px_15px_rgba(0,0,0,0.08)]
                hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]
                transition-all duration-300 
                cursor-pointer
                hover:-translate-y-2
                border border-gray-100
              "
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="
                    w-16 h-16 rounded-xl flex items-center justify-center
                    bg-[#4169E110] border border-[#4169E140]
                    text-[#4169E1] shadow-sm
                  "
                >
                  <Icon size={32} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-[#2F4F4F] text-center mb-2">
                {program.title}
              </h3>

              {/* Short highlight */}
              <p className="text-[#4169E1] text-sm font-medium text-center mb-3">
                {program.short}
              </p>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-6 text-center">
                {program.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopPrograms;
