"use client";

import {
  GraduationCap,
  Wallet,
  Sparkles,
  Landmark,
  FileCheck,
  HandCoins,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import FadeContent from "@/components/Animations/FadeContent";

// ⭐ Stats with animated numbers
const stats = [
  {
    number: 15,
    suffix: " Cr+",
    label: "Total Scholarships Secured",
    isCurrency: true,
  },
  { number: 93, suffix: "%", label: "Scholarship Success Rate" },
  { number: 5000, suffix: "+", label: "Students Guided" },
  { number: 25, suffix: "+ Countries", label: "Funding Support Options" },
];

// ⭐ Scholarship Cards
const scholarships = [
  {
    icon: GraduationCap,
    title: "Merit-Based Scholarships",
    desc: "Awarded to high-performing students based on academic excellence, test scores, and exceptional achievements.",
    points: [
      "Profile evaluation & eligibility mapping",
      "SOP improvements tailored for merit awards",
      "Priority university submission planning",
    ],
  },
  {
    icon: Wallet,
    title: "Need-Based Financial Support",
    desc: "Financial assistance for students requiring help with tuition fees or living expenses.",
    points: [
      "Complete financial background review",
      "Supporting documents & letters",
      "Budget planning & expense structuring",
    ],
  },
  {
    icon: Landmark,
    title: "Country-Specific Scholarships",
    desc: "Scholarships for destinations like UK, US, Canada, Germany & Australia.",
    points: [
      "Matching student profile to country awards",
      "Assistance for Chevening, DAAD, GREAT & more",
      "End-to-end application support",
    ],
  },
  {
    icon: FileCheck,
    title: "University-Funded Awards",
    desc: "Automatic & competitive awards offered directly by universities.",
    points: [
      "Curated list of eligible universities",
      "Review of SOP/LOR for funding eligibility",
      "Submission tracking & updates",
    ],
  },
  {
    icon: HandCoins,
    title: "Education Loans & Financial Planning",
    desc: "Guidance for secured, unsecured loans, NBFC funding & bank documentation.",
    points: [
      "Loan comparison & EMI mapping",
      "Document checklist support",
      "Forex, travel & living cost planning",
    ],
  },
  {
    icon: Sparkles,
    title: "Personalized Funding Roadmap",
    desc: "Your financial mentor creates a complete funding plan, saving up to ₹25 Lakhs.",
    points: [
      "Hybrid plan: scholarships + loan strategy",
      "Part-time work & earning guidance",
      "Full breakdown of costs for transparency",
    ],
  },
];

// ⭐ FAQ Item
function FAQItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <FadeContent blur>
      <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-5 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={open}
        >
          <span className="text-lg font-semibold text-[#1A2433]">{item.q}</span>
          <span
            className={`
              text-[#4169E1] text-2xl font-bold transition-transform duration-300
              ${open ? "rotate-45" : ""}
            `}
          >
            +
          </span>
        </button>

        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${open ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <p className="text-gray-700 text-sm leading-6">{item.a}</p>
        </div>
      </div>
    </FadeContent>
  );
}

