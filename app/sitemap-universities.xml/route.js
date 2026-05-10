export const revalidate = 3600;

export async function GET() {
  try {
    const baseUrl = "https://www.khizaroverseas.in";

    // FIRST REQUEST
    const firstRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=1`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!firstRes.ok) {
      throw new Error("Failed to fetch first universities page");
    }

    const firstData = await firstRes.json();

    const totalPages = firstData.totalPages || 1;

    // IMPORTANT:
    // Start with lower number for stability
    // Later you can increase gradually
    const MAX_PAGES = 50;

    let allUniversities = [...(firstData.universities || [])];

    // PARALLEL FETCHING (VERY FAST)
    const requests = [];

    for (let i = 2; i <= Math.min(totalPages, MAX_PAGES); i++) {
      requests.push(
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=${i}`,
          {
            next: { revalidate: 3600 },
          },
        ).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed on page ${i}`);
          }

          return res.json();
        }),
      );
    }

    // FETCH ALL TOGETHER
    const results = await Promise.all(requests);

    // MERGE ALL UNIVERSITIES
    results.forEach((data) => {
      if (data?.universities?.length) {
        allUniversities.push(...data.universities);
      }
    });

    // REMOVE DUPLICATES
    const uniqueUniversities = Array.from(
      new Map(allUniversities.map((uni) => [uni.slug, uni])).values(),
    );

    // GENERATE XML URLS
    const urls = uniqueUniversities
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
