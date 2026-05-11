export const dynamic = "force-dynamic";

export const runtime = "nodejs";

export const revalidate = 3600;

export async function GET(req, context) {
  try {
    const baseUrl = "https://www.khizaroverseas.in";

    // FIXED PARAM HANDLING
    const { page } = await context.params;

    const sitemapPage = Number(page || 1);

    // 50 API pages
    // ≈ 1000 universities
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
            next: {
              revalidate: 3600,
            },

            signal: AbortSignal.timeout(15000),

            cache: "force-cache",
          },
        )
          .then(async (res) => {
            if (!res.ok) return null;

            return res.json();
          })
          .catch(() => null),
      );
    }

    // FETCH ALL
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

    // QUALITY FILTERING
    const validUniversities = uniqueUniversities.filter((uni) => {
      const confidence = Number(uni?.enrichment?.confidenceScore || 0);

      return uni?.slug && uni?.name && confidence >= 0.75;
    });

    console.log("TOTAL:", uniqueUniversities.length);

    console.log("VALID:", validUniversities.length);

    // XML URLS
    const urls = validUniversities
      .map(
        (uni) => `
<url>
  <loc>
    ${baseUrl}/programs/universities/${uni.slug}
  </loc>

  <lastmod>
    ${new Date(uni.updatedAt || uni.createdAt || Date.now()).toISOString()}
  </lastmod>
</url>`,
      )
      .join("");

    // FINAL XML
    const body = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>`;

    return new Response(body, {
      status: 200,

      headers: {
        "Content-Type": "application/xml; charset=utf-8",

        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("UNIVERSITIES SITEMAP ERROR:", error);

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>
    Failed to generate sitemap
  </message>
</error>`,
      {
        status: 500,

        headers: {
          "Content-Type": "application/xml; charset=utf-8",
        },
      },
    );
  }
}
