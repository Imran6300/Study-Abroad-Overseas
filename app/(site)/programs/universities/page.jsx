import UniversitiesClient from "./UniversitiesClient";
import Link from "next/link";
import { buildItemListJsonLd } from "@/lib/structuredData";

const BASE_URL = "https://www.khizaroverseas.in";

// FIX (Organic Growth Audit, Section 12/14, item #2):
// "Load More Universities" was a client-only fetch with no backing URL —
// page 2+ of an 8,983-university directory had zero crawlable <a href>
// anywhere in server-rendered HTML, and no /programs/universities?page=2
// URL for Google to discover or index independently. Same root cause,
// same fix pattern as the /blog fix this mirrors: read ?page= server-side,
// fetch that page, render real <Link href="...?page=N"> pagination.
//
// generateMetadata (not a static `metadata` export) because each page
// needs its own self-referencing canonical — pointing every page back at
// page 1 would tell Google to ignore pages 2+ entirely, the same mistake
// that was already fixed once on /blog.
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = Math.max(1, parseInt(params?.page) || 1);

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  const canonical = `${BASE_URL}/programs/universities${qs ? `?${qs}` : ""}`;

  const baseTitle = search
    ? `Universities in ${search} for Indian Students`
    : "Top Universities Abroad 2026 | Fees, Rankings & Admission for Indians";

  return {
    title: page > 1 ? `${baseTitle} — Page ${page}` : baseTitle,
    description:
      "Search 9,000+ universities in UK, USA, Canada, Europe & more. Compare fees, rankings, courses & admission requirements. Free counseling from Khizar Overseas, Hyderabad.",
    keywords: [
      "top universities abroad for indian students",
      "universities abroad 2026",
      "study abroad university list",
      "best universities uk for indian students",
      "best universities usa for indian students",
      "university fees abroad for indian students",
      "study abroad consultants hyderabad",
    ],
    alternates: { canonical },
    openGraph: {
      title: baseTitle,
      description:
        "Compare 9,000+ universities worldwide. Check fees, rankings & apply with expert help from Khizar Overseas.",
      url: canonical,
      siteName: "Khizar Overseas",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description:
        "Compare 9,000+ universities worldwide. Fees, rankings & free counseling from Khizar Overseas.",
    },
  };
}

const PAGE_SIZE = 20;

async function getUniversities(search, page) {
  const endpoint = search
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${encodeURIComponent(search)}&page=${page}&limit=${PAGE_SIZE}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=${page}&limit=${PAGE_SIZE}`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 86400 } });
    if (!res.ok) {
      console.error(`[programs/universities] fetch failed: ${res.status}`);
      return { universities: [], totalPages: 1, total: 0 };
    }
    const data = await res.json();
    return {
      universities: data?.universities || [],
      totalPages: data?.totalPages || 1,
      total: data?.total || 0,
    };
  } catch (err) {
    console.error("[programs/universities] fetch error:", err.message);
    return { universities: [], totalPages: 1, total: 0 };
  }
}

export default async function UniversitiesPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const currentPage = Math.max(1, parseInt(params?.page) || 1);

  const { universities, totalPages, total } = await getUniversities(
    search,
    currentPage,
  );

  // ItemList JSON-LD — now via the shared helper (Step 4 fix), same shape
  // used on /courses, /all-countries and /blog.
  const structuredData = buildItemListJsonLd(universities.slice(0, 20), {
    name: search
      ? `Universities in ${search} for Indian Students`
      : "Top Universities Abroad for Indian Students 2026",
    description:
      "Comprehensive list of universities abroad for Indian students with fees, rankings and admission guidance.",
    url: `${BASE_URL}/programs/universities`,
    toListItem: (uni, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: uni.name,
      url: `${BASE_URL}/programs/universities/${uni.slug}`,
    }),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Visible H1 — critical for SEO, use sr-only only if design requires */}
      <h1 className="sr-only">
        {search
          ? `Top Universities in ${search} for Indian Students 2026`
          : "Top Universities Abroad for Indian Students 2026"}
      </h1>

      {/* Crawlable link list for Googlebot */}
      <div className="sr-only">
        <ul>
          {universities.map((uni) => (
            <li key={uni._id}>
              <Link href={`/programs/universities/${uni.slug}`}>
                {uni.name} — Study in {uni.country?.name} | Fees & Admission
                2026
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <UniversitiesClient
        universities={universities}
        initialSearch={search}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
      />
    </>
  );
}
