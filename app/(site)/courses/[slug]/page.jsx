// app/courses/[slug]/page.jsx

import CourseDetailPage from "./course";

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

  // ── SEO Title ── long-tail, high-intent, under ~60–65 chars when possible
  const mainCountry =
    program.topCountry || program.topUniversities?.[0]?.country || "Abroad";

  const level = program.level || "Masters / Bachelors";
  const title = `${program.title} in ${mainCountry} ${level} 2026 – Fees, Scholarships & Top Universities`;

  // ── Meta Description ── compelling, ~150–158 chars, includes CTA
  const description = program.overviewDescription
    ? `${program.overviewDescription.slice(0, 118)}... Top universities, tuition fees, scholarships up to 100%, eligibility, visa & job prospects for Indian students. Free guidance!`
    : `Study ${program.title} abroad in 2026. Best universities, fees, scholarships, entry requirements & high salary careers. Free counseling from Hyderabad.`;

  const image =
    program.bgImage?.url || "https://khizaroverseas.in/og-courses.jpg";

  return {
    metadataBase: new URL("https://khizaroverseas.in"),

    title,
    description,

    alternates: {
      canonical: `/courses/${slug}`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: `https://khizaroverseas.in/courses/${slug}`,
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
      // Helps freshness signals
      publishedTime: program.createdAt || undefined,
      modifiedTime: program.updatedAt || program.createdAt || undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    // Optional – still used by some tools / rank trackers
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
            Sorry, we couldn't find this study abroad program.
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

  // ── Rich structured data ── this is one of the strongest parts
  const mainCountry =
    program.topCountry ||
    program.topUniversities?.[0]?.country ||
    "Multiple Countries";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Courses",
        item: "https://khizaroverseas.in/courses",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: program.title,
        item: `https://khizaroverseas.in/courses/${slug}`,
      },
    ],
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description:
      program.overviewDescription ||
      `Study ${program.title} abroad – top universities, fees, scholarships & career outcomes for 2026 intake.`,
    provider: {
      "@type": "Organization",
      name: "Khizar Overseas",
      url: "https://khizaroverseas.in",
      sameAs: [
        "https://www.instagram.com/khizaroverseas/",
        "https://www.linkedin.com/company/khizaroverseas",
        // ← add more real social links if you have them
      ],
    },
    educationalCredentialAwarded: `${program.level} Degree`,
    applicationCategory: program.field || "Education",
    // Very powerful for study-abroad – shows specific offerings
    hasCourseInstance: (program.topUniversities || [])
      .slice(0, 8)
      .map((uni) => ({
        "@type": "CourseInstance",
        name: `${program.title} at ${uni.name}`,
        provider: {
          "@type": "CollegeOrUniversity",
          name: uni.name,
          url:
            uni.website || `https://khizaroverseas.in/universities/${uni.slug}`,
        },
        location: {
          "@type": "Country",
          name: uni.country,
        },
        courseMode: "full-time",
      })),
    offers: program.fees
      ? {
          "@type": "Offer",
          price: program.fees.replace(/[^0-9.]/g, ""),
          priceCurrency: "USD",
          category: "Tuition",
        }
      : undefined,
    occupationalCredentialAwarded:
      program.popularJobRoles?.join(", ") || undefined,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Prospective International Students",
      geographicAreaServed: "India",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseJsonLd),
        }}
      />

      <CourseDetailPage slug={slug} />
    </>
  );
}
