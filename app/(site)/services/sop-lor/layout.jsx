// app/services/sop-lor/layout.jsx  (shared layout for SOP/LOR pages)

export const metadata = {
  metadataBase: new URL("https://www.khizaroverseas.in"),

  title:
    "SOP & LOR Writing Services Hyderabad 2026 | Khizar Overseas – Best Consultants",
  description:
    "Expert SOP & LOR writing/editing services in Hyderabad for study abroad 2026 intakes. 100% plagiarism-free, personalized Statement of Purpose & strong Letters of Recommendation for USA, UK, Canada, Australia and Germany. Trusted by thousands of students to improve admission success.",

  keywords: [
    "SOP writing services Hyderabad",
    "LOR writing services Hyderabad",
    "SOP LOR assistance study abroad Hyderabad",
    "professional SOP writers Hyderabad 2026",
    "best SOP LOR consultants Hyderabad",
    "statement of purpose writing service Hyderabad",
    "letter of recommendation writing Hyderabad",
    "SOP editing for USA Canada UK Australia Germany",
    "study abroad SOP LOR help Hyderabad",
    "plagiarism free SOP writing 2026",
    "university admission SOP assistance Hyderabad",
  ].join(", "),

  alternates: {
    canonical: "https://www.khizaroverseas.in/services/sop-lor",
  },

  openGraph: {
    title:
      "SOP & LOR Writing Services Hyderabad | Khizar Overseas – 2026 Admissions",
    description:
      "Get expert, 100% original SOP & LOR drafting/editing. Tailored for USA, UK, Canada, Australia, Germany applications. Trusted by 5000+ students – 98.7% success. Free review – WhatsApp +91 73298 22309!",
    url: "https://www.khizaroverseas.in/services/sop-lor",
    type: "website",
    siteName: "Khizar Overseas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.khizaroverseas.in/images/sop-lor-og-2026.jpg", // Create fresh: student writing + "SOP/LOR Expert" + stats + phone overlay
        width: 1200,
        height: 630,
        alt: "Khizar Overseas SOP & LOR Writing Services for Study Abroad Hyderabad 2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Best SOP & LOR Services Hyderabad | Khizar Overseas 2026",
    description:
      "100% plagiarism-free • Personalized • USA/UK/Canada/Australia/Germany • 98.7% success • Free guidance",
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

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Khizar Overseas",
  url: "https://www.khizaroverseas.in",
  logo: "https://www.khizaroverseas.in/logo.png",
  description:
    "Top SOP & LOR writing services in Hyderabad for study abroad. Professional, plagiarism-free Statement of Purpose & Letters of Recommendation for USA, UK, Canada, Australia, Germany. 98.7% visa success, 5000+ students assisted.",
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
        name: "Professional SOP Writing & Editing",
        description:
          "100% plagiarism-free, tailored Statement of Purpose for university admissions",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "LOR Writing & Guidance",
        description:
          "Strong, impactful Letters of Recommendation customized to your profile",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "SOP & LOR Review & Improvement",
        description: "Expert editing to boost admission & visa chances",
      },
    },
  ],
  sameAs: [
    "https://www.facebook.com/khizaroverseas",
    "https://www.instagram.com/khizaroverseas",
    "https://wa.me/917329822309",
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "SOP & LOR Writing Services for Study Abroad",
  provider: {
    "@type": "Organization",
    name: "Khizar Overseas",
    url: "https://www.khizaroverseas.in",
  },
  areaServed: {
    "@type": "Place",
    name: "Hyderabad",
  },
  description:
    "Professional SOP and LOR writing services for study abroad applications to USA, UK, Canada, Australia and Germany.",
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
      name: "SOP & LOR Writing Services",
      item: "https://www.khizaroverseas.in/services/sop-lor",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the difference between SOP and LOR?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOP (Statement of Purpose) is your personal essay explaining motivation, goals & fit for the program. LOR (Letter of Recommendation) is written by professors/employers validating your skills & character.",
      },
    },
    {
      "@type": "Question",
      name: "How does Khizar Overseas help with SOP & LOR?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide professional drafting, editing, & review services – 100% plagiarism-free, tailored to country/university requirements (USA career focus, Canada GTE, Germany research fit). Free initial consultation in Hyderabad.",
      },
    },
    {
      "@type": "Question",
      name: "Is SOP & LOR writing service worth it for 2026 applications?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes – strong SOP/LOR can increase admission chances by 30–50% in competitive pools. Our 98.7% visa success rate proves the impact of well-crafted documents.",
      },
    },
    {
      "@type": "Question",
      name: "How long does SOP/LOR assistance take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Typically 5–10 days for full drafting/editing (depending on revisions). Rush options available for 2026 deadlines.",
      },
    },
    {
      "@type": "Question",
      name: "Do you guarantee admission with your SOP/LOR?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No service can guarantee admission, but our expert, personalized writing maximizes your profile's strength – backed by thousands of successful applications.",
      },
    },
  ],
};

export default function SopLorLayout({ children }) {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
