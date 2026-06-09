// app/(site)/study-in-[slug]/page.jsx
import { redirect } from "next/navigation";

// This page can either:
// A) Redirect to /all-countries/[slug] (easiest, no duplicate content)
// B) Be a full standalone page (later, after data enrichment)

// For now: permanent redirect. This way the URL exists and doesn't 404,
// Google follows the canonical, you don't have duplicate content.

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries?limit=250`,
    );
    const data = await res.json();
    return (data.data || []).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export default async function StudyInCountryPage({ params }) {
  const { slug } = await params;
  redirect(`/all-countries/${slug}`);
}
