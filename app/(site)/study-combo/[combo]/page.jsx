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

// FIX (ISR write overage, on-demand-only, July 2026): 1,885 combo pages on
// a 24h timer still bill a write every time a page is revisited after its
// window. courseController.updateCourse already calls triggerRevalidate()
// for every comboPageSlugs entry on save, so the timer is redundant.
// revalidate=false caches each page indefinitely until a real edit.
export const revalidate = false;

// FIX (Vercel ISR write overage, July 2026): this was previously `true`,
// which meant ANY slug matching /study-:combo — including bot-guessed,
// scraped, or malformed combos never returned by generateStaticParams —
// would trigger an on-demand render-and-write to the ISR cache. Since this
// route has the largest URL surface in the app (course x country), that
// was the single biggest driver of ISR Writes blowing past the Vercel plan
// limit. generateStaticParams() below already builds every legitimate
// combo from Course.comboPageSlugs, so anything outside that list is not
// a real page and should 404, not silently manufacture a new cache entry.
//
// If you add a new course/country relationship and want its combo page
// live immediately (without waiting for the next deploy), call the
// on-demand revalidation route (see app/api/revalidate/route.js) from the
// backend after the relationship is created, instead of flipping this
// back to true.
export const dynamicParams = false;

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
//
// FIX (Organic Growth Audit — silent 404 bake-in, July 2026): this used to
// catch ANY failure (network timeout, dropped connection, backend briefly
// overloaded) and return null identically to "this combo genuinely doesn't
// exist" — which triggers notFound(). During a build statically generating
// ~1,885 of these pages, each firing its own live fetch, transient backend
// hiccups under that concurrency got permanently baked in as wrong 404
// pages (confirmed via curl: x-nextjs-prerender:1 + 200 status, but
// not-found content — i.e. the static file itself is wrong, not a cache or
// data problem). With dynamicParams=false there's no self-healing; a page
// generated wrong stays wrong until the next successful build.
//
// Retries a genuine network/5xx failure a few times with backoff before
// giving up. A real 404 (res.status === 404) or an explicit
// { success: false } from the API still returns null immediately — this
// only protects against transient failures, not real "doesn't exist" cases.
async function getComboPage(combo, attempt = 1) {
  if (!API_URL) return null;
  const MAX_ATTEMPTS = 3;
  try {
    const res = await fetch(`${API_URL}/api/public/combo/${combo}`, {
      next: { revalidate: 86400 },
    });

    if (res.status === 404) return null; // genuine "doesn't exist" — don't retry

    if (!res.ok) {
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, attempt * 500));
        return getComboPage(combo, attempt + 1);
      }
      console.error(
        `[study-combo] "${combo}" failed after ${MAX_ATTEMPTS} attempts: HTTP ${res.status}`,
      );
      return null;
    }

    const json = await res.json();
    if (!json.success) return null; // genuine API-level "not found"
    return json; // { seo, jsonLd, course, country, universitiesInCountry }
  } catch (err) {
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, attempt * 500));
      return getComboPage(combo, attempt + 1);
    }
    console.error(
      `[study-combo] "${combo}" failed after ${MAX_ATTEMPTS} attempts:`,
      err.message,
    );
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
