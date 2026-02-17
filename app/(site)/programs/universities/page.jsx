import UniversitiesClient from "./UniversitiesClient";

export default async function UniversitiesPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities`,
    { cache: "no-store" },
  );

  const data = await res.json();

  return <UniversitiesClient universities={data.universities} />;
}
