// app/(site)/study-in-[slug]/page.jsx
//
// BUGS FIXED:
// 1. Was doing redirect() to /all-countries/[slug] — this throws away
//    ALL SEO value for /study-in-uk, /study-in-canada etc. which are your
//    highest-value URLs. Indian students search "study in UK", not "all-countries UK".
//    Now: full standalone page. /all-countries/[slug] sets canonical → here.
//
// 2. getCountryData API response returns { data: country } but this page
//    was never calling the API — it just redirected.
//    Now: fetches via /api/countries/:slug and reads data.data correctly.
//
// 3. JSON-LD was missing entirely. Now: Country + BreadcrumbList + FAQPage.
//
// 4. seo.* admin fields were never consumed. Now: fully respected.
//
// 5. metadataBase was set in layout.tsx as khizaroverseas.in (no www)
//    but canonical URLs used www.khizaroverseas.in — inconsistency.
//    DECISION: canonical = https://www.khizaroverseas.in (www wins, it's what GSC shows).
//    layout.tsx metadataBase should match — see layout.tsx fix.

export const revalidate = 3600;

import { notFound } from "next/navigation";
import CountryClient from "../all-countries/[country]/CountryClient";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Data fetcher ───────────────────────────────────────────────────────────

async function getCountry(slug) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/countries/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null; // countryController returns { data: country }
  } catch {
    return null;
  }
}

// ─── Static params ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/countries?limit=300`);
    const json = await res.json();
    return (json.data || []).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

// ─── Title / description helpers ────────────────────────────────────────────

function buildTitle(country) {
  if (country.seo?.metaTitle) return country.seo.metaTitle;
  const { name, visaSuccessRate: v } = country;
  return v
    ? `Study in ${name} 2026 | ${v}% Visa Success Rate | Indian Students Guide`
    : `Study in ${name} 2026 | Top Universities, Fees & Visa Guide for Indians`;
}

function buildDescription(country) {
  if (country.seo?.metaDescription) return country.seo.metaDescription;
  const { name, visaSuccessRate: v } = country;
  if (v && Number(v) >= 70)
    return `Study in ${name} 2026: ${v}% visa success rate for Indian students. Compare top universities, tuition fees, scholarships & post-study work options. Free expert counseling from Hyderabad — get assessed in 24 hrs.`;
  if (v)
    return `Complete guide to studying in ${name} in 2026. Visa success rate: ${v}%. Top universities, fees, scholarships & eligibility. Free counseling from Khizar Overseas, Hyderabad.`;
  return `Study in ${name} 2026 for Indian students: top universities, tuition fees, visa requirements, scholarships & post-study work options. Free expert counseling from Khizar Overseas, Hyderabad.`;
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const country = await getCountry(slug);
  if (!country) return { title: "Country Not Found | Khizar Overseas" };

  const title = buildTitle(country);
  const description = buildDescription(country);
  const canonical = `${BASE_URL}/study-in-${slug}`; // THIS is the canonical URL
  const image =
    country.seo?.socialMeta?.ogImage?.url ||
    country.heroImage?.url ||
    `${BASE_URL}/og-image-1200x630.jpg`;

  return {
    title,
    description,

    alternates: { canonical },

    robots: {
      index: !country.seo?.noIndex,
      follow: true,
    },

    keywords: [
      `study in ${country.name} for indian students`,
      `${country.name} universities for indians 2026`,
      `${country.name} student visa success rate`,
      `study in ${country.name} fees scholarships`,
      `study abroad ${country.name} from india`,
      ...(country.seo?.secondaryKeywords || []),
    ],

    openGraph: {
      title: country.seo?.socialMeta?.ogTitle || title,
      description: country.seo?.socialMeta?.ogDescription || description,
      url: canonical,
      siteName: "Khizar Overseas",
      type: "website",
      locale: "en_IN",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: `Study in ${country.name} 2026 – Khizar Overseas`,
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function StudyInCountryPage({ params }) {
  const { slug } = await params;
  const country = await getCountry(slug);
  if (!country) return notFound();

  const canonical = `${BASE_URL}/study-in-${slug}`;
  const description = buildDescription(country);

  // ── JSON-LD: Country entity ────────────────────────────────────────────
  const countryJsonLd = {
    "@context": "https://schema.org",
    "@type": "Country",
    name: country.name,
    url: canonical,
    description,
    ...(country.structuredData?.isoCode && {
      identifier: country.structuredData.isoCode,
    }),
    ...(country.structuredData?.currency && {
      currency: country.structuredData.currency,
    }),
  };

  // ── JSON-LD: BreadcrumbList ────────────────────────────────────────────
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Study Destinations",
        item: `${BASE_URL}/all-countries`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Study in ${country.name}`,
        item: canonical,
      },
    ],
  };

  // ── JSON-LD: FAQPage (only if admin has filled faqs[]) ─────────────────
  const faqJsonLd = country.faqs?.length
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(countryJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* Reuse CountryClient — zero code duplication */}
      <CountryClient country={country} />
    </>
  );
}
