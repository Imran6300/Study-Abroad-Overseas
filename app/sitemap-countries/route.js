export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const baseUrl = "https://www.khizaroverseas.in";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?page=1&limit=500`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(15000),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch countries");
    }

    const data = await res.json();

    const countries = data?.data || [];

    // REMOVE DUPLICATES
    const uniqueCountries = Array.from(
      new Map(countries.map((country) => [country.slug, country])).values(),
    );

    // XML URLS
    const urls = uniqueCountries
      .filter((country) => country?.slug)
      .map(
        (country) => `
    <url>
      <loc>${baseUrl}/all-countries/${country.slug}</loc>
      <lastmod>${new Date(
        country.updatedAt || country.createdAt || Date.now(),
      ).toISOString()}</lastmod>
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
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("COUNTRIES SITEMAP ERROR:", error);

    return new Response("Failed to generate countries sitemap", {
      status: 500,
    });
  }
}
