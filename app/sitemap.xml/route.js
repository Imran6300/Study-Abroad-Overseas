/**
 * app/sitemap.xml/route.js  (or app/sitemap/route.js depending on your structure)
 *
 * FIX: The old version declared 10 university sitemaps unconditionally.
 * Google fetches all 10, finds most empty, and may penalise the domain.
 *
 * New approach: ask the API how many universities exist, calculate the
 * real number of sitemaps needed, and only declare those.
 * Falls back to a safe default (3) if the API is unreachable.
 */

export const runtime = "nodejs";
export const revalidate = 3600;

const BASE_URL = "https://www.khizaroverseas.in";
// Must match the limit used in sitemap-universities/[page]/route.js
const UNIS_PER_SITEMAP = 1000;

async function getTotalUniversityCount() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=1&limit=1`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    // Your API should return total in pagination; adjust the field name if needed
    return data?.pagination?.total ?? data?.total ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const total = await getTotalUniversityCount();
    // If API fails, assume 3 sitemaps (safe floor for ~3000 universities)
    const totalSitemaps = total
      ? Math.max(1, Math.ceil(total / UNIS_PER_SITEMAP))
      : 3;

    const universitySitemaps = Array.from(
      { length: totalSitemaps },
      (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemap-universities/${i + 1}</loc>
  </sitemap>`,
    ).join("");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${universitySitemaps}

  <sitemap>
    <loc>${BASE_URL}/sitemap-countries</loc>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/sitemap-static</loc>
  </sitemap>

</sitemapindex>`;

    return new Response(body, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("MAIN SITEMAP ERROR:", error);
    return new Response("Failed to generate sitemap index", { status: 500 });
  }
}
