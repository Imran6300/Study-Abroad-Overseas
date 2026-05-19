export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 3600;

// Use server-side env var — NEXT_PUBLIC_ vars can be undefined in Route Handlers
const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function GET(req, { params }) {
  try {
    const baseUrl = "https://www.khizaroverseas.in";
    const sitemapPage = Number(params.page || 1);

    // 10 API pages × 20 unis = 200 raw unis per sitemap
    // After ~80% pass rate = ~160 valid unis per sitemap
    const PAGES_PER_SITEMAP = 10;
    const BATCH_SIZE = 5;

    const startPage = (sitemapPage - 1) * PAGES_PER_SITEMAP + 1;
    const endPage = sitemapPage * PAGES_PER_SITEMAP;

    console.log(
      `[sitemap-universities/${sitemapPage}] fetching API pages ${startPage}–${endPage} from ${BACKEND_URL}`,
    );

    // Bail early if no backend URL configured
    if (!BACKEND_URL) {
      console.error("BACKEND_URL is not set!");
      return new Response("Configuration error", { status: 500 });
    }

    let allUniversities = [];

    for (
      let batchStart = startPage;
      batchStart <= endPage;
      batchStart += BATCH_SIZE
    ) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, endPage);
      const requests = [];

      for (let i = batchStart; i <= batchEnd; i++) {
        const url = `${BACKEND_URL}/api/universities?page=${i}&limit=20`;
        requests.push(
          fetch(url, {
            next: { revalidate: 3600 },
            cache: "force-cache",
            signal: AbortSignal.timeout(20000),
          })
            .then(async (res) => {
              if (!res.ok) {
                console.warn(`API page ${i} returned ${res.status}`);
                return null;
              }
              return res.json();
            })
            .catch((err) => {
              console.warn(`API page ${i} fetch failed:`, err.message);
              return null;
            }),
        );
      }

      const results = await Promise.all(requests);

      results.forEach((data) => {
        if (data?.universities?.length) {
          allUniversities.push(...data.universities);
        }
      });
    }

    console.log(
      `[sitemap-universities/${sitemapPage}] fetched ${allUniversities.length} raw universities`,
    );

    // Deduplicate by slug
    const uniqueUniversities = Array.from(
      new Map(allUniversities.map((uni) => [uni.slug, uni])).values(),
    );

    // Filter: confidence >= 0.75 only
    // NOTE: description is NOT in the list API response, so we skip that check here
    // The [slug]/page.jsx handles noindex for low-quality pages
    const validUniversities = uniqueUniversities.filter((uni) => {
      const confidence = Number(
        uni?.enrichment?.confidenceScore ?? uni?.confidenceScore ?? 0,
      );
      return uni?.slug && uni?.name && confidence >= 0.75;
    });

    console.log(
      `[sitemap-universities/${sitemapPage}] raw=${uniqueUniversities.length} valid=${validUniversities.length}`,
    );

    if (validUniversities.length === 0) {
      return new Response("Not Found", { status: 404 });
    }

    const urls = validUniversities
      .map((uni) => {
        const lastmod = new Date(
          uni.updatedAt || uni.createdAt || Date.now(),
        ).toISOString();

        const imageTag = uni.logo?.url
          ? `\n  <image:image>\n    <image:loc>${escapeXml(uni.logo.url)}</image:loc>\n    <image:title>${escapeXml(uni.name)} — Study Abroad 2026</image:title>\n  </image:image>`
          : "";

        return `<url>\n  <loc>${baseUrl}/programs/universities/${escapeXml(uni.slug)}</loc>\n  <lastmod>${lastmod}</lastmod>\n  <changefreq>monthly</changefreq>\n  <priority>0.7</priority>${imageTag}\n</url>`;
      })
      .join("\n");

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("UNIVERSITIES SITEMAP ERROR:", error);
    return new Response("Sitemap generation failed", { status: 500 });
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
