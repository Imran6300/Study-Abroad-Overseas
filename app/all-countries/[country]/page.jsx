"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { memo } from "react";
import Link from "next/link";

/* ================= ANIMATIONS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ================= STATIC DATA ================= */
const COUNTRY_PAGE_DATA = {
  hero: {
    description:
      "Explore top universities, popular courses, tuition fees, living costs, work opportunities, and visa requirements.",
  },

  heroImages: {
    usa: { src: "/countries/usa.jpg", position: "50% 20%" },
    canada: { src: "/countries/canada.jpg", position: "50% 60%" },
    uk: { src: "/countries/uk.jpg", position: "50% 55%" },
    australia: { src: "/countries/australia.jpg", position: "50% 55%" },
    germany: { src: "/countries/germany.jpg", position: "50% 60%" },
    france: { src: "/countries/france.jpg", position: "50% 45%" },
    china: { src: "/countries/china.jpg", position: "50% 50%" },
    italy: { src: "/countries/italy.jpg", position: "50% 55%" },
    ireland: { src: "/countries/ireland.jpg", position: "50% 55%" },
    new_zeland: { src: "/countries/newzeland.jpg", position: "50% 50%" }, ///this has problem
    netherlands: { src: "/countries/netherland.jpg", position: "50% 50%" },
    singapore: { src: "/countries/singapore.jpg", position: "50% 50%" },
    dubai: { src: "/countries/dubai.jpg", position: "50% 50%" },
  },

  popularCourses: [
    "Computer Science & IT",
    "Business & Management",
    "Engineering",
    "Data Science & AI",
    "Healthcare & Medicine",
  ],

  careers: [
    "Software Engineer",
    "Data Analyst",
    "Business Consultant",
    "Research Scientist",
    "Healthcare Professional",
  ],

  scholarships: [
    "Merit-based scholarships",
    "Government-funded programs",
    "University-specific grants",
    "Need-based financial aid",
  ],

  eligibility: [
    "Minimum 60%–70% academic score",
    "IELTS / TOEFL / PTE (as required)",
    "Statement of Purpose (SOP)",
    "Letters of Recommendation (LORs)",
  ],

  whyStudy: [
    {
      title: "Globally Recognized Degrees",
      description:
        "Degrees are internationally recognized, opening doors to global career opportunities.",
    },
    {
      title: "High Quality Education",
      description:
        "Universities emphasize research, innovation, and industry-relevant curriculum.",
    },
    {
      title: "International Exposure",
      description:
        "Study in a multicultural environment with students from across the world.",
    },
    {
      title: "Strong Career Outcomes",
      description:
        "Graduates benefit from strong employability, internships, and post-study work options.",
    },
  ],

  universitiesByCountry: {
    usa: [
      "Harvard University",
      "Stanford University",
      "Massachusetts Institute of Technology (MIT)",
      "University of California, Berkeley",
    ],
    uk: [
      "University of Oxford",
      "University of Cambridge",
      "Imperial College London",
      "London School of Economics",
    ],
    canada: [
      "University of Toronto",
      "University of British Columbia",
      "McGill University",
      "University of Alberta",
    ],
    australia: [
      "University of Melbourne",
      "Australian National University",
      "University of Sydney",
      "Monash University",
    ],
    germany: [
      "Technical University of Munich",
      "Heidelberg University",
      "RWTH Aachen University",
      "Humboldt University of Berlin",
    ],
    china: [
      "Tsinghua University",
      "Peking University",
      "Fudan University",
      "Shanghai Jiao Tong University",
    ],
    france: [
      "Sorbonne University",
      "Université Paris-Saclay",
      "Sciences Po",
      "École Polytechnique",
    ],
    italy: [
      "University of Bologna",
      "Sapienza University of Rome",
      "Politecnico di Milano",
      "University of Milan",
    ],
  },

  cta: {
    title: "Free Expert Guidance",
    description:
      "Talk to our counsellors for university shortlisting, scholarships, and visa assistance.",
    buttonText: "Book Free Consultation",
  },
};

export default function CountryDetail() {
  const params = useParams();
  const country = Array.isArray(params.country)
    ? params.country[0]
    : params.country;
  const slug = (country ?? "usa").toLowerCase();
  const countryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const data = COUNTRY_PAGE_DATA;
  const hero = data.heroImages[slug] || data.heroImages.usa;
  const universities = data.universitiesByCountry[slug];

  return (
    <LazyMotion features={domAnimation}>
      <main className="bg-[#020617] text-white min-h-screen relative">
        {/* HERO */}
        <section className="relative h-[75vh] min-h-[520px] overflow-hidden">
          <Image
            src={hero.src}
            alt={`Study in ${countryName}`}
            fill
            priority
            sizes="100vw"
            placeholder="blur" // Instant low-quality preview
            blurDataURL="/countries/placeholder.jpg" // Optional: add a tiny base64 or let Next.js auto-generate
            className="object-cover"
            style={{ objectPosition: hero.position }}
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
                Study in {countryName}
              </m.h1>
              <m.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-6 text-lg md:text-xl text-gray-200 max-w-4xl"
              >
                {data.hero.description} in {countryName}.
              </m.p>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT + SIDEBAR CTA */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_360px] gap-12">
            <div className="space-y-16 lg:space-y-20">
              <ContentBlock
                title="Popular Courses"
                items={data.popularCourses}
              />
              <ContentBlock title="Career Opportunities" items={data.careers} />
              <ContentBlock
                title="Scholarships & Financial Aid"
                items={data.scholarships}
              />
              <ContentBlock
                title="Eligibility Requirements"
                items={data.eligibility}
              />

              {/* WHY STUDY */}
              <m.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">
                  Why Study in {countryName}?
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {data.whyStudy.map((item, i) => (
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
            </div>

            {/* DESKTOP SIDEBAR CTA */}
            <aside className="hidden lg:block sticky top-28 h-fit">
              <CTACard data={data.cta} />
            </aside>
          </div>
        </section>

        {/* TOP UNIVERSITIES */}
        {universities && (
          <section className="py-20 lg:py-28 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <m.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold mb-12 text-center lg:text-left"
              >
                Top Universities in {countryName}
              </m.h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {universities.map((uni, i) => (
                  <m.div
                    key={uni}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#0B0F19] border border-white/10 rounded-2xl p-8 text-center hover:border-[#38BDF8]/50 transition"
                  >
                    <p className="font-medium text-lg">{uni}</p>
                  </m.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* MOBILE STICKY CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent">
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <CTACard data={data.cta} mobile />
          </div>
        </div>
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

const CTACard = memo(function CTACard({ data, mobile = false }) {
  return (
    <div
      className={`${
        mobile
          ? "bg-gradient-to-r from-[#38BDF8]/20 to-[#0EA5E9]/20 backdrop-blur-lg border border-[#38BDF8]/30 rounded-2xl p-5 shadow-2xl"
          : "bg-[#0B0F19] border border-white/10 rounded-2xl p-6"
      }`}
    >
      <h3 className="text-xl lg:text-2xl font-bold text-white">{data.title}</h3>
      <p className="mt-3 text-sm lg:text-base text-gray-300 leading-relaxed">
        {data.description}
      </p>
      <Link
        href="/assessment"
        className="mt-5 block w-full text-center bg-[#38BDF8] text-[#020617] py-4 rounded-xl font-bold text-lg hover:bg-[#22D3EE] transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        {data.buttonText}
      </Link>
    </div>
  );
});
