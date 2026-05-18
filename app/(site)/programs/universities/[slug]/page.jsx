import UniversityDetailLayout from "@/components/UniversityDetail/UniversityDetailLayout";
import { notFound } from "next/navigation";

// ─── HELPER: build a punchy title ──────────────────────────────────────────
// The pattern "University Name in Country | Fees, Courses & Admission 2026"
// matches exactly how users search: "korean bible university", "aichi bunkyo university"
function buildUniTitle(uni) {
  const name = uni.name;
  const country = uni.country?.name;

  if (country) {
    return `${name} in ${country} | Fees, Courses & Admission 2026 for Indians`;
  }
  return `${name} | Fees, Courses & Admission 2026 for Indian Students`;
}

// ─── HELPER: build a description that sells the click ──────────────────────
function buildUniDescription(uni) {
  const name = uni.name;
  const country = uni.country?.name;

  // Include specifics if available — numbers in snippets massively increase CTR
  const parts = [`Study at ${name}${country ? ` in ${country}` : ""} in 2026.`];

  if (uni.ranking) {
    parts.push(`Ranked #${uni.ranking} globally.`);
  }

  if (uni.tuitionFee || uni.annualFee) {
    const fee = uni.tuitionFee || uni.annualFee;
    parts.push(`Tuition: ${fee}.`);
  }

  parts.push(
    `Get complete details on courses, scholarships, eligibility & admission for Indian students. Free counseling from Khizar Overseas.`,
  );

  return parts.join(" ");
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities`,
    );

    const data = await res.json();

    return (data.universities || []).map((uni) => ({
      slug: uni.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${slug}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      return { title: "University | Khizar Overseas" };
    }

    const data = await res.json();

    if (!data?.university) {
      return { title: "University | Khizar Overseas" };
    }

    const uni = data.university;
    const confidence =
      uni.confidenceScore || uni.enrichment?.confidenceScore || 0;
    const descriptionLength = uni.description?.length || 0;
    const shouldIndex = confidence >= 0.75 && descriptionLength >= 300;

    const title = buildUniTitle(uni);
    const description = buildUniDescription(uni);
    const canonicalUrl = `https://www.khizaroverseas.in/programs/universities/${slug}`;

    return {
      title,
      description,

      keywords: [
        uni.name,
        `${uni.name} fees`,
        `${uni.name} ranking`,
        `${uni.name} admission`,
        `${uni.name} for indian students`,
        uni.country?.name
          ? `universities in ${uni.country.name} for indian students`
          : "universities abroad for indian students",
        "study abroad 2026",
      ].filter(Boolean),

      alternates: { canonical: canonicalUrl },

      robots: {
        index: shouldIndex,
        follow: true,
      },

      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "Khizar Overseas",
        type: "article",
        images: uni.image?.url
          ? [
              {
                url: uni.image.url,
                width: 1200,
                height: 630,
                alt: `${uni.name} — Khizar Overseas`,
              },
            ]
          : [],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: uni.image?.url ? [uni.image.url] : [],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return { title: "University | Khizar Overseas" };
  }
}

export default async function Page({ params }) {
  const { slug } = await params;

  const [uniRes, similarRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${slug}`, {
      next: { revalidate: 3600 },
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/similar/${slug}`,
      { next: { revalidate: 3600 } },
    ),
  ]);

  const uniData = await uniRes.json();
  const similarData = await similarRes.json();
  const uni = uniData?.university;

  if (!uni) return notFound();

  // ── Rich Structured Data ─────────────────────────────────────────────────
  // CollegeOrUniversity schema + FAQ = potential rich snippets in SERP
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name: uni.name,
      url: `https://www.khizaroverseas.in/programs/universities/${slug}`,
      description: buildUniDescription(uni),
      address: {
        "@type": "PostalAddress",
        addressCountry: uni.country?.name,
      },
      ...(uni.ranking && {
        sameAs: [],
        numberOfStudents: { "@type": "QuantitativeValue" },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How to get admission in ${uni.name} from India?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Indian students can apply to ${uni.name}${uni.country?.name ? ` in ${uni.country.name}` : ""} by meeting the eligibility criteria, submitting required documents, and applying through Khizar Overseas for free expert guidance. Contact us for a personalized admission roadmap.`,
          },
        },
        {
          "@type": "Question",
          name: `What are the fees at ${uni.name} for Indian students?`,
          acceptedAnswer: {
            "@type": "Answer",
            text:
              uni.tuitionFee || uni.annualFee
                ? `The tuition fee at ${uni.name} is approximately ${uni.tuitionFee || uni.annualFee}. Contact Khizar Overseas for exact fee breakdowns and scholarship opportunities.`
                : `Contact Khizar Overseas for the latest fee structure and scholarship information for ${uni.name}.`,
          },
        },
        {
          "@type": "Question",
          name: `Is ${uni.name} good for Indian students?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${uni.name}${uni.country?.name ? ` in ${uni.country.name}` : ""} is a recognized institution that accepts Indian students. Khizar Overseas has helped many Indian students secure admission. Get free counseling to check your eligibility.`,
          },
        },
      ],
    },
  ];

  return (
    <>
      {structuredData.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <UniversityDetailLayout
        uni={{ ...uni, courses: uniData.courses }}
        similarUniversities={similarData?.universities || []}
      />
    </>
  );
}