export default function ScholarshipsFunding() {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  // ⭐ Count-Up Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        stats.forEach((stat, index) => {
          let start = 0;
          const end = stat.number;
          const duration = 2000; // Slightly longer for smoother feel
          const increment = end / (duration / 16);

          const animate = () => {
            start += increment;
            if (start < end) {
              setAnimatedValues((prev) => {
                const updated = [...prev];
                updated[index] = Math.floor(start);
                return updated;
              });
              requestAnimationFrame(animate);
            } else {
              setAnimatedValues((prev) => {
                const updated = [...prev];
                updated[index] = end;
                return updated;
              });
            }
          };

          animate();
        });
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-20 md:py-28 px-6 relative bg-gradient-to-b from-[#F3F8FF] to-[#E8F1FF] overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#4169E1]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-[#32CD32]/10 rounded-full blur-3xl"></div>

      {/* ⭐ Heading */}
      <FadeContent blur>
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A2433]">
            Scholarships & Funding Support
          </h2>

          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            Our expert funding team helps students reduce their study-abroad
            cost through scholarships, grants, and financial aid — ensuring
            finances never stop your dream.
          </p>

          <div className="w-32 h-[4px] bg-gradient-to-r from-[#4169E1] to-[#32CD32] mx-auto mt-6 rounded-full" />
        </div>
      </FadeContent>

      {/* ⭐ Stats Section */}
      <FadeContent blur duration={700}>
        <div
          ref={statsRef}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 relative z-10"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="
                bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl
                py-8 px-4 flex flex-col items-center justify-center text-center
                shadow-[0_6px_25px_rgba(0,0,0,0.08)]
              "
            >
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#4169E1]">
                {s.isCurrency ? "₹" : ""}
                {animatedValues[i]}
                {s.suffix}
              </h3>
              <p className="text-gray-700 font-medium mt-2 text-sm md:text-base">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </FadeContent>

      {/* ⭐ CTA 1 */}
      <FadeContent blur>
        <div className="text-center mb-20 md:mb-24 relative z-10">
          <button
            className="
              px-10 py-4 rounded-full font-semibold text-white text-lg
              bg-gradient-to-r from-[#4169E1] to-[#32CD32]
              shadow-[0_10px_30px_rgba(65,105,225,0.3)]
              hover:shadow-[0_15px_40px_rgba(65,105,225,0.45)]
              transition-all duration-300 hover:scale-105 active:scale-100
            "
          >
            Check Your Scholarship Eligibility →
          </button>
          <p className="text-gray-600 mt-3 text-sm">
            Takes only 30 seconds • No charges • Instant result
          </p>
        </div>
      </FadeContent>

      {/* ⭐ Scholarship Cards - NOW WITH FIXED & EQUAL HEIGHT */}
      <div className="max-w-[1350px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 px-4">
        {scholarships.map((item, i) => {
          const Icon = item.icon;
          return (
            <FadeContent key={i} blur delay={i * 100}>
              <div
                className="
                  group bg-white/60 backdrop-blur-xl border border-white/30
                  rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                  transition-all duration-500 hover:-translate-y-3
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                  flex flex-col h-full min-h-[520px]
                "
              >
                {/* Icon */}
                <div className="flex justify-center mb-8">
                  <div
                    className="
                      w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4169E1] to-[#32CD32]
                      flex items-center justify-center text-white 
                      shadow-[0_10px_25px_rgba(65,105,225,0.35)]
                      group-hover:scale-110 transition-transform duration-500
                    "
                  >
                    <Icon size={40} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-[#1A2433] text-center mb-4">
                  {item.title}
                </h3>

                {/* Description - takes available space */}
                <p className="text-gray-700 text-sm md:text-base text-center leading-relaxed mb-8 flex-grow">
                  {item.desc}
                </p>

                {/* Points List - pushed to bottom */}
                <ul className="space-y-3 mt-auto">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#32CD32] text-xl font-bold mt-0.5">
                        •
                      </span>
                      <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeContent>
          );
        })}
      </div>

      {/* Footer Note */}
      <FadeContent blur delay={300}>
        <div className="text-center max-w-3xl mx-auto mt-20 text-gray-700 relative z-10">
          <p className="leading-relaxed text-base md:text-lg">
            From fully funded opportunities to tuition reductions and financial
            planning — we ensure every student gets maximum financial advantage.
          </p>
          <p className="mt-4 font-semibold text-[#4169E1] text-lg">
            Your dedicated funding mentor will guide you throughout.
          </p>
        </div>
      </FadeContent>

      {/* ⭐ FAQ Section */}
      <FadeContent blur delay={400}>
        <div className="max-w-3xl mx-auto mt-24 relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-[#1A2433] mb-12">
            Frequently Asked Questions
          </h3>

          {[
            {
              q: "How do I know if I qualify for scholarships?",
              a: "We analyze your academics, SOP, country, and course against 250+ global scholarships to find your best matches.",
            },
            {
              q: "Can I get scholarships without high academic scores?",
              a: "Yes — need-based, diversity-based, and course-specific scholarships do not require high marks.",
            },
            {
              q: "Do you help with education loans?",
              a: "Yes! We assist with secured/unsecured loans, NBFCs, bank documentation, and affordability planning.",
            },
            {
              q: "How much can I save through your funding support?",
              a: "Students commonly save ₹1–25 Lakhs through scholarships, waivers, and financial optimization.",
            },
            {
              q: "Is the scholarship process complicated?",
              a: "We simplify everything — eligibility checks, documentation, SOP/LOR preparation, applications, and follow-ups.",
            },
          ].map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </div>
      </FadeContent>

      {/* ⭐ Final CTA */}
      <FadeContent blur delay={500}>
        <div className="text-center mt-20 relative z-10">
          <button
            className="
              px-12 py-5 rounded-full text-white text-xl font-semibold
              bg-gradient-to-r from-[#4169E1] to-[#32CD32]
              shadow-[0_15px_40px_rgba(65,105,225,0.35)]
              hover:shadow-[0_20px_55px_rgba(65,105,225,0.5)]
              transition-all duration-300 hover:scale-105 active:scale-100
            "
          >
            Book Your Free Funding Consultation →
          </button>

          <p className="text-gray-600 mt-4 text-sm md:text-base">
            Limited slots • Completely free • 1-on-1 Expert Guidance
          </p>
        </div>
      </FadeContent>
    </section>
  );
}
