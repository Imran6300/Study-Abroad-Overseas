"use client";

import {
  UserCheck,
  Search,
  FileText,
  GraduationCap,
  Stamp,
  Plane,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    icon: UserCheck,
    step: "Step 1",
    title: "Personalized Counseling",
    desc: "We begin with a 1-on-1 counseling session to deeply understand your goals, academic background, financial range, and country preferences.",
  },
  {
    icon: Search,
    step: "Step 2",
    title: "University Shortlisting",
    desc: "Based on your profile, we curate a university list considering rankings, course modules, budget, and career outcomes.",
  },
  {
    icon: FileText,
    step: "Step 3",
    title: "Application & SOP Assistance",
    desc: "We help you craft strong SOPs, LORs, resumes, essays, and submit applications with accurate documentation.",
  },
  {
    icon: GraduationCap,
    step: "Step 4",
    title: "Scholarship & Financial Guidance",
    desc: "We help students maximize scholarship chances and financial planning, saving ₹1–25 Lakhs on average.",
  },
  {
    icon: Stamp,
    step: "Step 5",
    title: "Visa Preparation & Filing",
    desc: "Mock interviews, DS-160 guidance, fund documentation, and visa filing handled by our experts.",
  },
  {
    icon: Plane,
    step: "Step 6",
    title: "Pre-Departure & Post-Arrival Support",
    desc: "Accommodation, travel support, forex, SIM cards, and continued guidance even after arrival.",
  },
];

const StudyAbroadProcess = () => {
  const sectionRef = useRef(null);
  const animRef = useRef(null); // requestAnimationFrame id
  const smoothRef = useRef(0); // current smooth progress (0..1)
  const targetRef = useRef(0); // target progress (0..1)
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    // lerp parameters — adjust for slower/faster smoothing
    const LERP_FACTOR = 0.08; // smaller = slower smoothing
    const CHECK_ON_RESIZE = () => updateProgress();

    const updateProgress = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;

      // Calculate absolute positions (page coordinates)
      const sectionTopAbs = scrollY + rect.top;
      const sectionBottomAbs = sectionTopAbs + rect.height;
      const viewportBottomAbs = scrollY + windowHeight;

      // start / end offsets to tweak when animation begins/ends relative to viewport
      const startOffset = windowHeight * 0.15;
      const endOffset = windowHeight * 0.25;

      // progress measured by how much of the section is "covered" from top offset
      const rawProgress =
        (viewportBottomAbs - (sectionTopAbs + startOffset)) /
        (rect.height - startOffset - endOffset);
      let progress = Math.max(0, Math.min(rawProgress, 1));

      // If viewport bottom reached (user reached bottom of section) -> force target = 1
      const bottomTolerance = 20; // px tolerance
      if (viewportBottomAbs >= sectionBottomAbs - bottomTolerance) {
        targetRef.current = 1;
      } else {
        targetRef.current = progress;
      }
    };

    const onScroll = () => updateProgress();

    // animation loop: smooth current value toward target and set state
    const rafLoop = () => {
      // interpolate toward targetRef.current
      smoothRef.current =
        smoothRef.current * (1 - LERP_FACTOR) + targetRef.current * LERP_FACTOR;
      // clamp tiny numeric errors
      smoothRef.current = Math.max(0, Math.min(1, smoothRef.current));

      setLineHeight(Math.round(smoothRef.current * 10000) / 100); // two decimals

      animRef.current = requestAnimationFrame(rafLoop);
    };

    // initial measure
    updateProgress();
    // start RAF loop
    animRef.current = requestAnimationFrame(rafLoop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", CHECK_ON_RESIZE);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", CHECK_ON_RESIZE);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
    w-full py-24 px-6 
    bg-gradient-to-b from-[#0A1124] to-[#0D1428]
    flex flex-col items-center
  "
    >
      {/* Heading */}
      <div className="text-center mb-16 max-w-3xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
          Your Study Abroad Journey — Step by Step
        </h2>

        <p className="text-gray-300 mt-3 text-base md:text-lg">
          A complete guided roadmap from your first counseling session to your
          safe arrival abroad.
        </p>

        <div className="w-28 h-[3px] rounded-full bg-gradient-to-r from-[#4169E1] to-[#32CD32] mx-auto mt-5" />
      </div>

      {/* Timeline Container */}
      <div className="max-w-[1050px] w-full relative">
        {/* Static Gray Line */}
        <div className="hidden md:block absolute left-1/2 top-0 h-full w-[4px] bg-[#2A3145] rounded-full"></div>

        {/* Animated Filling Line */}
        <div
          className="
        hidden md:block absolute left-1/2 top-0 w-[4px] 
        bg-gradient-to-b from-[#4169E1] to-[#32CD32]
        rounded-full shadow-[0_0_12px_rgba(65,105,225,0.6)]
      "
          style={{ height: `${lineHeight}%` }}
        />

        {/* Steps */}
        <div className="flex flex-col gap-20">
          {steps.map((item, i) => {
            const Icon = item.icon;
            const isLeft = i % 2 === 0;

            return (
              <div
                key={i}
                className={`
              flex flex-col md:flex-row items-center gap-6 md:gap-16
              ${isLeft ? "md:flex-row-reverse" : ""}
            `}
              >
                {/* Icon */}
                <div className="flex justify-center md:w-1/2">
                  <div
                    className="
                  w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl 
                  border border-white/20
                  shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                  flex items-center justify-center text-[#4169E1]
                "
                  >
                    <Icon size={38} />
                  </div>
                </div>

                {/* Card */}
                <div className="md:w-1/2">
                  <div
                    className="
                  bg-white/[0.07] backdrop-blur-xl
                  p-8 rounded-2xl 
                  shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                  hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]
                  transition-all duration-300 
                  border border-white/10
                "
                  >
                    <p className="text-sm font-semibold text-[#7BA4FF] mb-1 tracking-wide">
                      {item.step}
                    </p>

                    <h3 className="text-2xl font-bold text-white mb-3">
                      {item.title}
                    </h3>

                    <p className="text-gray-300 text-[15px] leading-7">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudyAbroadProcess;
