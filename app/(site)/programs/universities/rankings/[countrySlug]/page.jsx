// app/(site)/programs/universities/rankings/[countrySlug]/page.jsx
//
// URL: /programs/universities/rankings/{countrySlug}
// e.g. /programs/universities/rankings/canada
//
// Organic Growth Audit, Section 3 & 12 (item #12 — "Cheapest-
// universities / ranked-list pages using tuitionFee, qsRanking").
// Deliberately scoped per country rather than one global list — see
// rankingsController.js for the currency-safety reasoning.

export const revalidate = 43200; // 12h — tuition/ranking data changes more than country copy does

import { notFound } from "next/navigation";
import RankingsCountryClient from "./RankingsCountryClient";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Data fetcher ───────────────────────────────────────────────────────────

async function getRankingsByCountry(countrySlug, attempt = 1) {
  if (!API_URL) return null;
  const MAX_ATTEMPTS = 3;
  try {
    const res = await fetch(`${API_URL}/api/public/rankings/${countrySlug}`, {
      next: { revalidate: 43200 },
    });

    if (res.status === 404) return null; // genuine "no ranking data" — don't retry

    if (!res.ok) {
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, attempt * 500));
        return getRankingsByCountry(countrySlug, attempt + 1);
      }
      console.error(
        `[rankings] "${countrySlug}" failed after ${MAX_ATTEMPTS} attempts: HTTP ${res.status}`,
      );
      return null;
    }

    const json = await res.json();
    if (!json.success) return null;
    return json; // { seo, jsonLd, country, topRanked, cheapest }
  } catch (err) {
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, attempt * 500));
      return getRankingsByCountry(countrySlug, attempt + 1);
    }
    console.error(
      `[rankings] "${countrySlug}" failed after ${MAX_ATTEMPTS} attempts:`,
      err.message,
    );
    return null;
  }
}

// ─── Static params ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/public/rankings-country-slugs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.slugs || []).map((slug) => ({ countrySlug: slug }));
  } catch {
    return [];
  }
}

// ─── generateMetadata ───────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { countrySlug } = await params;
  const data = await getRankingsByCountry(countrySlug);

  if (!data) return { title: "Page Not Found | Khizar Overseas" };

  const { seo, country } = data;
  const canonical = `${BASE_URL}/programs/universities/rankings/${countrySlug}`;

  return {
    title: seo.title,
    description: seo.description,

    alternates: { canonical: seo.canonical || canonical },
    robots: { index: !seo.noIndex, follow: true },

    keywords: [
      `top universities in ${country.name}`,
      `best universities in ${country.name} for indian students`,
      `cheapest universities in ${country.name}`,
      `affordable universities in ${country.name} 2026`,
    ],

    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      url: seo.openGraph?.url || canonical,
      type: "website",
      siteName: "Khizar Overseas",
      locale: "en_IN",
      images: seo.openGraph?.image
        ? [
            {
              url: seo.openGraph.image,
              width: 1200,
              height: 630,
              alt: `Top universities in ${country.name} — Khizar Overseas`,
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function RankingsCountryPage({ params }) {
  const { countrySlug } = await params;
  const data = await getRankingsByCountry(countrySlug);

  if (!data) return notFound();

  const { jsonLd, country, topRanked, cheapest } = data;

  return (
    <>
      {jsonLd?.list && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.list) }}
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
      <RankingsCountryClient
        country={country}
        topRanked={topRanked}
        cheapest={cheapest}
      />
    </>
  );
}
