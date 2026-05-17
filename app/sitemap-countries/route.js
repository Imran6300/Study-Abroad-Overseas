export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const baseUrl = "https://www.khizaroverseas.in";

    let allCountries = [];
    let page = 1;
    let hasMore = true;

    // Paginate through all countries
    while (hasMore) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?page=${page}&limit=100`,
        {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(15000),
        },
      );

      if (!res.ok) break;

      const data = await res.json();
      const countries = data?.data ?? [];

      if (countries.length === 0) {
        hasMore = false;
      } else {
        allCountries.push(...countries);
        hasMore = data?.pagination?.hasNextPage ?? false;
        page++;
      }
    }

    // Deduplicate by slug
    const unique = Array.from(
      new Map(allCountries.map((c) => [c.slug, c])).values(),
    );

    const urls = unique
      .filter((c) => c?.slug && c?.name)
      .map(
        (c) => `
<url>
  <loc>${baseUrl}/all-countries/${c.slug}</loc>
  <lastmod>${new Date(c.updatedAt || c.createdAt || Date.now()).toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>`,
      )
      .join("");

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
    console.error("COUNTRIES SITEMAP ERROR:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><error><message>Failed to generate sitemap</message></error>`,
      { status: 500, headers: { "Content-Type": "application/xml" } },
    );
  }
}
