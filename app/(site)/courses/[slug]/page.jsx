import CourseDetailPage from "./course";

async function getCourse(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${slug}`,
    { next: { revalidate: 86400 } },
  );

  const data = await res.json();

  if (!data || !data.course) return null;

  return data.course;
}

/* ================= METADATA ================= */

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const program = await getCourse(slug);

  if (!program) {
    return {
      title: "Course Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${program.title} Course Abroad | Universities, Fees & Career Scope`;

  const description =
    program.overviewDescription?.slice(0, 155) ||
    `Study ${program.title} abroad. Explore universities, fees, scholarships and career opportunities.`;

  const image = program.bgImage?.url || "/og-courses.jpg";

  return {
    metadataBase: new URL("https://khizaroverseas.in"),

    title,
    description,

    alternates: {
      canonical: `/courses/${slug}`,
    },

    openGraph: {
      title,
      description,
      url: `https://khizaroverseas.in/courses/${slug}`,
      siteName: "Khizar Overseas",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: program.title,
        },
      ],
      locale: "en_IN",
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ================= PAGE ================= */

export default async function ProgramPage({ params }) {
  const { slug } = await params;

  const program = await getCourse(slug);

  if (!program) {
    return <div className="text-center py-20">Course not found</div>;
  }

  return (
    <>
      {/* Course Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: program.title,
            description: program.overviewDescription,
            provider: {
              "@type": "Organization",
              name: "Khizar Overseas",
              url: "https://khizaroverseas.in",
            },
          }),
        }}
      />

      <CourseDetailPage slug={slug} />
    </>
  );
}
