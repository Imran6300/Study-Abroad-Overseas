export default async function sitemap() {
  const baseUrl = "https://www.khizaroverseas.in";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?page=1&limit=500`,
    {
      next: { revalidate: 3600 },
    },
  );

  const data = await res.json();

  const countries = data.data || [];

  return countries.map((country) => ({
    url: `${baseUrl}/all-countries/${country.slug}`,
    lastModified: new Date(),
  }));
}
