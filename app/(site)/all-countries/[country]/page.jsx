import CountryClient from "./CountryClient";
import { notFound } from "next/navigation";

async function getCountry(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  console.log("ENV:", baseUrl);

  if (!baseUrl) {
    console.error("API URL is not defined");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/countries/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

export default async function CountryPage({ params }) {
  const { country: slug } = await params;

  const country = await getCountry(slug);

  if (!country) {
    notFound();
  }

  return <CountryClient country={country} />;
}
