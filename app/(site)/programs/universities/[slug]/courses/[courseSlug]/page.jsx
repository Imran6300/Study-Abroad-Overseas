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
// FIX (Organic Growth Audit — 48K-page OOM build, July 2026):
// dynamicParams=false + generateStaticParams pulling ALL 48,038
// university×course combos meant every deploy tried to pre-render all
// 48K pages up front, each with its own live fetch during the build —
// that's what OOM'd the Vercel build.
//
// Course×country (study-combo/[combo]/page.jsx) stays dynamicParams=false
// as-is: only ~1,885 combos, cheap to fully pre-build, no change needed.
//
// University×course is a different scale problem, so it gets a different
// fix: pre-build only the "hot set" (universities with a real qsRanking —
// a reasonable proxy for search-traffic-worthy) at deploy time, and let
// dynamicParams=true generate everything else on first real visit/crawl,
// caching for 24h same as the pre-built pages after that. The sitemap
// still lists all 48,038 real URLs unchanged — Google discovers and
// crawls them over time, and each first real hit is what triggers that
// page's one-time on-demand generation. getUniversityCourse's own
// university/course-existence + offersThisCourse checks are what protect
// against bot-guessed junk URLs generating garbage cache entries — not a
// hard-coded static list — so this doesn't reopen the original
// ISR-write-overage problem that dynamicParams=false was added to solve.
// FIX (ISR write overage, staying on Hobby, July 2026): this is the
// highest-page-count route (48,038 combos). Going 24h → 7 days cuts
// regeneration-triggered writes on this route alone to roughly 1/7th.
// Fee/course data at this level doesn't change often enough to need
// daily freshness. Use the on-demand revalidate route for anything that
// needs to go live immediately (new course added, fee updated).
export const revalidate = 604800; // 7 days (was 86400)
export const dynamicParams = true;

import UniversityCourseClient from "./UniversityCourseClient";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Static params (pre-build only the qsRanking'd hot set) ───────────────

export async function generateStaticParams() {
  if (!API_URL) return [];
  try {
    const res = await fetch(
      `${API_URL}/api/public/university-course-slugs?rankedOnly=true`,
      {
        cache: "no-store", // always fetch fresh at build time
      },
    );
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
//
// FIX (Organic Growth Audit — silent 404 bake-in, July 2026): same issue as
// study-combo/[combo]/page.jsx's getComboPage — a transient network/backend
// hiccup during the concurrent build was silently treated as "doesn't
// exist" and baked in as a wrong static page. Retries transient failures;
// a genuine 404 or { success: false } still returns null immediately.

async function getUniversityCourse(uniSlug, courseSlug, attempt = 1) {
  if (!API_URL) return null;
  const MAX_ATTEMPTS = 3;
  try {
    const res = await fetch(
      `${API_URL}/api/universities/${uniSlug}/courses/${courseSlug}`,
      { next: { revalidate: 86400 } },
    );

    if (res.status === 404) return null; // genuine "doesn't exist" — don't retry

    if (!res.ok) {
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, attempt * 500));
        return getUniversityCourse(uniSlug, courseSlug, attempt + 1);
      }
      console.error(
        `[uni-course] "${uniSlug}/${courseSlug}" failed after ${MAX_ATTEMPTS} attempts: HTTP ${res.status}`,
      );
      return null;
    }

    const json = await res.json();
    if (!json.success) return null;
    return json; // { seo, jsonLd, university, course, offersThisCourse }
  } catch (err) {
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, attempt * 500));
      return getUniversityCourse(uniSlug, courseSlug, attempt + 1);
    }
    console.error(
      `[uni-course] "${uniSlug}/${courseSlug}" failed after ${MAX_ATTEMPTS} attempts:`,
      err.message,
    );
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
