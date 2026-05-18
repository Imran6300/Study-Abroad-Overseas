export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(req, { params }) {
  try {
    const baseUrl = "https://www.khizaroverseas.in";
    const sitemapPage = Number(params.page || 1);

    // Each sitemap chunk covers 50 backend API pages
    // (~1000 universities if API limit = 20)
    const PAGES_PER_SITEMAP = 50;

    const startPage = (sitemapPage - 1) * PAGES_PER_SITEMAP + 1;

    const endPage = sitemapPage * PAGES_PER_SITEMAP;

    // Fetch in batches to avoid API overload
    const BATCH_SIZE = 10;

    let allUniversities = [];

    for (
      let batchStart = startPage;
      batchStart <= endPage;
      batchStart += BATCH_SIZE
    ) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, endPage);

      const requests = [];

      for (let i = batchStart; i <= batchEnd; i++) {
        requests.push(
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=${i}`,
            {
              next: { revalidate: 3600 },
              cache: "force-cache",
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

      results.forEach((data) => {
        if (data?.universities?.length) {
          allUniversities.push(...data.universities);
        }
      });
    }

    // Remove duplicates by slug
    const uniqueUniversities = Array.from(
      new Map(allUniversities.map((uni) => [uni.slug, uni])).values(),
    );

    // Only include high-quality universities
    const validUniversities = uniqueUniversities.filter((uni) => {
      const confidence = Number(
        uni?.enrichment?.confidenceScore ?? uni?.confidenceScore ?? 0,
      );

      const hasDescription = (uni?.description?.length || 0) >= 200;

      return uni?.slug && uni?.name && confidence >= 0.75 && hasDescription;
    });

    console.log(
      `[sitemap-universities/${sitemapPage}] total: ${uniqueUniversities.length}, valid: ${validUniversities.length}`,
    );

    // VERY IMPORTANT:
    // Never return empty sitemap XML
    // Google throws "Missing XML tag: url"
    if (validUniversities.length === 0) {
      return new Response("Not Found", {
        status: 404,
      });
    }

    const urls = validUniversities
      .map((uni) => {
        const lastmod = new Date(
          uni.updatedAt || uni.createdAt || Date.now(),
        ).toISOString();

        const imageTag = uni.image?.url
          ? `
  <image:image>
    <image:loc>${escapeXml(uni.image.url)}</image:loc>
    <image:title>${escapeXml(uni.name)} — Study Abroad 2026</image:title>
  </image:image>`
          : "";

        return `
<url>
  <loc>${baseUrl}/programs/universities/${uni.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>${imageTag}
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
    console.error("UNIVERSITIES SITEMAP ERROR:", error);

    return new Response("Sitemap generation failed", {
      status: 500,
    });
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
