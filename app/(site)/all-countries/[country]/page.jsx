// app/(site)/all-countries/[country]/page.jsx
//
// BUGS FIXED:
// 1. canonical was: /all-countries/${slug}  (pointing to itself)
//    Should be:      https://www.khizaroverseas.in/study-in-${slug}
//    /study-in-[slug] is the PRIMARY URL. This page is the duplicate.
//    With this fix: Google indexes /study-in-uk, not /all-countries/uk.
//
// 2. robots.index was never set to false — Google was indexing BOTH
//    /all-countries/uk AND /study-in-uk as separate pages → duplicate content.
//    Fix: robots: { index: false } here. /study-in-[slug] does the indexing.
//
// 3. JSON-LD schema.org Country url was pointing to /all-countries/...
//    Should point to the canonical /study-in-... URL.
//
// 4. BreadcrumbList item 3 url was /all-countries/...
//    Should also be the canonical /study-in-... URL.
//
// 5. seo.secondaryKeywords from the model was never spread into keywords array.

export const revalidate = 3600;

import CountryClient from "./CountryClient";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Data fetcher ────────────────────────────────────────────────────────────

async function getCountry(slug) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/countries/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildCountryTitle(country) {
  if (country.seo?.metaTitle) return country.seo.metaTitle;
  const { name, visaSuccessRate: v } = country;
  return v
    ? `Study in ${name} 2026 | ${v}% Visa Success Rate | Indian Students Guide`
    : `Study in ${name} 2026 | Top Universities, Fees & Visa Guide for Indians`;
}

function buildCountryDescription(country) {
  if (country.seo?.metaDescription) return country.seo.metaDescription;
  const { name, visaSuccessRate: v } = country;
  if (v && Number(v) >= 70)
    return `Study in ${name} 2026: ${v}% visa success rate for Indian students. Compare top universities, tuition fees, scholarships & post-study work options. Free expert counseling from Hyderabad — get assessed in 24 hrs.`;
  if (v)
    return `Complete guide to studying in ${name} in 2026 for Indian students. Visa success rate: ${v}%. Top universities, fees, scholarships & eligibility. Free counseling from Khizar Overseas, Hyderabad.`;
  return `Study in ${name} 2026 for Indian students: top universities, tuition fees, visa requirements, scholarships & post-study work options. Free expert counseling from Khizar Overseas, Hyderabad.`;
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/countries`);
    const json = await res.json();
    return (json.data || []).map((c) => ({ country: c.slug }));
  } catch {
    return [];
  }
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { country: slug } = await params;
  const country = await getCountry(slug);
  if (!country) return { title: "Country Not Found | Khizar Overseas" };

  const title = buildCountryTitle(country);
  const description = buildCountryDescription(country);

  // FIX 1: canonical MUST point to /study-in-[slug], not /all-countries/[slug]
  const canonical = `${BASE_URL}/study-in-${slug}`;

  const image =
    country.seo?.socialMeta?.ogImage?.url ||
    country.heroImage?.url ||
    `${BASE_URL}/og-image-1200x630.jpg`;

  return {
    title,
    description,

    // FIX 1: canonical → /study-in-[slug]
    alternates: { canonical },

    // FIX 2: noindex this page — /study-in-[slug] is the one Google should index
    robots: { index: false, follow: true },

    keywords: [
      `study in ${country.name} for indian students`,
      `${country.name} student visa success rate`,
      `study in ${country.name} 2026`,
      `${country.name} universities for indian students`,
      `${country.name} tuition fees for indian students`,
      `study abroad ${country.name}`,
      // FIX 5: spread admin-filled secondary keywords
      ...(country.seo?.secondaryKeywords || []),
    ],

    openGraph: {
      title: country.seo?.socialMeta?.ogTitle || title,
      description: country.seo?.socialMeta?.ogDescription || description,
      url: canonical,
      type: "article",
      siteName: "Khizar Overseas",
      locale: "en_IN",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: `Study in ${country.name} 2026 — Khizar Overseas`,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: country.seo?.socialMeta?.twitterTitle || title,
      description: country.seo?.socialMeta?.twitterDescription || description,
      images: image ? [image] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CountryPage({ params }) {
  const { country: slug } = await params;
  const country = await getCountry(slug);
  if (!country) return notFound();

  // FIX 3: JSON-LD url points to canonical /study-in-[slug]
  const canonical = `${BASE_URL}/study-in-${slug}`;
  const description = buildCountryDescription(country);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Country",
    name: country.name,
    url: canonical, // FIX 3
    description,
  };

  // FIX 4: BreadcrumbList item 3 url → canonical
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Countries",
        item: `${BASE_URL}/all-countries`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Study in ${country.name}`,
        item: canonical,
      }, // FIX 4
    ],
  };

  const faqLd = country.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: country.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <CountryClient country={country} />
    </>
  );
}
