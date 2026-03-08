import CanadaUniversitiesClient from "./CanadaUniversitiesClient";

export const metadata = {
  metadataBase: new URL("https://www.khizaroverseas.in"),

  title:
    "University Shortlisting Tool for Study Abroad 2026 | Compare Top Universities – Khizar Overseas",

  description:
    "Use our university shortlisting tool to compare top universities worldwide. Filter by country, degree, tuition fees, rankings & courses for study abroad 2026. Get expert guidance from Khizar Overseas Hyderabad with 98.7% visa success.",

  keywords: [
    "university shortlisting tool study abroad",
    "compare universities for study abroad",
    "best universities for international students",
    "study abroad university finder",
    "shortlist universities for masters abroad",
    "compare tuition fees universities abroad",
    "study abroad consultants Hyderabad",
    "find best universities for masters",
  ],

  alternates: {
    canonical: "https://www.khizaroverseas.in/services/university-shortlisting",
  },

  openGraph: {
    title:
      "University Shortlisting Tool | Compare Top Universities for Study Abroad",
    description:
      "Compare universities by country, rankings, tuition fees and courses using our smart university shortlisting tool. Find the best universities for studying abroad.",
    url: "https://www.khizaroverseas.in/services/university-shortlisting",
    siteName: "Khizar Overseas",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://www.khizaroverseas.in/images/university-shortlisting-og.jpg",
        width: 1200,
        height: 630,
        alt: "University Shortlisting Tool for Study Abroad",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "University Shortlisting Tool for Study Abroad",
    description:
      "Compare top universities worldwide using our smart shortlisting tool.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

// ─── Schema ───────────────────────────────────────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Khizar Overseas",
  url: "https://www.khizaroverseas.in",
  logo: "https://www.khizaroverseas.in/logo.png",
  description:
    "Leading study abroad consultants in Hyderabad specializing in top universities in Canada 2026. Free shortlisting, profile evaluation, visa guidance with 98.7% success rate.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No.35, 5-4-410, Nampally",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500001",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 17.39009, longitude: 78.469326 },
  telephone: "+917329822309",
  email: "khizaroverseas@gmail.com",
  priceRange: "$$",
  openingHoursSpecification: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    { dayOfWeek: "Saturday", opens: "10:00", closes: "16:00" },
  ],
  areaServed: ["Hyderabad", "Telangana", "India"],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "University Shortlisting for Canada 2026",
        description:
          "Free comparison of top QS-ranked universities, tuition, courses & intakes",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Free Profile Evaluation for Canada Study",
        description: "Personalized assessment for admissions & scholarships",
      },
    },
  ],
  sameAs: [
    "https://www.facebook.com/khizaroverseas",
    "https://www.instagram.com/khizaroverseas",
    "https://wa.me/917329822309",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      position: 1,
      name: "Home",
      item: "https://www.khizaroverseas.in",
    },
    {
      position: 2,
      name: "Services",
      item: "https://www.khizaroverseas.in/services",
    },
    {
      position: 3,
      name: "University Shortlisting Tool",
      item: "https://www.khizaroverseas.in/services/university-shortlisting",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a university shortlisting tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A university shortlisting tool helps students compare universities based on country, tuition fees, rankings, degree programs and eligibility to find the best universities for studying abroad.",
      },
    },
    {
      "@type": "Question",
      name: "How can I shortlist universities for studying abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can shortlist universities by comparing rankings, tuition fees, courses, admission requirements and post-study work opportunities. Our tool helps students easily compare universities across multiple countries.",
      },
    },
    {
      "@type": "Question",
      name: "Which countries are best for studying abroad in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Popular study abroad destinations include Canada, USA, UK, Australia and Germany due to top-ranked universities, scholarships and post-study work opportunities.",
      },
    },
  ],
};
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <CanadaUniversitiesClient />
    </>
  );
}
