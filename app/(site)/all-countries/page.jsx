import CountriesClient from "./allCountriesClient";
import { buildItemListJsonLd } from "@/lib/structuredData";

const BASE_URL = "https://www.khizaroverseas.in";

// FIX (Organic Growth Audit, Section 12/14, item #3): "Load More Countries"
// was a client-only fetch with no backing URL — page 2+ of the 200-country
// directory had zero crawlable <a href> and no independently-discoverable
// URL. Same fix pattern as /blog and /programs/universities: read
// ?page=/&search=/&region= server-side, fetch that exact page, render real
// <Link href="/all-countries?..."> pagination (see PaginationNav in
// allCountriesClient.jsx).
//
// generateMetadata overrides the static title/canonical previously set in
// layout.jsx with a page-aware, self-referencing canonical — pointing
// every page back at the layout's flat "/all-countries" canonical would
// tell Google to ignore pages 2+ entirely.
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const region = params?.region || "";
  const page = Math.max(1, parseInt(params?.page) || 1);

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (region) query.set("region", region);
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  const canonical = `${BASE_URL}/all-countries${qs ? `?${qs}` : ""}`;

  const baseTitle =
    "Study Abroad Countries 2026 | Visa Success Rates for Indian Students";

  return {
    title: page > 1 ? `${baseTitle} — Page ${page}` : baseTitle,
    description:
      "Compare visa success rates, tuition fees & scholarships for 100+ study abroad destinations. Expert guidance from Hyderabad. Free counseling — get your profile assessed today.",
    alternates: { canonical },
  };
}

async function getCountries(search, region, page) {
  const query = new URLSearchParams({ page: String(page), limit: "20" });
  if (search) query.set("search", search);
  if (region && region !== "All Regions") query.set("continent", region);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?${query.toString()}`,
      { next: { revalidate: 86400 } },
    );

    if (!res.ok) {
      console.error(`[all-countries] fetch failed: ${res.status}`);
      return { data: [], pagination: {} };
    }

    return res.json();
  } catch (err) {
    console.error("[all-countries] fetch error:", err.message);
    return { data: [], pagination: {} };
  }
}

export default async function CountriesPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const region = params?.region || "All Regions";
  const page = Math.max(1, parseInt(params?.page) || 1);

  const data = await getCountries(search, region, page);
  const countries = data.data || [];

  // ItemList JSON-LD (Step 4 fix) — this page had NO structured data before.
  // Same shared builder used on /courses, /programs/universities and /blog.
  const structuredData = buildItemListJsonLd(countries.slice(0, 20), {
    name: search
      ? `Study Abroad Destinations matching "${search}"`
      : "Study Abroad Countries 2026",
    description:
      "Visa success rates, tuition fees and scholarships for study abroad destinations.",
    url: `${BASE_URL}/all-countries`,
    toListItem: (country, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: country.name,
      url: `${BASE_URL}/study-in-${country.slug}`,
    }),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CountriesClient
        initialCountries={countries}
        initialPagination={data.pagination || {}}
        initialSearch={search}
        initialRegion={region}
      />
    </>
  );
}
