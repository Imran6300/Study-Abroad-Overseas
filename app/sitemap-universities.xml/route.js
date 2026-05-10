export async function GET() {
  const baseUrl = "https://www.khizaroverseas.in";

  let allUniversities = [];

  const firstRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=1`,
  );

  const firstData = await firstRes.json();

  const totalPages = firstData.totalPages;

  allUniversities.push(...firstData.universities);

  for (let i = 2; i <= totalPages; i++) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=${i}`,
    );

    const data = await res.json();

    allUniversities.push(...data.universities);
  }

  const validUniversities = allUniversities.filter((uni) => {
    const confidence = uni.confidenceScore || 0;
    const descriptionLength = uni.description?.length || 0;

    return confidence >= 0.75 && descriptionLength >= 300;
  });

  const urls = validUniversities
    .map(
      (uni) => `
    <url>
      <loc>${baseUrl}/programs/universities/${uni.slug}</loc>
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
