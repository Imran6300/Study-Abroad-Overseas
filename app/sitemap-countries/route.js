export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const baseUrl = "https://www.khizaroverseas.in";

    let allCountries = [];
    let page = 1;
    let hasMore = true;

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
      .map((c) => {
        const lastmod = new Date(
          c.updatedAt || c.createdAt || Date.now(),
        ).toISOString();

        // Image sitemap entry improves indexing & can trigger image previews
        const imageTag = c.heroImage?.url
          ? `
  <image:image>
    <image:loc>${escapeXml(c.heroImage.url)}</image:loc>
    <image:title>Study in ${escapeXml(c.name)} 2026 for Indian Students</image:title>
  </image:image>`
          : "";

        return `
<url>
  <loc>${baseUrl}/all-countries/${c.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>${imageTag}
</url>`;
      })
      .join("");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { status: 200, headers: { "Content-Type": "application/xml" } },
    );
  }
}

function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
