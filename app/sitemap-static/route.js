export const runtime = "nodejs";
export const revalidate = 86400; // re-check once a day is plenty for static pages

export async function GET() {
  const baseUrl = "https://www.khizaroverseas.in";

  // Add every static/marketing page here as you build them
  const staticPages = [
    {
      url: "/",
      lastmod: new Date().toISOString(),
      priority: "1.0",
      changefreq: "weekly",
    },
    {
      url: "/partners",
      lastmod: new Date().toISOString(),
      priority: "0.9",
      changefreq: "monthly",
    },
    // future pages: /about, /contact, /blog, etc.
  ];

  const urls = staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
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
