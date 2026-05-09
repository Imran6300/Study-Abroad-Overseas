"use client";

import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { memo, useMemo } from "react";
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

/* Clean malformed backend arrays safely */

export default function CountryDetail({ country, universities = [] }) {
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

  // ── Rich, natural, long-form FAQs for better rich results + user value ──
  const faqs = [
    {
      question: `Is ${name} a good choice for Indian students in 2026?`,
      answer: `${name} is still one of the top study abroad destinations for Indian students in 2026. It offers globally ranked universities, generous post-study work visas (2–5 years in most cases), high student visa success rates (${visaSuccessRate}% for Indian applicants based on recent trends), part-time work rights (20–40 hours/week), strong job markets in IT, engineering, healthcare, business & data science, plus safe, multicultural cities with English as the primary language. Thousands of Indian students enroll every year and many secure PR pathways. Contact our Hyderabad experts for free profile evaluation and university shortlisting.`,
    },
    {
      question: `What is the student visa success rate for ${name}?`,
      answer: `The current student visa success rate for ${name} is around ${visaSuccessRate}% for Indian applicants (based on recent immigration data and consultancy reports). Approval chances improve significantly with strong academics (65–85%+), sufficient financial proof, clear Statement of Purpose, genuine intent to return home after studies, and complete documentation. Our team in Hyderabad specializes in visa guidance, mock interviews, and application strengthening to maximize your chances.`,
    },
    {
      question: `Which courses are most popular for international students in ${name}?`,
      answer: `The most popular and in-demand courses in ${name} for international students include ${(popularCourses || []).join(", ")}. These programs are highly employable, often come with scholarship options, co-op/internship opportunities, and clear post-study work visa pathways. Many lead to high-paying jobs in global companies. We help Indian students choose the right course based on their background, budget, and career goals.`,
    },
    {
      question: `What scholarships are available for Indian students in ${name}?`,
      answer: `Indian students can apply for a wide range of scholarships in ${name}, including ${(scholarships || []).slice(0, 5).join(", ")} and many university-specific, government-funded, and merit-based awards. Scholarships range from 10–100% tuition waivers to full-ride packages including living expenses. Most require strong academics (70–90%+), good IELTS/TOEFL/PTE scores, and sometimes essays or interviews. Our Hyderabad counselors identify the best scholarships for your profile and assist with applications — completely free.`,
    },
  ];

  const filteredUniversities = universities;

  // ── All schemas combined into one clean block ─────────────────────────────
  const schemas = [
    // WebPage + Country entity
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Study in ${name} 2026 – Top Universities, Visa, Scholarships for Indian Students`,
      description: `Complete 2026 guide to studying in ${name}: top universities, ${visaSuccessRate}% visa success rate, popular courses, scholarships, eligibility, post-study work & career opportunities for Indian students.`,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/all-countries/${slug}`,
      publisher: {
        "@type": "Organization",
        name: "Khizar Overseas",
        url: process.env.NEXT_PUBLIC_FRONTEND_URL,
      },
      mainEntity: {
        "@type": "Country",
        name: name,
      },
    },

    // Organization – your consultancy (important for EEAT & local SEO)
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Khizar Overseas",
      url: process.env.NEXT_PUBLIC_FRONTEND_URL,
      logo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/logo.png`, // ← change to your real logo
      address: {
        "@type": "PostalAddress",
        streetAddress: "Your Office Address Here", // ← optional but helpful
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500081", // ← your real pin code
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-XXXXXXXXXX", // ← add real number
        contactType: "customer service",
        areaServed: "IN",
      },
      sameAs: [
        "https://www.instagram.com/khizaroverseas/",
        "https://www.linkedin.com/company/khizaroverseas",
        // add real facebook, youtube, twitter if you have
      ],
    },

    // BreadcrumbList
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: process.env.NEXT_PUBLIC_FRONTEND_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Study Abroad Destinations",
          item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/all-countries`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Study in ${name} 2026`,
          item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/all-countries/${slug}`,
        },
      ],
    },

    // FAQPage
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },

    // ItemList for Top Universities (potential rich result boost)
    ...(universities.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Top Universities in ${name} for International Students`,
            itemListElement: universities.slice(0, 12).map((uni, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "CollegeOrUniversity",
                name: uni.name,
                url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/programs/universities/${uni.slug}`,
                address: {
                  "@type": "PostalAddress",
                  addressCountry: uni.country,
                },
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <LazyMotion features={domAnimation}>
      {/* Single clean schema block – better for performance */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="bg-[#020617] text-white min-h-screen relative">
        {/* HERO */}
        <section className="relative h-[75vh] min-h-[520px] overflow-hidden">
          <Image
            src={heroImage?.url || "/fallback.jpg"}
            alt={`Study in ${name} 2026 – Best Universities, Visa Success & Scholarships for Indian Students`}
            fill
            priority
            sizes="(max-width:768px) 100vw, (max-width:1200px) 80vw, 70vw"
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
                Study in {name} 2026
              </m.h1>

              <div className="mt-6">
                <Link
                  href={`/programs/universities?search=${encodeURIComponent(name)}`}
                  className="text-cyan-400 underline"
                >
                  View all universities in {name}
                </Link>
              </div>

              <m.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-6 text-lg md:text-xl text-gray-200 max-w-4xl"
              >
                Visa Success Rate: {visaSuccessRate}% | Top Choice for Indian
                Students
              </m.p>
            </div>
          </div>
        </section>

        {/* BREADCRUMB */}
        <div className="max-w-7xl mx-auto px-6 mt-10 text-sm text-gray-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/all-countries" className="hover:text-white">
            Study Destinations
          </Link>{" "}
          / <span className="text-white">Study in {name}</span>
        </div>

        {/* MAIN CONTENT – unchanged structure */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_360px] gap-12">
            <div className="space-y-16 lg:space-y-20">
              <ContentBlock
                title={`Popular Courses to Study in ${name} in 2026`}
                items={popularCourses}
              />

              <ContentBlock
                title={`Career Opportunities After Studying in ${name}`}
                items={careerOpportunities}
              />

              <ContentBlock
                title="Scholarships & Financial Aid for International Students"
                items={scholarships}
              />

              <ContentBlock
                title={`Eligibility Requirements to Study in ${name}`}
                items={eligibilityRequirements}
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
                    Why Study in {name} in 2026?
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

              {/* FAQ SECTION */}
              <section className="py-24 border-t border-white/10">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-white">
                      Frequently Asked Questions About Studying in {name}
                    </h2>
                    <p className="mt-3 text-gray-400">
                      Common questions Indian students ask before choosing{" "}
                      {name} in 2026
                    </p>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, i) => (
                      <details
                        key={i}
                        className="group bg-[#0B0F19] border border-white/10 rounded-xl p-6 cursor-pointer hover:border-cyan-400/40 transition"
                      >
                        <summary className="flex justify-between items-center text-lg font-semibold text-white">
                          {faq.question}
                          <span className="text-cyan-400 group-open:rotate-180 transition">
                            ⌄
                          </span>
                        </summary>
                        <p className="mt-4 text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* SIDEBAR CTA */}
            <aside className="hidden lg:block sticky top-28 h-fit">
              <CTACard />
            </aside>
          </div>
        </section>

        {/* TOP UNIVERSITIES */}
        {Array.isArray(universities) && universities.length > 0 && (
          <section className="py-20 lg:py-28 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <m.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold mb-12 text-center lg:text-left"
              >
                Top Universities in {country.name} 2026
              </m.h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {universities.slice(0, 12).map((uni, i) => (
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
                      QS Rank #{uni.qsRanking}
                    </p>
                    <Link
                      href={`/programs/universities/${uni.slug}`}
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

/* ================= MEMOIZED COMPONENTS (unchanged) ================= */

const ContentBlock = memo(function ContentBlock({ title, items }) {
  // SAFE ARRAY CHECK
  const safeItems = Array.isArray(items) ? items : [];

  // DON'T RENDER EMPTY BLOCKS
  if (safeItems.length === 0) return null;

  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2 className="text-2xl lg:text-3xl font-bold mb-8">{title}</h2>

      <ul className="grid sm:grid-cols-2 gap-4">
        {safeItems.map((item, index) => (
          <m.li
            key={`${item}-${index}`}
            whileHover={{ scale: 1.02 }}
            className="bg-[#0B0F19] border border-white/10 rounded-xl p-5 hover:border-[#38BDF8]/30 transition"
          >
            <span className="text-gray-200">
              {typeof item === "object"
                ? item.title || item.name || "Unknown"
                : item}
            </span>
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
        Book Free Counseling Session
      </h3>
      <p className="mt-3 text-sm lg:text-base text-gray-300 leading-relaxed">
        Talk to our expert counselors in Hyderabad and kickstart your study
        abroad journey today.
      </p>
      <Link
        href="/assessment"
        className="mt-5 block w-full text-center bg-[#38BDF8] text-[#020617] py-4 rounded-xl font-bold text-lg hover:bg-[#22D3EE] transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        Get Started →
      </Link>
    </div>
  );
});
