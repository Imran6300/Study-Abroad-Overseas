export const revalidate = 3600;

import CountryClient from "./CountryClient";
import { notFound } from "next/navigation";

async function getCountry(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!baseUrl) {
    console.error("API URL is not defined");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/countries/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

// ─── HELPER: build a punchy, click-worthy description ──────────────────────
function buildCountryDescription(country) {
  const name = country.name;
  const visaRate = country.visaSuccessRate;
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.khizaroverseas.in";

  // Lead with the visa success rate number — this is exactly what users search for
  // and it acts as a strong click trigger in the SERP snippet.
  if (visaRate && Number(visaRate) >= 70) {
    return (
      `Study in ${name} 2026: ${visaRate}% visa success rate for Indian students. ` +
      `Compare top universities, tuition fees, scholarships & post-study work options. ` +
      `Free expert counseling from Hyderabad — get assessed in 24 hrs.`
    );
  }

  if (visaRate) {
    return (
      `Complete guide to studying in ${name} in 2026 for Indian students. ` +
      `Visa success rate: ${visaRate}%. Top universities, fees, scholarships & eligibility. ` +
      `Free counseling from Khizar Overseas, Hyderabad.`
    );
  }

  return (
    `Study in ${name} 2026 for Indian students: top universities, tuition fees, ` +
    `visa requirements, scholarships & post-study work options. ` +
    `Free expert counseling from Khizar Overseas, Hyderabad.`
  );
}

// ─── HELPER: build a click-worthy title ────────────────────────────────────
function buildCountryTitle(country) {
  const name = country.name;
  const visaRate = country.visaSuccessRate;

  // Queries like "latvia visa success rate for indian" have HIGH intent.
  // Putting the rate + year in the title wins those clicks.
  if (visaRate) {
    return `Study in ${name} 2026 | ${visaRate}% Visa Success Rate | Indian Students Guide`;
  }

  return `Study in ${name} 2026 | Top Universities, Fees & Visa Guide for Indians`;
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries`,
    );

    const data = await res.json();

    return (data.data || []).map((country) => ({
      country: country.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { country: slug } = await params;
  const country = await getCountry(slug);

  if (!country) {
    return { title: "Country Not Found | Khizar Overseas" };
  }

  const title = buildCountryTitle(country);
  const description = buildCountryDescription(country);
  const canonicalUrl = `/all-countries/${slug}`;
  const fullUrl = `https://www.khizaroverseas.in/all-countries/${slug}`;

  return {
    title,
    description,

    alternates: { canonical: canonicalUrl },

    // Structured keywords help with long-tail queries
    keywords: [
      `study in ${country.name} for indian students`,
      `${country.name} student visa success rate`,
      `study in ${country.name} 2026`,
      `${country.name} universities for indian students`,
      `${country.name} tuition fees for indian students`,
      `study abroad ${country.name}`,
    ],

    openGraph: {
      title,
      description,
      url: fullUrl,
      type: "article",
      siteName: "Khizar Overseas",
      images: country.heroImage?.url
        ? [
            {
              url: country.heroImage.url,
              width: 1200,
              height: 630,
              alt: `Study in ${country.name} 2026 — Khizar Overseas`,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: country.heroImage?.url ? [country.heroImage.url] : [],
    },
  };
}

export default async function CountryPage({ params }) {
  const { country: slug } = await params;
  const country = await getCountry(slug);
  if (!country) return notFound();

  // Build JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Country",
    name: country.name,
    url: `https://www.khizaroverseas.in/all-countries/${slug}`,
    description: buildCountryDescription(country),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.khizaroverseas.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Countries",
        item: "https://www.khizaroverseas.in/all-countries",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Study in ${country.name}`,
        item: `https://www.khizaroverseas.in/all-countries/${slug}`,
      },
    ],
  };

  // FAQ JSON-LD only if country has faqs
  const faqLd = country.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: country.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <CountryClient country={country} />
    </>
  );
}
