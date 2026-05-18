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

  if (!country) {
    notFound();
  }

  let universities = [];

  try {
    const uniRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?country=${encodeURIComponent(country.name)}`,
      { next: { revalidate: 3600 } },
    );

    if (uniRes.ok) {
      const uniData = await uniRes.json();
      universities = uniData.universities || [];
    }
  } catch (error) {
    console.error("Universities fetch failed:", error);
  }

  // ── Structured Data: helps Google show rich snippets ─────────────────────
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: buildCountryTitle(country),
    description: buildCountryDescription(country),
    url: `https://www.khizaroverseas.in/all-countries/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "Khizar Overseas",
      url: "https://www.khizaroverseas.in",
      logo: {
        "@type": "ImageObject",
        url: "https://www.khizaroverseas.in/logo.png",
      },
    },
    // FAQ schema — increases CTR by showing Q&A in SERP
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the visa success rate for Indian students in ${country.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: country.visaSuccessRate
            ? `The student visa success rate for Indian applicants in ${country.name} is ${country.visaSuccessRate}%.`
            : `Contact Khizar Overseas for the latest visa success rate data for ${country.name}.`,
        },
      },
      {
        "@type": "Question",
        name: `How to study in ${country.name} from India in 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `To study in ${country.name} from India, you need to: 1) Choose a university and program, 2) Meet eligibility requirements, 3) Apply for admission, 4) Apply for a student visa. Khizar Overseas provides free counseling to guide you through the entire process.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${country.name} good for Indian students?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${country.name} is a popular study destination for Indian students with ${universities.length > 0 ? `${universities.length}+ partner universities` : "multiple universities"} available. Khizar Overseas helps Indian students with admissions and visa guidance.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CountryClient country={country} universities={universities} />
    </>
  );
}
