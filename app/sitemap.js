export default async function sitemap() {
  const baseUrl = "https://khizaroverseas.in";

  let allUniversities = [];

  for (let i = 1; i <= 10; i++) {
    // start with 10 pages (later increase)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=${i}`,
    );
    const data = await res.json();

    allUniversities.push(...data.universities);
  }

  const universityUrls = allUniversities.map((uni) => ({
    url: `${baseUrl}/universities/${uni.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${baseUrl}/universities`,
      lastModified: new Date(),
    },
    ...universityUrls,
  ];
}
