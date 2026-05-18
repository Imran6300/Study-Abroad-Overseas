export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET() {
  const baseUrl = "https://www.khizaroverseas.in";
  const now = new Date().toISOString();

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/all-countries", priority: "0.95", changefreq: "daily" },
    { url: "/programs/universities", priority: "0.95", changefreq: "daily" },
    { url: "/assessment", priority: "0.9", changefreq: "monthly" },
    { url: "/partners", priority: "0.8", changefreq: "monthly" },
    { url: "/contact", priority: "0.85", changefreq: "monthly" },
    { url: "/services", priority: "0.85", changefreq: "monthly" },
    { url: "/services/sop-lor", priority: "0.8", changefreq: "monthly" },
    {
      url: "/services/profile-evaluation",
      priority: "0.8",
      changefreq: "monthly",
    },
    { url: "/programs", priority: "0.85", changefreq: "weekly" },
  ];

  const urls = staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
