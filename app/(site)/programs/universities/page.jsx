import UniversitiesClient from "./UniversitiesClient";
import Link from "next/link";

export const metadata = {
  title: "Top Universities Abroad for Indian Students (2026)",
  description:
    "Explore top universities in UK, USA, Canada & more. Compare courses, fees, rankings and apply easily.",
};

export default async function UniversitiesPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";

  const endpoint = search
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${encodeURIComponent(search)}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities`;

  console.log("SEARCH:", search);
  console.log("ENDPOINT:", endpoint);

  const res = await fetch(endpoint, {
    next: { revalidate: 86400 },
  });

  const data = await res.json();

  return (
    <>
      <h1 className="sr-only">
        {search
          ? `Top Universities in ${search}`
          : "Top Universities Abroad for Indian Students"}
      </h1>

      <div className="sr-only">
        <ul>
          {(data?.universities || []).slice(0, 20).map((uni) => (
            <li key={uni._id}>
              <Link href={`/programs/universities/${uni.slug}`}>
                {uni.name} - {uni.country?.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <UniversitiesClient
        universities={data?.universities || []}
        initialSearch={search}
      />
    </>
  );
}
