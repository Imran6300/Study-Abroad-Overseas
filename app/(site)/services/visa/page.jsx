// app/services/visa/page.jsx

import VisaGuidancePage from "./visaClient";

export const metadata = {
  metadataBase: new URL("https://www.khizaroverseas.in"),
  title:
    "Visa Consultants in Hyderabad 2026 | Student, Work & PR Visa Services – Khizar Overseas",
  description:
    "Best visa consultants in Hyderabad for student visas, work visas, PR & visitor visas to USA, Canada, UK, Australia, Germany. 98.7% visa success rate, 5000+ students placed. Complete documentation, SOP, interview prep & filing support. Free consultation – Call/WhatsApp +91 73298 22309 now!",
  keywords: [
    "visa consultants Hyderabad",
    "student visa consultants Hyderabad",
    "best visa services Hyderabad 2026",
    "work visa consultants Hyderabad",
    "PR visa assistance Hyderabad",
    "visa application help Hyderabad",
    "USA Canada UK Australia Germany visa Hyderabad",
    "visa success rate 98.7% Hyderabad",
    "Khizar Overseas visa guidance",
    "free visa consultation Hyderabad",
    "study visa filing Hyderabad",
    "visitor visa consultants Hyderabad",
  ].join(", "),

  alternates: {
    canonical: "https://www.khizaroverseas.in/services/visa",
  },

  openGraph: {
    title: "Visa Consultants Hyderabad 2026 | 98.7% Success – Khizar Overseas",
    description:
      "Expert visa guidance & filing in Hyderabad for USA, Canada, UK, Australia, Germany. 5000+ successful visas. Student, work, PR, visitor. Free consultation – WhatsApp +91 73298 22309!",
    url: "https://www.khizaroverseas.in/services/visa",
    type: "website",
    siteName: "Khizar Overseas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.khizaroverseas.in/images/visa-services-og-2026.jpg",
        width: 1200,
        height: 630,
        alt: "Khizar Overseas – Best Visa Consultants in Hyderabad 2026 – 98.7% Success",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Best Visa Consultants Hyderabad 2026 | Khizar Overseas",
    description:
      "98.7% Success • 5000+ Visas • Student/Work/PR • USA/Canada/UK/Australia/Germany • Free Consultation",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// RICH LOCAL + SERVICE + FAQ SCHEMA (2026-ready)
// ──────────────────────────────────────────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Khizar Overseas",
  url: "https://www.khizaroverseas.in",
  logo: "https://www.khizaroverseas.in/logo.png",
  image: "https://www.khizaroverseas.in/images/office.jpg", // ← add real office/team photo
  description:
    "Top visa consultants in Hyderabad offering student, work, PR & visitor visa guidance for USA, Canada, UK, Australia, Germany. 98.7% success rate, 5000+ visas processed.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No.35, 5-4-410, Nampally",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.39009,
    longitude: 78.469326,
  },
  telephone: "+917329822309",
  email: "khizaroverseas@gmail.com",
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  areaServed: ["Hyderabad", "Telangana", "India"],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Student Visa Guidance & Filing Hyderabad",
        description:
          "End-to-end support for study visas with 98.7% success rate",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Work & PR Visa Assistance",
        description:
          "Professional documentation, interview prep & filing for skilled migration",
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
    { position: 1, name: "Home", item: "https://www.khizaroverseas.in" },
    {
      position: 2,
      name: "Services",
      item: "https://www.khizaroverseas.in/services",
    },
    {
      position: 3,
      name: "Visa Guidance & Consultants Hyderabad 2026",
      item: "https://www.khizaroverseas.in/services/visa",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does it take to get a visa in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Processing times vary: Student visas 3–12 weeks, Work visas 2–8 months, Visitor visas 2–6 weeks. Khizar Overseas Hyderabad provides accurate timelines during free consultation.",
      },
    },
    {
      "@type": "Question",
      name: "What is your visa success rate in Hyderabad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "98.7% for properly prepared applications (2025–2026 data). We minimize refusals with expert documentation, SOP guidance & interview preparation.",
      },
    },
    {
      "@type": "Question",
      name: "Do you guarantee visa approval?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No agency can guarantee approval (decided by embassies), but our 98.7% success rate and 5000+ successful cases significantly increase chances.",
      },
    },
    {
      "@type": "Question",
      name: "What documents are required for student visa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depends on country & profile: passport, academics, financial proofs, SOP, LOR, admission letter. We provide free personalized checklist after profile evaluation.",
      },
    },
    {
      "@type": "Question",
      name: "Which countries do you assist with visas in Hyderabad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "USA, Canada, UK, Australia, Germany, Ireland, New Zealand, France, Italy, Singapore, UAE, Japan, South Korea – full support from Hyderabad office.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      {/* Rich Schema – LocalBusiness + Breadcrumb + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Your client component */}
      <VisaGuidancePage />
    </>
  );
}
