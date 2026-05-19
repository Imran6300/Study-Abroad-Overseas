export const runtime = "nodejs";
export const revalidate = 3600;

const BASE_URL = "https://www.khizaroverseas.in";

async function getValidSitemapCount() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=1&limit=1`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return 2;
    const data = await res.json();
    const total = data?.pagination?.total ?? data?.total ?? 0;
    if (!total) return 2;
    // 50 API pages per sitemap, ~20 unis per API page = ~1000 unis per sitemap
    return Math.max(1, Math.ceil(total / 1000));
  } catch {
    return 2;
  }
}

export async function GET() {
  try {
    const totalSitemaps = await getValidSitemapCount();
    const now = new Date().toISOString();

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
