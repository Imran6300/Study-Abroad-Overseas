import CountriesClient from "./allCountriesClient";

async function getCountries() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?page=1&limit=20`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }

  return res.json();
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
