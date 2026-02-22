"use client";

import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { memo, useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

/* ================= ANIMATIONS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* Clean malformed backend arrays safely */
const cleanArray = (arr = []) =>
  arr.map((item) =>
    typeof item === "string" ? item.replace(/[\[\]"]/g, "").trim() : item,
  );

export default function CountryDetail({ country }) {
  const allUniversities = useSelector((state) => state.universities.list);

  if (!country) return null;

  const {
    slug,
    name,
    heroImage,
    visaSuccessRate,
    popularCourses,
    careerOpportunities,
    scholarships,
    eligibilityRequirements,
    whyStudyCards,
  } = country;

  const universities = useMemo(() => {
    if (!allUniversities?.length) return [];

    return allUniversities.filter(
      (uni) => uni.country?.toLowerCase().replace(/\s+/g, "-") === slug,
    );
  }, [allUniversities, slug]);

  return (
    <LazyMotion features={domAnimation}>
      <main className="bg-[#020617] text-white min-h-screen relative">
        {/* HERO */}
        <section className="relative h-[75vh] min-h-[520px] overflow-hidden">
          <Image
            src={heroImage?.url || "/fallback.jpg"}
            alt={`Study in ${name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#020617]" />

          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6">
              <m.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
              >
                Study in {name}
              </m.h1>

              <m.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-6 text-lg md:text-xl text-gray-200 max-w-4xl"
              >
                Visa Success Rate: {visaSuccessRate}%
              </m.p>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_360px] gap-12">
            <div className="space-y-16 lg:space-y-20">
              <ContentBlock
                title="Popular Courses"
                items={cleanArray(popularCourses)}
              />

              <ContentBlock
                title="Career Opportunities"
                items={cleanArray(careerOpportunities)}
              />

              <ContentBlock
                title="Scholarships & Financial Aid"
                items={cleanArray(scholarships)}
              />

              <ContentBlock
                title="Eligibility Requirements"
                items={cleanArray(eligibilityRequirements)}
              />

              {/* WHY STUDY */}
              {whyStudyCards?.length > 0 && (
                <m.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold mb-8">
                    Why Study in {name}?
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {whyStudyCards.map((item, i) => (
                      <m.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-[#0B0F19] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition"
                      >
                        <h3 className="text-xl font-semibold text-[#38BDF8]">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-gray-300 leading-relaxed">
                          {item.description}
                        </p>
                      </m.div>
                    ))}
                  </div>
                </m.div>
              )}
            </div>

            {/* SIDEBAR CTA */}
            <aside className="hidden lg:block sticky top-28 h-fit">
              <CTACard />
            </aside>
          </div>
        </section>

        {/* TOP UNIVERSITIES */}
        {universities.length > 0 && (
          <section className="py-20 lg:py-28 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <m.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold mb-12 text-center lg:text-left"
              >
                Top Universities in {name}
              </m.h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {universities.map((uni, i) => (
                  <m.div
                    key={uni._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#0B0F19] border border-white/10 rounded-2xl p-6 text-center hover:border-[#38BDF8]/50 transition"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {uni.name}
                    </h3>

                    <p className="text-sm text-gray-400 mt-2">
                      Rank #{uni.qsRanking}
                    </p>

                    <Link
                      href={`/universities/${uni.slug}`}
                      className="mt-4 inline-block text-[#38BDF8] hover:underline"
                    >
                      View Details →
                    </Link>
                  </m.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </LazyMotion>
  );
}

/* ================= MEMOIZED COMPONENTS ================= */

const ContentBlock = memo(function ContentBlock({ title, items }) {
  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2 className="text-2xl lg:text-3xl font-bold mb-8">{title}</h2>
      <ul className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <m.li
            key={item}
            whileHover={{ scale: 1.02 }}
            className="bg-[#0B0F19] border border-white/10 rounded-xl p-5 hover:border-[#38BDF8]/30 transition"
          >
            <span className="text-gray-200">{item}</span>
          </m.li>
        ))}
      </ul>
    </m.div>
  );
});

const CTACard = memo(function CTACard() {
  return (
    <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl lg:text-2xl font-bold text-white">
        Book Free Counseling
      </h3>
      <p className="mt-3 text-sm lg:text-base text-gray-300 leading-relaxed">
        Talk to our experts and start your overseas journey today.
      </p>
      <Link
        href="/assessment"
        className="mt-5 block w-full text-center bg-[#38BDF8] text-[#020617] py-4 rounded-xl font-bold text-lg hover:bg-[#22D3EE] transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        Get Started
      </Link>
    </div>
  );
});
