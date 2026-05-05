export default async function sitemap() {
  const baseUrl = "https://khizaroverseas.in";

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

  const universityUrls = allUniversities.map((uni) => ({
    url: `${baseUrl}/programs/universities/${uni.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${baseUrl}/programs/universities`,
      lastModified: new Date(),
    },
    ...universityUrls,
  ];
}
