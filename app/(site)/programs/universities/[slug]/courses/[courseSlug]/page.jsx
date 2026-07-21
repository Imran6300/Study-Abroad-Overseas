// app/(site)/programs/universities/[slug]/courses/[courseSlug]/page.jsx
//
// URL: /programs/universities/{uniSlug}/courses/{courseSlug}
// e.g. /programs/universities/university-of-edinburgh/courses/msc-computer-science
//
// FIX (Organic Growth Audit, Step 5 — the biggest lever in the report):
// this is the single highest-intent page type the site was missing.
// Backend was already done — comboPageController.getUniversityCourse is
// mounted at GET /api/universities/:uniSlug/courses/:courseSlug (via
// seoRouter, which is mounted at both "/" and "/api" in app.js) and
// already returns { seo, jsonLd, university, course, offersThisCourse }.
// It just had no Next.js route consuming it.
//
// Route folder is [slug]/courses/[courseSlug] — NOT [uniSlug]/... — because
// Next.js requires every dynamic segment at the same folder level to share
// one param name, and programs/universities/[slug]/page.jsx already claims
// "slug" for the university detail page at that level.
//
// Static-params + dynamicParams=false mirrors the exact fix already applied
// to study-combo/[combo]/page.jsx after the Vercel ISR-write-overage
// incident: only pre-build the combos that
// GET /api/public/university-course-slugs actually returns (i.e. real
// University.comboPageSlugs relationships) — everything else 404s instead
// of silently manufacturing a new ISR cache entry for bot-guessed URLs.

export const revalidate = 86400;
export const dynamicParams = false;

import UniversityCourseClient from "./UniversityCourseClient";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Static params (pre-build every known university×course combo) ────────

export async function generateStaticParams() {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/public/university-course-slugs`, {
      cache: "no-store", // always fetch fresh at build time
    });
    if (!res.ok) return [];
    const json = await res.json();
    const universities = json.universities || [];

    const params = [];
    for (const uni of universities) {
      for (const courseSlug of uni.courseSlugs || []) {
        params.push({ slug: uni.slug, courseSlug });
      }
    }
    return params;
  } catch {
    return [];
  }
}

// ─── Data fetcher ───────────────────────────────────────────────────────────

async function getUniversityCourse(uniSlug, courseSlug) {
  if (!API_URL) return null;
  try {
    const res = await fetch(
      `${API_URL}/api/universities/${uniSlug}/courses/${courseSlug}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return json; // { seo, jsonLd, university, course, offersThisCourse }
  } catch {
    return null;
  }
}

// ─── generateMetadata ───────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug, courseSlug } = await params;
  const data = await getUniversityCourse(slug, courseSlug);

  if (!data) return { title: "Page Not Found | Khizar Overseas" };

  const { seo, university, course } = data;
  const canonical = `${BASE_URL}/programs/universities/${slug}/courses/${courseSlug}`;

  return {
    title: seo.title,
    description: seo.description,

    alternates: { canonical: seo.canonical || canonical },
    robots: { index: !seo.noIndex, follow: true },

    keywords: [
      `${course.title} at ${university.name}`,
      `${course.title} fees ${university.name}`,
      `${university.name} admission requirements`,
      `study ${course.title} in ${university.country?.name}`,
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
              alt: `${course.title} at ${university.name} — Khizar Overseas`,
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

export default async function UniversityCoursePage({ params }) {
  const { slug, courseSlug } = await params;
  const data = await getUniversityCourse(slug, courseSlug);

  if (!data) return notFound();

  const { jsonLd, university, course, offersThisCourse } = data;

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
      <UniversityCourseClient
        university={university}
        course={course}
        offersThisCourse={offersThisCourse}
      />
    </>
  );
}
