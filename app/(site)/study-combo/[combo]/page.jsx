// app/(site)/study-combo/[combo]/page.jsx
//
// URL: /study-{courseSlug}-in-{countrySlug}  (e.g. /study-cybersecurity-in-jordan)
//
// FLOW:
//   1. Browser hits /study-cybersecurity-in-jordan
//   2. next.config.ts rewrites /study-:combo -> /study-combo/:combo
//      (this rule sits AFTER /study-in-:slug, so /study-in-* country
//      pages are never caught by this route)
//   3. This page renders with params.combo = "cybersecurity-in-jordan"
//   4. getComboPage("cybersecurity-in-jordan")
//        -> GET /api/public/combo/cybersecurity-in-jordan
//   5. Backend strips/splits on the LAST "-in-" to get
//        courseSlug = "cybersecurity", countrySlug = "jordan"
//   6. Returns { seo, jsonLd, course, country, universitiesInCountry }
//   7. ComboClient renders the page content

export const revalidate = 3600;

// Allow unknown combo slugs to still render (on-demand ISR for new combos
// added after the last build). Set to false if you want a hard 404 for
// any combo that wasn't pre-built by generateStaticParams.
export const dynamicParams = true;

import ComboClient from "./ComboClient";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Static params (pre-build all known combo pages at deploy time) ───────────

export async function generateStaticParams() {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/courses`, {
      cache: "no-store", // always fetch fresh at build time
    });
    if (!res.ok) return [];
    const json = await res.json();
    const courses = json.courses || [];

    const combos = [];
    for (const course of courses) {
      // comboPageSlugs is pre-populated by the backend generateComboSlugs script.
      // Skip courses that have no country relationships.
      if (course.comboPageSlugs?.length) {
        for (const countrySlug of course.comboPageSlugs) {
          combos.push({ combo: `${course.slug}-in-${countrySlug}` });
        }
      }
    }
    return combos;
  } catch {
    return [];
  }
}

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function getComboPage(combo) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/public/combo/${combo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return json; // { seo, jsonLd, course, country, universitiesInCountry }
  } catch {
    return null;
  }
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { combo } = await params;
  const data = await getComboPage(combo);

  if (!data) return { title: "Page Not Found | Khizar Overseas" };

  const { seo, course, country } = data;
  const canonical = `${BASE_URL}/study-${combo}`;

  return {
    title: seo.title,
    description: seo.description,

    alternates: { canonical: seo.canonical || canonical },
    robots: { index: !seo.noIndex, follow: true },

    keywords: [
      `study ${course.title} in ${country.name}`,
      `${course.title} universities in ${country.name}`,
      `${course.title} fees in ${country.name}`,
      `${course.title} ${country.name} for indian students`,
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
              alt: `Study ${course.title} in ${country.name} — Khizar Overseas`,
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

export default async function StudyComboPage({ params }) {
  const { combo } = await params;
  const data = await getComboPage(combo);

  if (!data) return notFound();

  const { jsonLd, course, country, universitiesInCountry } = data;

  return (
    <>
      {jsonLd?.course && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.course) }}
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
      <ComboClient
        course={course}
        country={country}
        universities={universitiesInCountry || []}
        combo={combo}
      />
    </>
  );
}
