import UniversitiesClient from "./UniversitiesClient";
import Link from "next/link";

export const metadata = {
  title:
    "Top Universities Abroad 2026 | Fees, Rankings & Admission for Indians",

  description:
    "Search 9,000+ universities in UK, USA, Canada, Europe & more. Compare fees, rankings, courses & admission requirements. Free counseling from Khizar Overseas, Hyderabad.",

  keywords: [
    "top universities abroad for indian students",
    "universities abroad 2026",
    "study abroad university list",
    "best universities uk for indian students",
    "best universities usa for indian students",
    "university fees abroad for indian students",
    "study abroad consultants hyderabad",
  ],

  alternates: {
    canonical: "https://www.khizaroverseas.in/programs/universities",
  },

  openGraph: {
    title:
      "Top Universities Abroad 2026 | Fees & Admission for Indian Students",
    description:
      "Compare 9,000+ universities worldwide. Check fees, rankings & apply with expert help from Khizar Overseas.",
    url: "https://www.khizaroverseas.in/programs/universities",
    siteName: "Khizar Overseas",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Top Universities Abroad 2026 | For Indian Students",
    description:
      "Compare 9,000+ universities worldwide. Fees, rankings & free counseling from Khizar Overseas.",
  },
};

export default async function UniversitiesPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";

  const endpoint = search
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${encodeURIComponent(search)}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities`;

  const res = await fetch(endpoint, {
    next: { revalidate: 86400 },
  });

  const data = await res.json();
  const universities = data?.universities || [];

  // Structured data for the listing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: search
      ? `Universities in ${search} for Indian Students`
      : "Top Universities Abroad for Indian Students 2026",
    description:
      "Comprehensive list of universities abroad for Indian students with fees, rankings and admission guidance.",
    url: "https://www.khizaroverseas.in/programs/universities",
    numberOfItems: universities.length,
    itemListElement: universities.slice(0, 20).map((uni, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: uni.name,
      url: `https://www.khizaroverseas.in/programs/universities/${uni.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Visible H1 — critical for SEO, use sr-only only if design requires */}
      <h1 className="sr-only">
        {search
          ? `Top Universities in ${search} for Indian Students 2026`
          : "Top Universities Abroad for Indian Students 2026"}
      </h1>

      {/* Crawlable link list for Googlebot */}
      <div className="sr-only">
        <ul>
          {universities.slice(0, 20).map((uni) => (
            <li key={uni._id}>
              <Link href={`/programs/universities/${uni.slug}`}>
                {uni.name} — Study in {uni.country?.name} | Fees & Admission
                2026
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <UniversitiesClient universities={universities} initialSearch={search} />
    </>
  );
}
