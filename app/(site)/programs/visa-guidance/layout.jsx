// app/(site)/programs/visa-guidance/layout.jsx
//
// FIX (Organic Growth Audit, Section 12, item #11):
// Same fix as programs/scholarships/layout.jsx (item #10) — /programs/
// visa-guidance/page.jsx is a "use client" lead-gen page that can't
// export generateMetadata or fetch data server-side. This layout gives
// the hub real metadata and a crawlable link list into every new
// /programs/visa-guidance/{countrySlug} page, without touching the
// existing client component.

import Link from "next/link";
import { buildItemListJsonLd } from "@/lib/structuredData";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getVisaGuideCountries() {
  if (!API_URL) return [];
  try {
    const res = await fetch(
      `${API_URL}/api/public/visa-guide-country-slugs`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.slugs || [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Student Visa Guidance 2026 | Khizar Overseas",
  description:
    "Student visa requirements and success rates, country by country. Free eligibility check for Indian students planning to study abroad, from Khizar Overseas, Hyderabad.",
  keywords: [
    "student visa guidance 2026",
    "study abroad visa requirements",
    "student visa success rate india",
    "visa guidance for indian students",
  ],
  alternates: {
    canonical: `${BASE_URL}/programs/visa-guidance`,
  },
  openGraph: {
    title: "Student Visa Guidance 2026 | Khizar Overseas",
    description:
      "Country-by-country student visa requirements and success rates for Indian students.",
    url: `${BASE_URL}/programs/visa-guidance`,
    siteName: "Khizar Overseas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Visa Guidance 2026 | Khizar Overseas",
    description:
      "Country-by-country student visa requirements and success rates for Indian students.",
  },
};

export default async function VisaGuidanceLayout({ children }) {
  const slugs = await getVisaGuideCountries();

  const structuredData = buildItemListJsonLd(slugs, {
    name: "Visa Guides by Country | Khizar Overseas",
    description:
      "Programmatic list of country-specific student visa guidance pages.",
    url: `${BASE_URL}/programs/visa-guidance`,
    toListItem: (slug, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: slug,
      url: `${BASE_URL}/programs/visa-guidance/${slug}`,
    }),
  });

  return (
    <>
      {slugs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Crawlable link list — server-rendered, present before any client
          JS runs. Same pattern as /programs/scholarships/layout.jsx. */}
      {slugs.length > 0 && (
        <div className="sr-only">
          <h2>Visa Guidance by Country</h2>
          <ul>
            {slugs.map((slug) => (
              <li key={slug}>
                <Link href={`/programs/visa-guidance/${slug}`}>
                  Student visa guide for {slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {children}
    </>
  );
}
