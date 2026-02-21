import WhyChooseUsClient from "./whyChooseUsClient";

export const revalidate = 60;

export default async function WhyChooseUs() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonials`,
    { next: { revalidate: 60 } },
  );

  const data = await res.json();
  const testimonials = data.success ? data.data.slice(0, 3) : [];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Khizar Overseas",
    review: testimonials.map((t) => ({
      "@type": "Review",
      reviewBody: t.excerpt || t.fullDescription?.slice(0, 150),
      author: {
        "@type": "Person",
        name: t.studentName,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <WhyChooseUsClient testimonials={testimonials} />
    </>
  );
}
