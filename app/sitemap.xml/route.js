export const runtime = "nodejs";
export const revalidate = 3600;

const BASE_URL = "https://www.khizaroverseas.in";
const MAX_SITEMAPS_TO_CHECK = 15; // check up to 15, list only ones with data

async function getValidSitemapPages() {
  const checks = Array.from({ length: MAX_SITEMAPS_TO_CHECK }, (_, i) =>
    fetch(`${BASE_URL}/sitemap-universities/${i + 1}`, {
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 3600 },
    })
      .then((res) => ({ page: i + 1, ok: res.ok && res.status === 200 }))
      .catch(() => ({ page: i + 1, ok: false })),
  );

  const results = await Promise.all(checks);
  return results.filter((r) => r.ok).map((r) => r.page);
}

export async function GET() {
  try {
    const validPages = await getValidSitemapPages();
    const now = new Date().toISOString();

    // If discovery fails entirely, fallback to page 1 only
    const pagesToList = validPages.length > 0 ? validPages : [1];

    const universitySitemaps = pagesToList
      .map(
        (page) =>
          `  <sitemap>\n    <loc>${BASE_URL}/sitemap-universities/${page}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
      )
      .join("\n");

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
