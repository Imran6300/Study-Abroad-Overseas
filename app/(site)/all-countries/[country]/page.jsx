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
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { country: slug } = await params;
  const country = await getCountry(slug);

  if (!country) {
    return { title: "Country Not Found | Khizar Overseas" };
  }

  const title = `Study in ${country.name} 2026 for Indian Students | Top Universities, Visa Success Rate & Scholarships`;
  const description = `Planning to study in ${country.name} in 2026? Get complete guide: visa success rate ${country.visaSuccessRate}%, top universities, popular courses, scholarships, eligibility & post-study work options. Free counseling from Hyderabad.`;

  return {
    title,
    description,
    alternates: { canonical: `/all-countries/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://khizaroverseas.in/all-countries/${slug}`,
      type: "article",
      images: [
        { url: country.heroImage?.url, alt: `Study in ${country.name} 2026` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [country.heroImage?.url],
    },
  };
}

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries`,
    { next: { revalidate: 86400 } },
  );

  const data = await res.json();

  return data.data.map((country) => ({
    country: country.slug,
  }));
}

export default async function CountryPage({ params }) {
  const { country: slug } = await params;

  const country = await getCountry(slug);
  let universities = [];

  try {
    const uniRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?country=${encodeURIComponent(country.name)}`,
      {
        next: { revalidate: 86400 },
      },
    );

    if (uniRes.ok) {
      const uniData = await uniRes.json();
      universities = uniData.universities || [];
    }
  } catch (error) {
    console.error("Universities fetch failed:", error);
  }

  if (!country) {
    notFound();
  }

  return <CountryClient country={country} universities={universities} />;
}
