export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const baseUrl = "https://www.khizaroverseas.in";

    const totalUniversities = 10000;
    const universitiesPerSitemap = 1000;
    const totalSitemaps = Math.ceil(totalUniversities / universitiesPerSitemap);

    const universitySitemaps = Array.from(
      { length: totalSitemaps },
      (_, i) => `
<sitemap>
  <loc>${baseUrl}/sitemap-universities/${i + 1}</loc>
</sitemap>`,
    ).join("");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${universitySitemaps}

<sitemap>
  <loc>${baseUrl}/sitemap-countries</loc>
</sitemap>

<sitemap>
  <loc>${baseUrl}/sitemap-static</loc>
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
