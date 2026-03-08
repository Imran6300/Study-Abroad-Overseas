// app/services/profile-evaluation/page.jsx

import ProfileEvaluationClient from "./ProfileEvaluationClient";

export const metadata = {
  metadataBase: new URL("https://www.khizaroverseas.in"),

  title:
    "Free Study Abroad Profile Evaluation Hyderabad 2026 | Khizar Overseas – Best Consultants",

  description:
    "Get 100% free study abroad profile evaluation in Hyderabad with Khizar Overseas. Expert assessment of academics, work experience, visa chances, scholarships & best university recommendations for USA, UK, Canada, Australia, Germany. 98.7% visa success, 5000+ students placed. Book free evaluation now – Call/WhatsApp +91 73298 22309!",

  keywords: [
    "free study abroad profile evaluation Hyderabad",
    "study abroad profile evaluation Hyderabad 2026",
    "best profile assessment study abroad Hyderabad",
    "free overseas education profile evaluation",
    "study abroad eligibility check Hyderabad",
    "study abroad counselling Hyderabad free",
    "Khizar Overseas profile evaluation",
    "university shortlisting free Hyderabad",
    "scholarship eligibility assessment Hyderabad",
    "study in USA UK Canada Australia Germany profile check",
    "top study abroad consultants Hyderabad free evaluation",
  ].join(", "),

  alternates: {
    canonical: "https://www.khizaroverseas.in/services/profile-evaluation",
  },

  openGraph: {
    title:
      "Free Profile Evaluation for Study Abroad Hyderabad | Khizar Overseas 2026",
    description:
      "Personalized free assessment: academics, GRE/IELTS, work exp, visa probability, scholarships & top university matches. Trusted by 5000+ Hyderabad students. Free session – WhatsApp +91 73298 22309!",
    url: "https://www.khizaroverseas.in/services/profile-evaluation",
    type: "website",
    siteName: "Khizar Overseas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.khizaroverseas.in/images/profile-evaluation-og-2026.jpg", // Fresh image: form/student + "FREE" badge + phone overlay
        width: 1200,
        height: 630,
        alt: "Khizar Overseas Free Study Abroad Profile Evaluation Hyderabad 2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Free Study Abroad Profile Evaluation Hyderabad | Khizar Overseas 2026",
    description:
      "98.7% visa success • 5000+ students • Free university & scholarship suggestions • USA/UK/Canada/Australia/Germany",
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
  "@id": "https://www.khizaroverseas.in/#organization",

  name: "Khizar Overseas",
  url: "https://www.khizaroverseas.in",
  logo: "https://www.khizaroverseas.in/logo.png",
  description:
    "Best study abroad consultants in Hyderabad offering 100% free profile evaluation, university shortlisting, visa guidance & scholarships for USA, UK, Canada, Australia, Germany. 98.7% success rate.",
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
  priceRange: "$$ (Free Profile Evaluation)",
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
        name: "Free Study Abroad Profile Evaluation",
        description:
          "Expert assessment of academics, tests, experience, visa chances & scholarship eligibility",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "University Shortlisting & Recommendations",
        description: "Personalized list of best-fit universities & courses",
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
      name: "Free Profile Evaluation",
      item: "https://www.khizaroverseas.in/services/profile-evaluation",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the profile evaluation really free at Khizar Overseas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% free – no hidden charges. Our experts provide detailed feedback on your academics, test scores, work experience, visa probability, scholarships and university shortlisting.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the free profile evaluation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Usually 30–45 minutes in a one-on-one session (online or in-office in Hyderabad). You'll get instant personalized recommendations for 2026/2027 intakes.",
      },
    },
    {
      "@type": "Question",
      name: "What documents do I need for profile evaluation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Basic: Academic transcripts, test scores (IELTS/GRE/GMAT/PTE), passport copy, resume/CV, work experience letters (if any). We guide you on everything during the session.",
      },
    },
    {
      "@type": "Question",
      name: "Which countries do you evaluate profiles for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We specialize in USA, UK, Canada, Australia, Germany, Ireland, New Zealand & more. Full support for admissions, scholarships & visas.",
      },
    },
    {
      "@type": "Question",
      name: "How soon can I get university suggestions after evaluation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Immediately in the session! We shortlist 8–12 best-fit universities based on your profile, budget & goals – plus scholarship possibilities.",
      },
    },
  ],
};

export default function ProfileEvaluationPage() {
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

      <ProfileEvaluationClient />
    </>
  );
}
