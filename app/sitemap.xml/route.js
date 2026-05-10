export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.khizaroverseas.in/sitemap-universities.xml</loc>
  </sitemap>

  <sitemap>
    <loc>https://www.khizaroverseas.in/sitemap-countries.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
