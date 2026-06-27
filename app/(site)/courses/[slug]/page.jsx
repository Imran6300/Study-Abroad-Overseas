// app/(site)/courses/[slug]/page.jsx

import CourseDetailPage from "./course";

// ─── Static params (pre-build all known course pages at deploy time) ──────────

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) return [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses`,
      { cache: "no-store" }, // always fetch fresh at build time
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.courses || []).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

// Allow unknown slugs to still render on-demand (e.g. newly added courses
// after the last deploy). Set to false for a hard 404 on unknown slugs.
export const dynamicParams = true;

async function getCourse(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${slug}`,
      { next: { revalidate: 86400 } },
    );

    const data = await res.json();

    if (!data || !data.course) return null;

    return data.course;
  } catch (err) {
    console.error("Course fetch failed:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = await getCourse(slug);

  if (!program) {
    return {
      title: "Course Not Found | Khizar Overseas",
      description: "The requested study abroad program could not be found.",
      robots: { index: false, follow: false },
    };
  }

  // Use admin-filled SEO fields first, then auto-generate
  const mainCountry =
    program.topCountry ||
    program.topUniversities?.[0]?.country?.name ||
    "Abroad";

  const level = program.level || "Masters / Bachelors";

  const title =
    program.seo?.metaTitle ||
    `${program.title} in ${mainCountry} ${level} 2026 – Fees, Scholarships & Top Universities`;

  const description =
    program.seo?.metaDescription ||
    (program.overviewDescription
      ? `${program.overviewDescription.slice(0, 118)}... Top universities, tuition fees, scholarships up to 100%, eligibility, visa & job prospects for Indian students. Free guidance!`
      : `Study ${program.title} abroad in 2026. Best universities, fees, scholarships, entry requirements & high salary careers. Free counseling from Hyderabad.`);

  const canonicalUrl =
    program.seo?.canonicalUrl ||
    `https://www.khizaroverseas.in/courses/${slug}`;

  const image =
    program.seo?.socialMeta?.ogImage?.url ||
    program.bgImage?.url ||
    "https://khizaroverseas.in/og-courses.jpg";

  return {
    metadataBase: new URL("https://khizaroverseas.in"),

    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: program.seo?.socialMeta?.ogTitle || title,
      description: program.seo?.socialMeta?.ogDescription || description,
      url: canonicalUrl,
      siteName: "Khizar Overseas – Study Abroad from Hyderabad",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${program.title} study abroad program 2026 – ${mainCountry}`,
        },
      ],
      locale: "en_IN",
      type: "article",
      publishedTime: program.createdAt || undefined,
      modifiedTime: program.updatedAt || program.createdAt || undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: program.seo?.socialMeta?.twitterTitle || title,
      description: program.seo?.socialMeta?.twitterDescription || description,
      images: [
        program.seo?.socialMeta?.ogImage?.url ||
          program.bgImage?.url ||
          "https://khizaroverseas.in/og-courses.jpg",
      ],
    },

    keywords: [
      `${program.title} abroad`,
      `${program.title} 2026`,
      `study ${program.title} in ${mainCountry}`,
      `${level} abroad for Indian students`,
      `${program.title} fees scholarships jobs`,
    ].join(", "),
  };
}

export default async function ProgramPage({ params }) {
  const { slug } = await params;
  const program = await getCourse(slug);

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Course Not Found
          </h1>
          <p className="text-xl text-gray-300 mb-10">
            Sorry, we couldn&apos;t find this study abroad program.
          </p>
          <a
            href="/courses"
            className="inline-block px-10 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-full font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all"
          >
            Browse All Courses →
          </a>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://www.khizaroverseas.in/courses/${slug}`;

  // ── 1. Course JSON-LD ─────────────────────────────────────────────────────
  // schema.org/Course — the primary structured data type for this page.
  // hasCourseInstance is the key field: it tells Google which universities
  // offer this course and in which countries. This enables rich results
  // showing specific offerings directly in search results.
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description:
      program.overviewDescription ||
      `Study ${program.title} abroad – top universities, fees, scholarships & career outcomes for 2026 intake.`,
    url: canonicalUrl,
    image: program.bgImage?.url || undefined,
    provider: {
      "@type": "Organization",
      name: "Khizar Overseas",
      url: "https://www.khizaroverseas.in",
    },
    educationalCredentialAwarded: program.level
      ? `${program.level} Degree`
      : undefined,
    // courseMode comes from structuredData after enrichment
    ...(program.structuredData?.courseMode && {
      courseMode: program.structuredData.courseMode,
    }),
    // Duration in ISO 8601 format (e.g. "P2Y" = 2 years) — ideally set by admin
    // We store the raw string from the DB and pass it as-is for now
    ...(program.duration && { timeToComplete: program.duration }),
    // Career prospects — helps with occupation-related queries
    ...(program.careerProspects && {
      educationalProgramMode: program.careerProspects,
    }),
    // Popular job roles map to occupationalCategory
    ...(program.popularJobRoles?.length && {
      occupationalCredentialAwarded: program.popularJobRoles.join(", "),
    }),
    // Tuition fee if available
    ...(program.fees && {
      offers: {
        "@type": "Offer",
        description: `Annual tuition: ${program.fees}`,
        category: "Tuition",
      },
    }),
    // Average salary — useful for intent queries like "data science salary abroad"
    ...(program.avgSalary && {
      salaryUponCompletion: {
        "@type": "MonetaryAmountDistribution",
        currency: "USD",
        median: program.avgSalary,
      },
    }),
    // Target audience: Indian students planning to study abroad
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Prospective International Students",
      geographicAreaServed: "India",
    },
    // hasCourseInstance: one entry per university that offers this course.
    // This is the most powerful field for programmatic SEO — it surfaces
    // specific offering details in search results.
    hasCourseInstance: (program.topUniversities || [])
      .slice(0, 8)
      .map((uni) => ({
        "@type": "CourseInstance",
        name: `${program.title} at ${uni.name}`,
        courseMode: program.structuredData?.courseMode || "full-time",
        instructor: {
          "@type": "CollegeOrUniversity",
          name: uni.name,
          url:
            uni.website ||
            `https://www.khizaroverseas.in/programs/universities/${uni.slug}`,
        },
        location: uni.country?.name
          ? {
              "@type": "Country",
              name: uni.country.name,
            }
          : undefined,
      }))
      .filter(Boolean),
  };

  // ── 2. FAQPage JSON-LD ───────────────────────────────────────────────────
  // Uses admin-filled faqs[] if they exist (best quality).
  // Falls back to auto-generated FAQs from program data.
  // These appear as expandable accordions in Google search results.
  let faqJsonLd = null;

  if (program.faqs?.length) {
    faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: program.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
  } else {
    // Auto-generated fallback FAQs — always present so every course page
    // is eligible for FAQ rich results from day one
    const mainCountry =
      program.topCountry ||
      program.countries?.[0]?.name ||
      program.topUniversities?.[0]?.country?.name ||
      "top countries";

    const feeText = program.fees
      ? `around ${program.fees} per year`
      : "varying amounts depending on the university and country";

    const salaryText = program.avgSalary
      ? `an average salary of ${program.avgSalary}`
      : "competitive salaries depending on country and specialisation";

    faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is the cost of studying ${program.title} abroad for Indian students?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `The cost of studying ${program.title} abroad varies by country and university. Fees are typically ${feeText}. Scholarships can cover up to 100% of tuition for eligible students. Khizar Overseas offers free counseling to help you find the best funding options.`,
          },
        },
        {
          "@type": "Question",
          name: `Which country is best to study ${program.title} from India?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${mainCountry} ${typeof mainCountry === "string" && mainCountry.includes(",") ? "are" : "is"} among the most popular destination${typeof mainCountry === "string" && mainCountry.includes(",") ? "s" : ""} for Indian students studying ${program.title}. The best country depends on your budget, target university rankings, post-study work visa options, and career goals. Khizar Overseas provides personalized country selection guidance for free.`,
          },
        },
        {
          "@type": "Question",
          name: `What are the career prospects after studying ${program.title} abroad?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: program.careerProspects
              ? `${program.careerProspects} Graduates typically earn ${salaryText}.`
              : `Graduates with a ${program.title} degree from top international universities can expect ${salaryText}. Career opportunities span multiple industries globally. Contact Khizar Overseas for detailed career guidance.`,
          },
        },
      ],
    };
  }

  // ── 3. BreadcrumbList JSON-LD ────────────────────────────────────────────
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.khizaroverseas.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: "https://www.khizaroverseas.in/courses",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: program.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      {/* Course — primary entity + hasCourseInstance per university */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      {/* FAQPage — expandable accordions in SERP */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* BreadcrumbList — path shown under title in SERP */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <CourseDetailPage slug={slug} />
    </>
  );
}
