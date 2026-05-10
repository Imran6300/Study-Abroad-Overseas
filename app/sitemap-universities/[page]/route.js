export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(req, { params }) {
  try {
    const baseUrl = "https://www.khizaroverseas.in";

    // CURRENT SITEMAP PAGE
    const sitemapPage = Number(params.page || 1);

    // 50 API pages × 20 universities
    // ≈ 1000 universities per sitemap
    const PAGES_PER_SITEMAP = 50;

    // PAGE RANGE
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
            signal: AbortSignal.timeout(15000),
          },
        )
          .then(async (res) => {
            if (!res.ok) return null;

            return res.json();
          })
          .catch(() => null),
      );
    }

    const results = await Promise.all(requests);

    // MERGE UNIVERSITIES
    results.forEach((data) => {
      if (data?.universities?.length) {
        allUniversities.push(...data.universities);
      }
    });

    // REMOVE DUPLICATES
    const uniqueUniversities = Array.from(
      new Map(allUniversities.map((uni) => [uni.slug, uni])).values(),
    );

    // QUALITY FILTERING
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
      <lastmod>${new Date(
        uni.updatedAt || uni.createdAt || Date.now(),
      ).toISOString()}</lastmod>
    </url>`,
      )
      .join("");

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
    console.error("UNIVERSITIES SITEMAP ERROR:", error);

    return new Response("Failed to generate sitemap", {
      status: 500,
    });
  }
}
