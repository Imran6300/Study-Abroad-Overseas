// app/services/finance/page.jsx

import FinancialClient from "./FinancialClient";

export const metadata = {
  metadataBase: new URL("https://www.khizaroverseas.in"),
  title:
    "Study Abroad Financial Planning & Cost Calculator Hyderabad 2026 | Khizar Overseas",
  description:
    "Calculate real study abroad costs in Hyderabad with Khizar Overseas – best overseas education consultants. Get accurate estimates for tuition, living expenses, scholarships, education loans for USA, UK, Canada, Australia, Germany. 98.7% visa success, 5000+ students helped. Free financial consultation & loan guidance now!",

  keywords: [
    "study abroad financial planning Hyderabad",
    "study abroad cost calculator Hyderabad",
    "cost of studying abroad Hyderabad 2026",
    "education loan for study abroad Hyderabad",
    "study abroad expenses USA UK Canada Australia Germany",
    "scholarships and financial aid Hyderabad",
    "best financial planning consultants study abroad Hyderabad",
    "Khizar Overseas finance services",
    "study in USA cost from Hyderabad",
    "free study abroad cost consultation Hyderabad",
    "overseas education loan guidance Hyderabad",
  ].join(", "),

  openGraph: {
    title:
      "Study Abroad Cost Calculator & Financial Planning Hyderabad | Khizar Overseas 2026",
    description:
      "Get personalized cost breakdown + scholarships up to $50M+ & education loan help. Trusted by 5000+ Hyderabad students for USA, UK, Canada, Australia, Germany. Free consultation – Call/WhatsApp +91 73298 22309!",
    url: "https://www.khizaroverseas.in/services/finance",
    type: "website",
    siteName: "Khizar Overseas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.khizaroverseas.in/images/finance-og-2026.jpg", // Make new image: calculator screenshot + stats + phone overlay
        width: 1200,
        height: 630,
        alt: "Khizar Overseas Study Abroad Cost Calculator & Financial Planning Hyderabad 2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Study Abroad Cost Calculator Hyderabad | Khizar Overseas – Free 2026 Planning",
    description:
      "98.7% visa success • 5000+ placed • Scholarships + Loans • USA/UK/Canada/Australia/Germany costs",
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
  alternates: {
    canonical: "https://www.khizaroverseas.in/services/finance",
    languages: {
      "en-IN": "https://www.khizaroverseas.in/services/finance",
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.khizaroverseas.in/#organization",
  name: "Khizar Overseas",
  url: "https://www.khizaroverseas.in",
  logo: "https://www.khizaroverseas.in/logo.png",
  description:
    "Best study abroad financial planning consultants in Hyderabad offering cost calculators, scholarship guidance, education loans, and free consultations for USA, UK, Canada, Australia, Germany.",
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
        name: "Study Abroad Cost Calculator & Financial Planning",
        description:
          "Personalized cost estimates including tuition, living, scholarships & loans",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Education Loan Guidance",
        description: "Help securing low-interest loans for overseas education",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Scholarship Assistance",
        description: "Maximize funding opportunities up to $50M+",
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
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.khizaroverseas.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: "https://www.khizaroverseas.in/services",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Financial Planning & Cost Calculator",
      item: "https://www.khizaroverseas.in/services/finance",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the average cost of studying abroad in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Costs vary by country: USA (~₹35–60L/year), UK (~₹25–45L), Canada (~₹20–40L), Australia (~₹25–50L), Germany (₹10–20L with low/no tuition). Includes tuition + living expenses. Use our free calculator for personalized estimates.",
      },
    },
    {
      "@type": "Question",
      name: "How can Khizar Overseas help with financial planning for study abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide free cost breakdowns, scholarship hunting (up to $50M+ secured), education loan guidance from top banks/NBFCs, and budgeting tips to reduce expenses. Book a free consultation in Hyderabad.",
      },
    },
    {
      "@type": "Question",
      name: "Which country is cheapest to study abroad in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Germany often ranks cheapest (low/no tuition at public unis + ~₹8–15L living/year). Canada & Australia offer good ROI with part-time work options. We help compare based on your profile.",
      },
    },
    {
      "@type": "Question",
      name: "Do you assist with education loans for study abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes – we guide you through low-interest loans from Indian banks/NBFCs, including documentation, eligibility checks, and faster processing. Many students secure loans covering 100% costs.",
      },
    },
    // Add 2–3 more if you have content for them
  ],
};

export default function FinancePage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <FinancialClient />
    </>
  );
}
