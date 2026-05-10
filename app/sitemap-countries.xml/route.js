export async function GET() {
  const baseUrl = "https://www.khizaroverseas.in";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?page=1&limit=500`,
  );

  const data = await res.json();

  const countries = data.data || [];

  const urls = countries
    .map(
      (country) => `
    <url>
      <loc>${baseUrl}/all-countries/${country.slug}</loc>
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
    },
  });
}
