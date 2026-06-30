import CountriesClient from "./allCountriesClient";

async function getCountries() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?page=1&limit=20`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      console.error(`[all-countries] fetch failed: ${res.status}`);
      return { data: [], pagination: {} };
    }

    return res.json();
  } catch (err) {
    console.error("[all-countries] fetch error:", err.message);
    return { data: [], pagination: {} };
  }
}

export default async function CountriesPage() {
  const data = await getCountries();

  return (
    <CountriesClient
      initialCountries={data.data}
      initialPagination={data.pagination}
    />
  );
}
