import WhyChooseUsClient from "./whyChooseUsClient";

export const metadata = {
  title:
    "Why Choose Khizar Overseas – Best Study Abroad Consultants in Hyderabad 2025",
  description:
    "Looking for the best overseas education consultants in Hyderabad? Khizar Overseas offers 98.7% visa success rate, 10+ years experience, 5000+ successful students, partnerships with 250+ top universities in USA, UK, Canada, Australia, Germany, Ireland & more. Get expert counseling, free profile evaluation, scholarships up to $50M+, SOP/LOR guidance, mock interviews & 24/7 support.",
  keywords: [
    "best study abroad consultants in Hyderabad",
    "overseas education consultants Hyderabad",
    "study abroad consultants Hyderabad",
    "top study abroad consultancy Hyderabad",
    "Khizar Overseas Hyderabad",
    "study in USA from Hyderabad",
    "study in UK consultants Hyderabad",
    "Canada study visa consultants Hyderabad",
    "Australia education consultants Hyderabad",
    "Germany study abroad Hyderabad",
    "high visa success rate study abroad",
    "scholarships for study abroad Hyderabad",
    "trusted overseas education agency Hyderabad",
    "best consultants for USA UK Canada Australia",
    "study visa consultants near me Hyderabad",
  ].join(", "),

  openGraph: {
    title:
      "Why Khizar Overseas? Best Study Abroad Consultants in Hyderabad – 98.7% Visa Success",
    description:
      "Join 5000+ students who trusted Khizar Overseas for study in USA, UK, Canada, Australia, Germany & more. Expert university shortlisting, visa guidance, scholarships, SOP editing, mock interviews – transparent & result-oriented process.",
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/why-us`,
    type: "website",
    siteName: "Khizar Overseas",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/images/why-us-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Khizar Overseas - Best Study Abroad Consultants Hyderabad",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Why Choose Khizar Overseas – Top Study Abroad Consultants Hyderabad",
    description:
      "98.7% visa success • 5000+ students placed • 250+ universities • Scholarships up to $50M+",
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/why-us`,
  },

  // Optional: robots (if you want to push indexing)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const revalidate = 86400;

export default async function WhyChooseUs() {
  let testimonials = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonials`,
      { next: { revalidate: 86400 } },
    );
    if (res.ok) {
      const data = await res.json();
      testimonials = data.success ? data.data.slice(0, 6) : []; // ← increased to 6 if you have enough good ones
    } else {
      console.error(`[why-us] testimonials fetch failed: ${res.status}`);
    }
  } catch (err) {
    console.error("[why-us] testimonials fetch error:", err.message);
  }

  const totalReviews = testimonials.length;

  const averageRating =
    totalReviews === 0
      ? 5
      : testimonials.reduce((acc, curr) => {
          return acc + Number(curr.rating || 5);
        }, 0) / totalReviews;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",

    name: "Khizar Overseas",

    url: process.env.NEXT_PUBLIC_FRONTEND_URL,

    logo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/logo.png`,

    description:
      "Leading study abroad consultants in Hyderabad with 98.7% visa success rate helping students study in USA, UK, Canada, Australia, Germany and more.",

    sameAs: ["https://www.facebook.com/profile.php?id=61553895275238"],

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: totalReviews.toString(),
      bestRating: "5",
      worstRating: "1",
    },

    review: testimonials.map((t) => ({
      "@type": "Review",

      reviewRating: {
        "@type": "Rating",
        ratingValue: String(t.rating || 5),
        bestRating: "5",
        worstRating: "1",
      },

      reviewBody: t.excerpt || t.fullDescription?.slice(0, 180) || "",

      author: {
        "@type": "Person",
        name: t.studentName,
      },

      datePublished: t.createdAt || new Date().toISOString().split("T")[0],
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
