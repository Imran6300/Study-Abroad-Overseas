// app/(site)/programs/visa-guidance/[countrySlug]/page.jsx
//
// URL: /programs/visa-guidance/{countrySlug}
// e.g. /programs/visa-guidance/canada
//
// Organic Growth Audit, Section 3 & 12 (item #11 — "Visa guide per
// country using eligibilityRequirements, visaSuccessRate"): same
// pattern as the university×course combo (#4) and scholarships-by-
// country (#10) pages — server fetch + generateMetadata +
// generateStaticParams + notFound() for genuinely missing data.

export const revalidate = 86400;

import { notFound } from "next/navigation";
import VisaGuideCountryClient from "./VisaGuideCountryClient";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Data fetcher ───────────────────────────────────────────────────────────

async function getVisaGuideByCountry(countrySlug, attempt = 1) {
  if (!API_URL) return null;
  const MAX_ATTEMPTS = 3;
  try {
    const res = await fetch(
      `${API_URL}/api/public/visa-guidance/${countrySlug}`,
      { next: { revalidate: 86400 } },
    );

    if (res.status === 404) return null; // genuine "no visa data" — don't retry

    if (!res.ok) {
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, attempt * 500));
        return getVisaGuideByCountry(countrySlug, attempt + 1);
      }
      console.error(
        `[visa-guidance] "${countrySlug}" failed after ${MAX_ATTEMPTS} attempts: HTTP ${res.status}`,
      );
      return null;
    }

    const json = await res.json();
    if (!json.success) return null;
    return json; // { seo, jsonLd, country }
  } catch (err) {
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, attempt * 500));
      return getVisaGuideByCountry(countrySlug, attempt + 1);
    }
    console.error(
      `[visa-guidance] "${countrySlug}" failed after ${MAX_ATTEMPTS} attempts:`,
      err.message,
    );
    return null;
  }
}

// ─── Static params ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  if (!API_URL) return [];
  try {
    const res = await fetch(
      `${API_URL}/api/public/visa-guide-country-slugs`,
      { cache: "no-store" },
    );
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
  const data = await getVisaGuideByCountry(countrySlug);

  if (!data) return { title: "Page Not Found | Khizar Overseas" };

  const { seo, country } = data;
  const canonical = `${BASE_URL}/programs/visa-guidance/${countrySlug}`;

  return {
    title: seo.title,
    description: seo.description,

    alternates: { canonical: seo.canonical || canonical },
    robots: { index: !seo.noIndex, follow: true },

    keywords: [
      `${country.name} student visa requirements`,
      `${country.name} visa guide for indian students`,
      `${country.name} student visa success rate`,
      `how to get ${country.name} student visa`,
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
              alt: `${country.name} student visa guide — Khizar Overseas`,
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

export default async function VisaGuideCountryPage({ params }) {
  const { countrySlug } = await params;
  const data = await getVisaGuideByCountry(countrySlug);

  if (!data) return notFound();

  const { jsonLd, country } = data;

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
      <VisaGuideCountryClient country={country} />
    </>
  );
}
