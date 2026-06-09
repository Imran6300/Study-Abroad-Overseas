import UniversityDetailLayout from "@/components/UniversityDetail/UniversityDetailLayout";
import { notFound } from "next/navigation";

// ─── HELPER: build a punchy title ──────────────────────────────────────────
function buildUniTitle(uni) {
  const name = uni.name;
  const country = uni.country?.name;

  if (country) {
    return `${name} in ${country} | Fees, Courses & Admission 2026 for Indians`;
  }
  return `${name} | Fees, Courses & Admission 2026 for Indian Students`;
}

// ─── HELPER: build a description that sells the click ──────────────────────
function buildUniDescription(uni) {
  const name = uni.name;
  const country = uni.country?.name;

  const parts = [`Study at ${name}${country ? ` in ${country}` : ""} in 2026.`];

  if (uni.ranking) {
    parts.push(`Ranked #${uni.ranking} globally.`);
  }

  if (uni.tuitionFee || uni.annualFee) {
    const fee = uni.tuitionFee || uni.annualFee;
    parts.push(`Tuition: ${fee}.`);
  }

  parts.push(
    `Get complete details on courses, scholarships, eligibility & admission for Indian students. Free counseling from Khizar Overseas.`,
  );

  return parts.join(" ");
}

// ─── HELPER: build FAQPage JSON-LD ─────────────────────────────────────────
// Uses stored faqs[] first (filled by admin). Falls back to auto-generated
// generic FAQs so every university page always has FAQ structured data.
function buildFaqJsonLd(uni) {
  // If admin has filled in real FAQs on this university, use those
  if (uni.faqs?.length) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: uni.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
  }

  // Fallback: auto-generate 3 high-intent FAQs from available data
  const name = uni.name;
  const countryName = uni.country?.name || "abroad";
  const feeText =
    uni.tuitionFee || uni.annualFee
      ? `approximately ${uni.tuitionFee || uni.annualFee}`
      : "varying amounts depending on program";

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How to get admission in ${name} from India?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Indian students can apply to ${name} in ${countryName} by meeting the eligibility criteria, submitting required documents (transcripts, SOP, LORs, English proficiency scores), and applying online. Khizar Overseas provides free expert guidance for the entire admission process. Contact us for a personalised admission roadmap.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the fees at ${name} for Indian students?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The tuition fee at ${name} is ${feeText} per year. Additional costs include living expenses, health insurance, and visa fees. Contact Khizar Overseas for exact fee breakdowns, scholarship opportunities, and financial planning guidance.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${name} good for Indian students?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${name} in ${countryName} is a recognised institution that accepts applications from Indian students. Khizar Overseas has helped many Indian students secure admission to universities in ${countryName}. Get free counseling to check your eligibility and start your application.`,
        },
      },
    ],
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities`,
    );

    const data = await res.json();

    return (data.universities || []).map((uni) => ({
      slug: uni.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${slug}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      return { title: "University | Khizar Overseas" };
    }

    const data = await res.json();

    if (!data?.university) {
      return { title: "University | Khizar Overseas" };
    }

    const uni = data.university;
    const confidence =
      uni.confidenceScore || uni.enrichment?.confidenceScore || 0;
    const descriptionLength = uni.description?.length || 0;
    const shouldIndex = confidence >= 0.75 && descriptionLength >= 300;

    // Use admin-filled SEO fields first, then fall back to auto-generated
    const title = uni.seo?.metaTitle || buildUniTitle(uni);
    const description = uni.seo?.metaDescription || buildUniDescription(uni);
    const canonicalUrl =
      uni.seo?.canonicalUrl ||
      `https://www.khizaroverseas.in/programs/universities/${slug}`;

    return {
      title,
      description,

      keywords: [
        uni.name,
        `${uni.name} fees`,
        `${uni.name} ranking`,
        `${uni.name} admission`,
        `${uni.name} for indian students`,
        uni.country?.name
          ? `universities in ${uni.country.name} for indian students`
          : "universities abroad for indian students",
        "study abroad 2026",
      ].filter(Boolean),

      alternates: { canonical: canonicalUrl },

      robots: {
        index: shouldIndex,
        follow: true,
      },

      openGraph: {
        title: uni.seo?.socialMeta?.ogTitle || title,
        description: uni.seo?.socialMeta?.ogDescription || description,
        url: canonicalUrl,
        siteName: "Khizar Overseas",
        type: "article",
        images:
          uni.seo?.socialMeta?.ogImage?.url || uni.logo?.url || uni.image?.url
            ? [
                {
                  url:
                    uni.seo?.socialMeta?.ogImage?.url ||
                    uni.logo?.url ||
                    uni.image?.url,
                  width: 1200,
                  height: 630,
                  alt: `${uni.name} — Khizar Overseas`,
                },
              ]
            : [],
      },

      twitter: {
        card: "summary_large_image",
        title: uni.seo?.socialMeta?.twitterTitle || title,
        description: uni.seo?.socialMeta?.twitterDescription || description,
        images:
          uni.seo?.socialMeta?.ogImage?.url || uni.logo?.url || uni.image?.url
            ? [
                uni.seo?.socialMeta?.ogImage?.url ||
                  uni.logo?.url ||
                  uni.image?.url,
              ]
            : [],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return { title: "University | Khizar Overseas" };
  }
}

export default async function Page({ params }) {
  const { slug } = await params;

  const [uniRes, similarRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${slug}`, {
      next: { revalidate: 3600 },
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/similar/${slug}`,
      { next: { revalidate: 3600 } },
    ),
  ]);

  const uniData = await uniRes.json();
  const similarData = await similarRes.json();
  const uni = uniData?.university;

  if (!uni) return notFound();

  const canonicalUrl = `https://www.khizaroverseas.in/programs/universities/${slug}`;

  // ── 1. CollegeOrUniversity JSON-LD ───────────────────────────────────────
  // Maps to schema.org/CollegeOrUniversity — tells Google exactly what this
  // entity is so it can build a Knowledge Panel and show rich results.
  const universityJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: uni.name,
    url: uni.website || canonicalUrl,
    description:
      uni.description || uni.seo?.metaDescription || buildUniDescription(uni),
    logo: uni.logo?.url
      ? {
          "@type": "ImageObject",
          url: uni.logo.url,
          caption: `${uni.name} logo`,
        }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: uni.city || undefined,
      addressCountry:
        uni.structuredData?.addressCountry || uni.country?.name || undefined,
    },
    // QS ranking as an award — helps with authority signals
    ...(uni.qsRanking && {
      award: `QS World University Rankings #${uni.qsRanking}`,
    }),
    // Total student body size
    ...(uni.totalStudents && {
      numberOfStudents: {
        "@type": "QuantitativeValue",
        value: uni.totalStudents,
      },
    }),
    // sameAs: link to Wikipedia, official site, ranking page
    // These are stored in uni.structuredData.sameAs after enrichment
    sameAs: uni.structuredData?.sameAs?.length
      ? uni.structuredData.sameAs
      : uni.website
        ? [uni.website]
        : [],
    // Founding year (available after enrichment)
    ...(uni.structuredData?.foundingYear && {
      foundingDate: String(uni.structuredData.foundingYear),
    }),
    // Contact info
    ...(uni.structuredData?.telephone && {
      telephone: uni.structuredData.telephone,
    }),
  };

  // ── 2. FAQPage JSON-LD ───────────────────────────────────────────────────
  // Uses real admin-filled faqs[] if present, otherwise auto-generates 3
  // high-intent FAQs from the university's data. Google shows these as
  // expandable accordions directly in search results.
  const faqJsonLd = buildFaqJsonLd(uni);

  // ── 3. BreadcrumbList JSON-LD ────────────────────────────────────────────
  // Shows the path in search results: Home > Universities > Study in UK > UCL
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
        name: "Universities",
        item: "https://www.khizaroverseas.in/programs/universities",
      },
      // Only add country crumb if we have country data
      ...(uni.country?.name && uni.country?.slug
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: `Study in ${uni.country.name}`,
              item: `https://www.khizaroverseas.in/all-countries/${uni.country.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: uni.name,
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: uni.name,
              item: canonicalUrl,
            },
          ]),
    ],
  };

  return (
    <>
      {/* CollegeOrUniversity — entity recognition + Knowledge Panel */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(universityJsonLd) }}
      />

      {/* FAQPage — expandable accordions in SERP */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* BreadcrumbList — path shown under page title in SERP */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <UniversityDetailLayout
        uni={{ ...uni, courses: uniData.courses }}
        similarUniversities={similarData?.universities || []}
      />
    </>
  );
}
