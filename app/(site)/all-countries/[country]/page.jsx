import CountryClient from "./CountryClient";
import { COUNTRIES } from "@/data/countries";
import { notFound } from "next/navigation";

/* =============================
   STATIC PARAMS
   ============================= */
export async function generateStaticParams() {
  return COUNTRIES.map((country) => ({
    country: country.slug,
  }));
}

/* =============================
   METADATA
   ============================= */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.country;

  // First internal App Router call
  if (!slug) return {};

  const countryObj = COUNTRIES.find((c) => c.slug === slug);

  if (!countryObj) {
    notFound();
  }

  return {
    title: `Study in ${countryObj.name}`,
    description: `Study in ${countryObj.name} with Khizar Overseas. Explore universities, courses, scholarships, living costs, and visa guidance.`,
  };
}

/* =============================
   PAGE
   ============================= */
export default async function CountryPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.country;

  // ✅ DEFINE countryObj AGAIN (scope fix)
  const countryObj = COUNTRIES.find((c) => c.slug === slug);

  if (!countryObj) {
    notFound();
  }

  return <CountryClient country={slug} />;
}
