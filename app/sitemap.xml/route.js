export const runtime = "nodejs";
export const revalidate = 3600;

const BASE_URL = "https://www.khizaroverseas.in";
const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

// Must match PAGES_PER_SITEMAP in sitemap-universities/[page]/route.js
const PAGES_PER_SITEMAP = 10;

async function getTotalSitemapCount() {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/public/sitemap-universities?page=1&limit=20`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      },
    );

    const data = await res.json();

    // Your API returns totalPages: 450 directly
    const totalApiPages = data?.totalPages;

    // 450 API pages / 10 pages per sitemap = 45 sitemaps
    return Math.ceil(totalApiPages / PAGES_PER_SITEMAP);
  } catch (err) {
    console.error("Failed to get sitemap count:", err.message);
    return 6; // safe fallback: covers 60 API pages = ~1200 unis
  }
}

export async function GET() {
  try {
    const totalSitemaps = await getTotalSitemapCount();
    const now = new Date().toISOString();

    console.log(
      `[sitemap.xml] generating ${totalSitemaps} university sitemaps`,
    );

    const universitySitemaps = Array.from(
      { length: totalSitemaps },
      (_, i) =>
        `  <sitemap>\n    <loc>${BASE_URL}/sitemap-universities/${i + 1}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
    ).join("\n");

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${universitySitemaps}\n  <sitemap>\n    <loc>${BASE_URL}/sitemap-countries</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${BASE_URL}/sitemap-static</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n</sitemapindex>`;

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
