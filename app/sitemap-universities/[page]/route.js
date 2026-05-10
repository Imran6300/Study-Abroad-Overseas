export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(req, { params }) {
  try {
    const baseUrl = "https://www.khizaroverseas.in";

    // DYNAMIC SITEMAP NUMBER
    const sitemapPage = Number(params.page || 1);

    // HOW MANY API PAGES PER SITEMAP
    const PAGES_PER_SITEMAP = 100;

    // CALCULATE START/END
    const startPage = (sitemapPage - 1) * PAGES_PER_SITEMAP + 1;

    const endPage = sitemapPage * PAGES_PER_SITEMAP;

    let allUniversities = [];

    // PARALLEL REQUESTS
    const requests = [];

    for (let i = startPage; i <= endPage; i++) {
      requests.push(
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=${i}`,
          {
            next: { revalidate: 3600 },
          },
        ).then(async (res) => {
          if (!res.ok) return null;

          return res.json();
        }),
      );
    }

    const results = await Promise.all(requests);

    // MERGE DATA
    results.forEach((data) => {
      if (data?.universities?.length) {
        allUniversities.push(...data.universities);
      }
    });

    // REMOVE DUPLICATES
    const uniqueUniversities = Array.from(
      new Map(allUniversities.map((uni) => [uni.slug, uni])).values(),
    );

    // FILTER GOOD QUALITY UNIVERSITIES
    const validUniversities = uniqueUniversities.filter((uni) => {
      const confidence = uni.confidenceScore || 0;

      const descriptionLength = uni.description?.length || 0;

      return confidence >= 0.75 && descriptionLength >= 300;
    });

    // XML URLS
    const urls = validUniversities
      .filter((uni) => uni?.slug)
      .map(
        (uni) => `
    <url>
      <loc>${baseUrl}/programs/universities/${uni.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`,
      )
      .join("");

    // FINAL XML
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(body, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("SITEMAP ERROR:", error);

    return new Response("Failed to generate sitemap", {
      status: 500,
    });
  }
}
