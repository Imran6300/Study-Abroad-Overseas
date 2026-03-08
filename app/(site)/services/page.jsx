import ServicesClient from "./ServicesClient";

export const metadata = {
  title:
    "Study Abroad Services in Hyderabad | Best Consultants 2026 – Khizar Overseas",
  description:
    "Get complete study abroad services in Hyderabad with Khizar Overseas – best overseas education consultants. Free profile evaluation, university shortlisting, SOP/LOR help, visa filing, scholarships up to $50M+, pre-departure support for USA, UK, Canada, Australia, Germany. 98.7% visa success, 5000+ students placed. Book free consultation now!",

  keywords: [
    "study abroad services Hyderabad",
    "best study abroad consultants Hyderabad",
    "overseas education consultants Hyderabad",
    "study abroad consultants Hyderabad 2026",
    "student visa services Hyderabad",
    "university admission guidance Hyderabad",
    "free study abroad consultation Hyderabad",
    "Khizar Overseas services",
    "study in USA UK Canada Australia Germany Hyderabad",
    "scholarship guidance Hyderabad",
    "top overseas education consultants Hyderabad",
    "visa success rate study abroad Hyderabad",
  ].join(", "),

  alternates: {
    canonical: "https://www.khizaroverseas.in/services",
  },

  openGraph: {
    title:
      "Study Abroad Services Hyderabad | Khizar Overseas – 98.7% Visa Success 2026",
    description:
      "End-to-end overseas education services: profile evaluation, admissions, SOP/LOR, visa support, scholarships & pre-departure. Trusted by 5000+ students in Hyderabad. Free consultation for 2026 intakes!",
    url: "https://www.khizaroverseas.in/services",
    type: "website",
    siteName: "Khizar Overseas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.khizaroverseas.in/images/services-og-2026.jpg", // Update to a fresh image with stats/phone overlay
        width: 1200,
        height: 630,
        alt: "Khizar Overseas – Best Study Abroad Services & Consultants in Hyderabad 2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Best Study Abroad Services Hyderabad | Khizar Overseas 2026",
    description:
      "98.7% visa success • 5000+ students placed • Free consultation • USA/UK/Canada/Australia/Germany",
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

const schema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  name: "Khizar Overseas",
  url: "https://www.khizaroverseas.in",
  logo: "https://www.khizaroverseas.in/logo.png",
  description:
    "Leading study abroad consultants in Hyderabad offering complete services: profile evaluation, university shortlisting, SOP/LOR assistance, visa guidance, scholarships, pre-departure support for USA, UK, Canada, Australia, Germany. 98.7% visa success rate.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No.35, 5-4-410",
    addressLocality: "Nampally, Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500001",
    addressCountry: "IN",
  },
  priceRange: "$$",

  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+917329822309",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Telugu"],
  },
  telephone: "+917329822309",
  email: "khizaroverseas@gmail.com",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.39009,
    longitude: 78.469326,
  },
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
        name: "Free Profile Evaluation & Counseling",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "University Shortlisting & Applications",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "SOP & LOR Writing Assistance",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Student Visa Filing & Guidance",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Scholarships & Financial Planning",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Pre-Departure Orientation & Support",
      },
    },
  ],
  sameAs: [
    "https://www.facebook.com/khizaroverseas",
    "https://www.instagram.com/khizaroverseas",
    "https://wa.me/917329822309", // Add your real social/WhatsApp links
  ],
  // Add if you fetch testimonials
  // review: [...]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the profile evaluation really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes Khizar Overseas offers free profile evaluation for students planning to study abroad.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the study abroad process take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The process usually takes 6 to 12 months depending on university deadlines and visa processing.",
      },
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ServicesClient />
    </>
  );
}
