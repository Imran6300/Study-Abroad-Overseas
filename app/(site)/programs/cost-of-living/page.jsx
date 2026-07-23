// app/(site)/programs/cost-of-living/page.jsx
//
// URL: /programs/cost-of-living
//
// Organic Growth Audit, item #13 — cost-of-living calculator.
// Same "no existing page to preserve" situation as rankings (#12): plain
// server component from the start, no layout.jsx split needed. Data is
// fetched once here (server-side, for SEO + first paint) and handed to
// the client component as props — the calculator itself (country +
// budget-tier selection) is then pure client-side state, no per-interaction
// network round trip needed since the full ~25-country dataset is small.

export const revalidate = 86400;

import CostOfLivingCalculatorClient from "./CostOfLivingCalculatorClient";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getCostOfLivingData(attempt = 1) {
  if (!API_URL) return { countries: [], source: null };
  const MAX_ATTEMPTS = 3;
  try {
    const res = await fetch(`${API_URL}/api/public/cost-of-living`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, attempt * 500));
        return getCostOfLivingData(attempt + 1);
      }
      console.error(
        `[cost-of-living] failed after ${MAX_ATTEMPTS} attempts: HTTP ${res.status}`,
      );
      return { countries: [], source: null };
    }

    const json = await res.json();
    return {
      countries: json?.countries || [],
      source: json?.source || null,
    };
  } catch (err) {
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, attempt * 500));
      return getCostOfLivingData(attempt + 1);
    }
    console.error("[cost-of-living] fetch error:", err.message);
    return { countries: [], source: null };
  }
}

export const metadata = {
  title: "Cost of Living Calculator for Studying Abroad 2026 | Khizar Overseas",
  description:
    "Estimate your monthly rent, food, and transport costs across 25 study-abroad destinations. Free student budget planning tool from Khizar Overseas, Hyderabad.",
  keywords: [
    "cost of living calculator for students",
    "study abroad budget calculator",
    "monthly expenses studying abroad",
    "student living costs by country",
  ],
  alternates: {
    canonical: `${BASE_URL}/programs/cost-of-living`,
  },
  openGraph: {
    title: "Cost of Living Calculator for Studying Abroad | Khizar Overseas",
    description:
      "See estimated monthly rent, food, and transport costs across 25 study-abroad destinations.",
    url: `${BASE_URL}/programs/cost-of-living`,
    siteName: "Khizar Overseas",
    type: "website",
  },
};

export default async function CostOfLivingPage() {
  const { countries, source } = await getCostOfLivingData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cost of Living Calculator",
        item: `${BASE_URL}/programs/cost-of-living`,
      },
    ],
  };

  return (
    <main className="bg-[#0F172A] text-[#E5E7EB] font-sans min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="px-5 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <nav className="text-xs sm:text-sm opacity-70 mb-6 flex gap-2 flex-wrap">
          <a href="/" className="hover:underline">
            Home
          </a>
          <span>/</span>
          <span className="text-white">Cost of Living Calculator</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Cost of Living Calculator
        </h1>
        <p className="text-base sm:text-lg opacity-90 max-w-2xl mb-10">
          Pick a destination and a budget style to see an estimated monthly
          spend on rent, food, and transport — for planning your study-abroad
          budget before you apply.
        </p>

        {countries.length > 0 ? (
          <CostOfLivingCalculatorClient countries={countries} source={source} />
        ) : (
          <p className="opacity-70">Cost of living data is being prepared.</p>
        )}
      </section>
    </main>
  );
}
