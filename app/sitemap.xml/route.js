export async function GET() {
  const baseUrl = "https://www.khizaroverseas.in";

  const totalSitemaps = 10;

  const universitySitemaps = Array.from(
    { length: totalSitemaps },
    (_, i) => `
      <sitemap>
        <loc>${baseUrl}/sitemap-universities/${i + 1}</loc>
      </sitemap>
    `,
  ).join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${universitySitemaps}

<sitemap>
  <loc>${baseUrl}/sitemap-countries</loc>
</sitemap>

</sitemapindex>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
