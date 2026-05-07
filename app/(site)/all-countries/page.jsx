import CountriesClient from "./allCountriesClient";

async function getCountries() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?page=1&limit=20`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) {
    const text = await res.text();
    console.log("ERROR RESPONSE:", text);
    throw new Error("Failed to fetch countries");
  }

  return res.json();
}
export default async function CountriesPage() {
  const data = await getCountries();

  return <CountriesClient countries={data.data} />;
}
