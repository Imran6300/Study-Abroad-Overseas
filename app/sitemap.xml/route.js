export const runtime = "nodejs";
export const revalidate = 3600;

const BASE_URL = "https://www.khizaroverseas.in";
const UNIS_PER_SITEMAP = 1000;

async function getTotalUniversityCount() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=1&limit=1`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.pagination?.total ?? data?.total ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const total = await getTotalUniversityCount();
    const totalSitemaps = total
      ? Math.max(1, Math.ceil(total / UNIS_PER_SITEMAP))
      : 10; // safe default for ~9,379 discovered URLs

    const now = new Date().toISOString();

    const universitySitemaps = Array.from(
      { length: totalSitemaps },
      (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemap-universities/${i + 1}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    ).join("");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${universitySitemaps}

  <sitemap>
    <loc>${BASE_URL}/sitemap-countries</loc>
    <lastmod>${now}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/sitemap-static</loc>
    <lastmod>${now}</lastmod>
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
