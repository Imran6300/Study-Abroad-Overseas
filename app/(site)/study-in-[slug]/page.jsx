// app/(site)/study-in-[slug]/page.jsx
//
// WHY THIS FILE IS NEEDED:
// The folder study-in-[slug] only had a layout.jsx — Next.js had no page
// to render, so it fell through to /_not-found → 404.
//
// This is the CANONICAL URL for every country landing page.
// /all-countries/[country]/page.jsx is the DUPLICATE (noindex).
// SEO data comes from /api/public/country/:slug (seoMetaController.getStudyInCountry)
// which returns { seo, jsonLd, country } — richer than /api/countries/:slug.

export const revalidate = 3600;

import CountryClient from "../all-countries/[country]/CountryClient";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Data fetcher ─────────────────────────────────────────────────────────────
// Uses the dedicated SEO endpoint which returns seo + jsonLd + country
// in one round-trip. Falls back to the basic country endpoint if needed.

async function getCountryPage(slug) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/public/country/${slug}`, {
      next: { revalidate: 3600 },
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

    // This IS the canonical URL — index it
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
