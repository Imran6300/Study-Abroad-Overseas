"use client";

import {
  UserCheck,
  Search,
  FileText,
  GraduationCap,
  Stamp,
  Plane,
} from "lucide-react";
import { useEffect, useRef } from "react";

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
  const lineRef = useRef(null);
  const rafRef = useRef(null);

  const smoothProgress = useRef(0);
  const targetProgress = useRef(0);

  useEffect(() => {
    const LERP_SPEED = 0.035;
    const EPSILON = 0.001;
    let isAnimating = false;

    const updateTarget = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const sectionTop = scrollY + rect.top;
      const sectionBottom = sectionTop + rect.height;
      const viewportBottom = scrollY + vh;

      const startOffset = vh * 0.08;
      const endOffset = vh * 0.12;

      const raw =
        (viewportBottom - (sectionTop + startOffset)) /
        (rect.height - startOffset - endOffset);

      let progress = Math.max(0, Math.min(raw, 1));

      if (viewportBottom >= sectionBottom - 20) {
        targetProgress.current = 1;
      } else {
        targetProgress.current = progress;
      }
    };

    const animate = () => {
      smoothProgress.current +=
        (targetProgress.current - smoothProgress.current) * LERP_SPEED;

      if (lineRef.current) {
        lineRef.current.style.height = `${smoothProgress.current * 100}%`;
      }

      if (Math.abs(smoothProgress.current - targetProgress.current) > EPSILON) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isAnimating = false;
        if (lineRef.current) {
          lineRef.current.style.height = `${targetProgress.current * 100}%`;
        }
      }
    };

    const onScroll = () => {
      updateTarget();

      if (!isAnimating) {
        isAnimating = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const onResize = () => {
      updateTarget();

      if (!isAnimating) {
        isAnimating = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    updateTarget();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 px-6 bg-gradient-to-b from-[#0A1124] to-[#0D1428] flex flex-col items-center"
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

      {/* Timeline */}
      <div className="max-w-[1050px] w-full relative">
        {/* Background line */}
        <div className="hidden md:block absolute left-1/2 top-0 h-full w-[4px] bg-[#2A3145] rounded-full" />

        {/* Animated progress line */}
        <div
          ref={lineRef}
          className="hidden md:block absolute left-1/2 top-0 w-[4px] bg-gradient-to-b from-[#4169E1] to-[#32CD32] rounded-full shadow-[0_0_12px_rgba(65,105,225,0.6)] origin-top"
          style={{ height: "0%" }}
        />

        {/* Steps */}
        <div className="flex flex-col gap-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-16 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center md:w-1/2">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg flex items-center justify-center text-[#4169E1]">
                    <Icon size={38} />
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-1/2">
                  <div className="bg-white/[0.07] backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10">
                    <p className="text-sm font-semibold text-[#7BA4FF] mb-1">
                      {step.step}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-[15px] leading-7">
                      {step.desc}
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
