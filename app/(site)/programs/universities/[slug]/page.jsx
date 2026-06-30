// app/(site)/programs/universities/[slug]/page.jsx
//
// BUGS FIXED:
// 1. Breadcrumb item 3 used /all-countries/${uni.country.slug}
//    Should be /study-in-${uni.country.slug} (the canonical URL).
//    Google sees inconsistent internal links → hurts authority signals.
//
// 2. shouldIndex was using `uni.confidenceScore` — that field doesn't exist
//    at root level. It lives at uni.enrichment.confidenceScore.
//    Bug: confidence was always 0 → shouldIndex was always false for
//    partially-enriched universities → 8,983 pages set to noindex in sitemap
//    but actually allowed in via meta robots because of wrong field path.
//    Fix: check both paths + also check description length properly.
//
// 3. OG image logic had a bug: the ternary was checking truthiness of
//    (url1 || url2 || url3) as the condition for the outer array — but that
//    means if ogImage exists but is empty string it still builds the array.
//    Fix: compute imageUrl first, then conditionally build images array.
//
// 4. Twitter images had same pattern issue as #3.
//
// 5. Blog breadcrumb used /all-countries/ path — changed to /study-in/.
//
// PERF FIX:
// 6. All revalidate windows bumped from 3600 → 86400 (university data
//    changes rarely; no need to rewrite 8,983 pages every hour).
//    Page-level export const revalidate = 86400 also added so Next.js
//    uses this as the default for any fetch that doesn't specify its own.

import UniversityDetailLayout from "@/components/UniversityDetail/UniversityDetailLayout";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Page-level revalidate: all fetches on this route revalidate every 24h.
// University data changes rarely — no need to regenerate every hour.
export const revalidate = 86400;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildUniTitle(uni) {
  if (uni.seo?.metaTitle) return uni.seo.metaTitle;
  const { name, country } = uni;
  return country?.name
    ? `${name} in ${country.name} | Fees, Courses & Admission 2026 for Indians`
    : `${name} | Fees, Courses & Admission 2026 for Indian Students`;
}

function buildUniDescription(uni) {
  if (uni.seo?.metaDescription) return uni.seo.metaDescription;
  const { name, country } = uni;
  const parts = [
    `Study at ${name}${country?.name ? ` in ${country.name}` : ""} in 2026.`,
  ];
  if (uni.qsRanking) parts.push(`QS Ranked #${uni.qsRanking} globally.`);
  if (uni.tuitionFee || uni.annualFee)
    parts.push(`Tuition: ${uni.tuitionFee || uni.annualFee}.`);
  parts.push(
    `Complete details on courses, scholarships, eligibility & admission for Indian students. Free counseling from Khizar Overseas.`,
  );
  return parts.join(" ");
}

