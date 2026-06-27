// app/(site)/study-in/[slug]/page.jsx
//
// FOLDER STRUCTURE CHANGE (required for App Router):
//   OLD (broken): app/(site)/study-in-[slug]/page.jsx
//   NEW (fixed):  app/(site)/study-in/[slug]/page.jsx
//
// WHY:  In Next.js App Router, the folder name "study-in-[slug]" is a
//       STATIC segment that only matches the literal URL "/study-in-[slug]".
//       It does NOT match "/study-in-afghanistan".
//       The App Router requires the ENTIRE folder name to be [param]
//       for dynamic routing. Partial dynamic segments (prefix + [param])
//       are not supported in App Router folder names — only in Pages Router.
//
// HOW THE URL STAYS /study-in-afghanistan:
//       middleware.ts rewrites /study-in-{slug} → /study-in/{slug} internally.
//       The browser URL never changes. Google sees /study-in-afghanistan. ✓
//
// DATA FLOW:
//   1. Browser hits /study-in-afghanistan
//   2. middleware.ts rewrites to /study-in/afghanistan (internal, invisible)
//   3. This page renders with params.slug = "afghanistan"
//   4. getCountryPage("afghanistan") → GET /api/public/country/afghanistan
//   5. Backend seoRouter: GET /public/country/:countrySlug → getStudyInCountry
//   6. Returns { seo, jsonLd, country }
//   7. CountryClient renders the full country landing page

export const revalidate = 86400;

import CountryClient from "../../all-countries/[country]/CountryClient";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function getCountryPage(slug) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/public/country/${slug}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return json; // { seo, jsonLd, country }
  } catch {
    return null;
  }
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/countries`);
    const json = await res.json();
    return (json.data || []).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCountryPage(slug);

  if (!data) return { title: "Country Not Found | Khizar Overseas" };

  const { seo, country } = data;
  const canonical = `${BASE_URL}/study-in-${slug}`;

  return {
    title: seo.title,
    description: seo.description,

    alternates: { canonical: seo.canonical || canonical },
    robots: { index: !seo.noIndex, follow: true },

    keywords: [
      `study in ${country.name} for indian students`,
      `${country.name} student visa`,
      `study in ${country.name} 2026`,
      `${country.name} universities for indian students`,
      ...(country.seo?.secondaryKeywords || []),
    ],

    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      url: seo.openGraph?.url || canonical,
      type: "article",
      siteName: "Khizar Overseas",
      locale: "en_IN",
      images: seo.openGraph?.image
        ? [
            {
              url: seo.openGraph.image,
              width: 1200,
              height: 630,
              alt: `Study in ${country.name} 2026 — Khizar Overseas`,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: seo.twitter?.title || seo.title,
      description: seo.twitter?.description || seo.description,
      images: seo.openGraph?.image ? [seo.openGraph.image] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StudyInCountryPage({ params }) {
  const { slug } = await params;
  const data = await getCountryPage(slug);

  if (!data) return notFound();

  const { jsonLd, country } = data;

  return (
    <>
      {jsonLd?.place && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.place) }}
        />
      )}
      {jsonLd?.breadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd.breadcrumb),
          }}
        />
      )}
      {jsonLd?.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faq) }}
        />
      )}
      <CountryClient country={country} />
    </>
  );
}
