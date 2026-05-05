import UniversityDetailLayout from "@/components/UniversityDetail/UniversityDetailLayout";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${slug}`;

    const res = await fetch(url, {
      next: { revalidate: 60 }, // IMPORTANT
    });

    if (!res.ok) {
      console.log("Metadata fetch failed:", res.status);
      return {
        title: "University",
      };
    }

    const data = await res.json();

    if (!data || !data.university) {
      return {
        title: "University",
      };
    }

    const uni = data.university;

    return {
      title: `${uni.name} in ${uni.country} for Indian Students | Fees, Courses, Admission 2026`,
      description: `Study at ${uni.name} in ${uni.country}. Check fees, courses, ranking, scholarships and admission process for Indian students.`,
    };
  } catch (error) {
    console.log("Metadata error:", error);

    return {
      title: "University",
    };
  }
}

export default async function Page({ params }) {
  const { slug } = await params;

  const [uniRes, similarRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${slug}`, {
      next: { revalidate: 60 },
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/similar/${slug}`,
      { next: { revalidate: 60 } },
    ),
  ]);

  const uniData = await uniRes.json();
  const similarData = await similarRes.json();

  const uni = uniData?.university;

  if (!uni) return notFound();

  return (
    <>
      {/* ✅ STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollegeOrUniversity",
            name: uni.name,
            address: {
              "@type": "PostalAddress",
              addressCountry: uni.country,
            },
          }),
        }}
      />

      <UniversityDetailLayout
        uni={{ ...uni, courses: uniData.courses }}
        similarUniversities={similarData?.universities || []}
      />
    </>
  );
}