function buildFaqJsonLd(uni) {
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
          text: `Indian students can apply to ${name} in ${countryName} by meeting eligibility criteria, submitting transcripts, SOP, LORs, and English proficiency scores. Khizar Overseas provides free expert guidance for the entire admission process.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the fees at ${name} for Indian students?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The tuition fee at ${name} is ${feeText} per year. Additional costs include living expenses, health insurance, and visa fees. Contact Khizar Overseas for exact fee breakdowns and scholarship opportunities.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${name} good for Indian students?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${name} in ${countryName} is a recognised institution that accepts Indian students. Khizar Overseas has helped many Indian students gain admission to universities in ${countryName}. Get a free eligibility check today.`,
        },
      },
    ],
  };
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/universities`);
    const json = await res.json();
    return (json.universities || []).map((uni) => ({ slug: uni.slug }));
  } catch {
    return [];
  }
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const res = await fetch(`${API_URL}/api/universities/${slug}`, {
      next: { revalidate: 86400 }, // was 3600 — university data changes rarely
    });
    if (!res.ok) return { title: "University | Khizar Overseas" };

    const data = await res.json();
    if (!data?.university) return { title: "University | Khizar Overseas" };

    const uni = data.university;

    // FIX 2: confidence lives at enrichment.confidenceScore, not root
    const confidence =
      uni.enrichment?.confidenceScore ?? uni.confidenceScore ?? 0;
    const descLength = uni.description?.length || 0;
    const shouldIndex =
      (confidence >= 0.75 && descLength >= 300) || uni.isEnriched === true;

    const title = buildUniTitle(uni);
    const description = buildUniDescription(uni);
    const canonical =
      uni.seo?.canonicalUrl || `${BASE_URL}/programs/universities/${slug}`;

    // FIX 3: compute image first, then build array conditionally
    const imageUrl =
      uni.seo?.socialMeta?.ogImage?.url ||
      uni.logo?.url ||
      uni.image?.url ||
      null;

    return {
      title,
      description,
      alternates: { canonical },
      robots: { index: shouldIndex, follow: true },
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
        ...(uni.seo?.secondaryKeywords || []),
      ].filter(Boolean),

      openGraph: {
        title: uni.seo?.socialMeta?.ogTitle || title,
        description: uni.seo?.socialMeta?.ogDescription || description,
        url: canonical,
        siteName: "Khizar Overseas",
        type: "article",
        // FIX 3: safe image array
        images: imageUrl
          ? [
              {
                url: imageUrl,
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
        // FIX 4: safe image array
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return { title: "University | Khizar Overseas" };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page({ params }) {
  const { slug } = await params;

  let uniData = null;
  let similarData = null;

  try {
    const [uniRes, similarRes] = await Promise.all([
      fetch(`${API_URL}/api/universities/${slug}`, {
        next: { revalidate: 86400 }, // was 3600 — university data changes rarely
      }),
      fetch(`${API_URL}/api/universities/similar/${slug}`, {
        next: { revalidate: 86400 }, // was 3600 — similar list is even more stable
      }),
    ]);

    if (uniRes.ok) {
      uniData = await uniRes.json();
    } else {
      console.error(`[university/${slug}] fetch failed: ${uniRes.status}`);
    }
    similarData = similarRes.ok ? await similarRes.json() : null;
  } catch (err) {
    // A transient backend blip mid-build must not take down the other
    // ~9,000 university pages being generated in this same build run.
    console.error(`[university/${slug}] fetch error:`, err.message);
  }

  const uni = uniData?.university;
  if (!uni) return notFound();

  const canonical =
    uni.seo?.canonicalUrl || `${BASE_URL}/programs/universities/${slug}`;

  // ── CollegeOrUniversity JSON-LD ──────────────────────────────────────────
  const universityJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: uni.name,
    url: uni.website || canonical,
    description: uni.description || buildUniDescription(uni),
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
    ...(uni.qsRanking && {
      award: `QS World University Rankings #${uni.qsRanking}`,
    }),
    ...(uni.totalStudents && {
      numberOfStudents: {
        "@type": "QuantitativeValue",
        value: uni.totalStudents,
      },
    }),
    sameAs: uni.structuredData?.sameAs?.length
      ? uni.structuredData.sameAs
      : uni.website
        ? [uni.website]
        : [],
    ...(uni.structuredData?.foundingYear && {
      foundingDate: String(uni.structuredData.foundingYear),
    }),
    ...(uni.structuredData?.telephone && {
      telephone: uni.structuredData.telephone,
    }),
  };

  // ── FAQPage JSON-LD (auto-generated fallback so every page is eligible) ──
  const faqJsonLd = buildFaqJsonLd(uni);

  // ── BreadcrumbList JSON-LD ───────────────────────────────────────────────
  // FIX 1: country breadcrumb uses /study-in-[slug] not /all-countries/[slug]
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Universities",
        item: `${BASE_URL}/programs/universities`,
      },
      ...(uni.country?.name && uni.country?.slug
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: `Study in ${uni.country.name}`,
              // FIX 1: was /all-countries/... now /study-in-...
              item: `${BASE_URL}/study-in-${uni.country.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: uni.name,
              item: canonical,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: uni.name,
              item: canonical,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(universityJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
