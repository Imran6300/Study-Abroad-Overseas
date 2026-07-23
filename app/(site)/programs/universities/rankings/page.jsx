// app/(site)/programs/universities/rankings/page.jsx
//
// URL: /programs/universities/rankings
//
// Organic Growth Audit, Section 12, item #12. Unlike /programs/
// scholarships and /programs/visa-guidance, there's no existing lead-gen
// page at this route to preserve, so this hub is a plain server
// component from the start — no layout.jsx split needed here.

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { buildItemListJsonLd } from "@/lib/structuredData";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const revalidate = 43200;

export const metadata = {
  title: "University Rankings by Country 2026 | Khizar Overseas",
  description:
    "Top-ranked and most affordable universities, country by country. Free university shortlist for Indian students, from Khizar Overseas, Hyderabad.",
  keywords: [
    "top universities by country 2026",
    "cheapest universities abroad",
    "best universities for indian students",
    "university rankings for study abroad",
  ],
  alternates: {
    canonical: `${BASE_URL}/programs/universities/rankings`,
  },
  openGraph: {
    title: "University Rankings by Country 2026 | Khizar Overseas",
    description:
      "Country-by-country top-ranked and most affordable university lists for Indian students.",
    url: `${BASE_URL}/programs/universities/rankings`,
    siteName: "Khizar Overseas",
    type: "website",
  },
};

async function getRankingsCountries() {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/public/rankings-country-slugs`, {
      next: { revalidate: 43200 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.slugs || [];
  } catch {
    return [];
  }
}

export default async function RankingsHubPage() {
  const slugs = await getRankingsCountries();

  const structuredData = buildItemListJsonLd(slugs, {
    name: "University Rankings by Country | Khizar Overseas",
    description:
      "Programmatic list of country-specific university ranking pages.",
    url: `${BASE_URL}/programs/universities/rankings`,
    toListItem: (slug, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: slug,
      url: `${BASE_URL}/programs/universities/rankings/${slug}`,
    }),
  });

  return (
    <main className="bg-[#0F172A] text-[#E5E7EB] font-sans min-h-screen">
      {slugs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <section className="px-5 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          University Rankings, Country by Country
        </h1>
        <p className="text-base sm:text-lg opacity-90 max-w-2xl mb-10">
          Top QS-ranked and most affordable universities for each study
          destination. Pick a country to see the shortlist.
        </p>

        {slugs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slugs.map((slug) => (
              <Link
                key={slug}
                href={`/programs/universities/rankings/${slug}`}
                className="rounded-2xl border border-white/10 bg-[#020617]/70 p-5 flex items-center justify-between hover:border-white/30 transition-colors group"
              >
                <span className="font-semibold capitalize flex items-center gap-2">
                  <Trophy size={16} className="text-[#F59E0B]" />
                  {slug.replace(/-/g, " ")}
                </span>
                <ArrowRight
                  size={16}
                  className="opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="opacity-70">Rankings data is being prepared.</p>
        )}
      </section>
    </main>
  );
}
