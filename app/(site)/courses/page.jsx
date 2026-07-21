// app/(site)/courses/page.jsx
//
// FIX (Organic Growth Audit, Section 2/14, item #1):
// This page was previously 100% client-rendered — "use client", data
// fetched client-side via Redux (fetchCourses), no generateMetadata
// export. Googlebot got an empty shell on first paint and this page
// inherited the generic root title/description instead of its own.
// That's a real problem specifically HERE because /courses is one of
// the highest-authority internal-linking hubs in the site (closest to
// homepage, meant to distribute link equity to every course page).
//
// Fix mirrors the pattern already working correctly in
// programs/universities/page.jsx and all-countries/page.jsx:
//   - Server component fetches data once (ISR, 24h — same cadence as
//     every other entity page in this app).
//   - generateMetadata gives this page its own real title/description.
//   - A crawlable <ul><li><Link>...</Link></li></ul> list (sr-only) is
//     rendered server-side so Googlebot has actual <a href> anchors to
//     every course page even before any client JS runs.
//   - ItemList JSON-LD added (Section 12, item #6 / Section 9).
//   - Interactive search/category filtering moves into CoursesClient.jsx
//     (a client component) which receives the already-fetched course
//     list as a prop — no client-side fetch, no Redux dependency.
//
// The backend endpoint (GET /api/courses) already returns the full,
// unpaginated course list — same one study-combo/[combo]/page.jsx
// already uses at build time via generateStaticParams. Course counts in
// this niche run in the dozens/low hundreds, not thousands, so a single
// fetch (no pagination) is correct here — unlike /programs/universities
// and /all-countries, which paginate because they run into the
// thousands.

import Link from "next/link";
import CoursesClient from "./CoursesClient";
import { buildItemListJsonLd } from "@/lib/structuredData";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getCourses() {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/courses`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      console.error(`[courses] fetch failed: ${res.status}`);
      return [];
    }
    const json = await res.json();
    return json?.courses || [];
  } catch (err) {
    console.error("[courses] fetch error:", err.message);
    return [];
  }
}

// ─── generateMetadata ───────────────────────────────────────────────────────
// Static (not dynamic per-searchParams) is fine here: unlike /blog's
// ?page=N, the category chips on this page are a client-side filter over
// an already-fetched list, not a distinct server-rendered page of
// results — so there's one canonical URL for the hub, matching how
// programs/universities/page.jsx treats ?search= (no separate canonical
// per query). If category filtering is ever converted to real
// server-rendered ?category=X routes with distinct content, revisit this
// the same way /blog handles ?page=N.
export const metadata = {
  title:
    "Study Abroad Courses 2026 | Engineering, Business & Healthcare Programs",
  description:
    "Browse study abroad programs in engineering, business, healthcare and more. Compare duration, fees and top universities. Free counseling from Khizar Overseas, Hyderabad.",
  keywords: [
    "study abroad courses 2026",
    "engineering courses abroad for indian students",
    "mba abroad for indian students",
    "healthcare courses abroad",
    "study abroad course fees",
    "study abroad consultants hyderabad",
  ],
  alternates: {
    canonical: `${BASE_URL}/courses`,
  },
  openGraph: {
    title: "Study Abroad Courses 2026 | Khizar Overseas",
    description:
      "Compare study abroad programs across engineering, business, healthcare and more — fees, duration and top universities. Free counseling from Khizar Overseas.",
    url: `${BASE_URL}/courses`,
    siteName: "Khizar Overseas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Abroad Courses 2026 | Khizar Overseas",
    description:
      "Compare study abroad programs across engineering, business, healthcare and more. Free counseling from Khizar Overseas.",
  },
};

export default async function Courses() {
  const courses = await getCourses();

  // ItemList JSON-LD — now built via the shared helper (Step 4 fix) so this
  // page produces the exact same shape as /programs/universities,
  // /all-countries and /blog instead of a bespoke inline object.
  const structuredData = buildItemListJsonLd(courses.slice(0, 50), {
    name: "Study Abroad Courses | Khizar Overseas",
    description:
      "Programmatic list of study abroad courses across engineering, business, healthcare and more.",
    url: `${BASE_URL}/courses`,
    toListItem: (course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: course.title,
      url: `${BASE_URL}/courses/${course.slug}`,
    }),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Crawlable link list — server-rendered, present before any client
          JS runs. Mirrors the sr-only list already used on
          programs/universities/page.jsx. */}
      <div className="sr-only">
        <h2>All Study Abroad Courses</h2>
        <ul>
          {courses.map((course) => (
            <li key={course._id || course.slug}>
              <Link href={`/courses/${course.slug}`}>
                {course.title} — {course.duration}, {course.field}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <CoursesClient initialCourses={courses} />
    </>
  );
}
