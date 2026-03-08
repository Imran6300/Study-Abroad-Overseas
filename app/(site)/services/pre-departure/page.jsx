// app/services/pre-departure/page.jsx

import Hero from "@/components/pre-departure/Hero";
import Services from "@/components/pre-departure/Services";
import LiveSession from "@/components/pre-departure/LiveSession";
import Checklist from "@/components/pre-departure/Checklist";
import Trust from "@/components/pre-departure/Trust";
import CTA from "@/components/pre-departure/CTA";

export const metadata = {
  metadataBase: new URL("https://www.khizaroverseas.in"),

  title:
    "Pre-Departure Support & Orientation Hyderabad 2026 | Khizar Overseas – Best Consultants",

  description:
    "Expert pre-departure support in Hyderabad for study abroad: orientation sessions, packing checklist, accommodation guidance, airport briefing, travel tips & post-arrival help for USA, UK, Canada, Australia, Germany. 98.7% visa success, 5000+ students prepared. Free pre-departure session – Call/WhatsApp +91 73298 22309 now!",

  keywords: [
    "pre departure support study abroad Hyderabad",
    "pre departure orientation Hyderabad",
    "pre departure guidance study abroad",
    "study abroad pre departure briefing Hyderabad",
    "pre departure checklist international students",
    "airport briefing for study abroad Hyderabad",
    "packing list study abroad Hyderabad",
    "accommodation guidance study abroad",
    "post arrival support study abroad",
    "Khizar Overseas pre departure services",
    "study abroad preparation Hyderabad 2026",
    "best pre departure consultants Hyderabad",
  ].join(", "),

  alternates: {
    canonical: "https://www.khizaroverseas.in/services/pre-departure",
  },

  openGraph: {
    title:
      "Pre-Departure Orientation & Support Hyderabad | Khizar Overseas 2026",
    description:
      "Smooth transition abroad: live sessions, detailed checklists, travel prep, accommodation & cultural tips. Trusted by 5000+ Hyderabad students. Free session for 2026/2027 intakes – WhatsApp +91 73298 22309!",
    url: "https://www.khizaroverseas.in/services/pre-departure",
    type: "website",
    siteName: "Khizar Overseas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.khizaroverseas.in/images/predeparture-og-2026.jpg", // Update: add airport/student + checklist + phone overlay
        width: 1200,
        height: 630,
        alt: "Khizar Overseas Pre-Departure Support & Orientation for Study Abroad Hyderabad 2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Pre-Departure Guidance Hyderabad | Khizar Overseas – Free 2026 Prep",
    description:
      "98.7% success • 5000+ students • Packing, Accommodation, Airport Briefing • USA/UK/Canada/Australia/Germany",
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
    "Best pre-departure support consultants in Hyderabad for study abroad. Orientation, packing checklist, accommodation, airport briefing & settlement guidance for USA, UK, Canada, Australia, Germany. 98.7% visa success.",
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
        name: "Pre-Departure Orientation & Live Sessions",
        description:
          "Interactive sessions on cultural adaptation, travel safety & life abroad",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Packing Checklist & Travel Preparation",
        description: "Detailed checklists for luggage, documents & essentials",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Accommodation & Airport Briefing",
        description:
          "Guidance on housing options, airport procedures & arrival tips",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Post-Arrival Support",
        description: "Help with settlement, banking & emergency contacts",
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
      name: "Pre-Departure Support & Orientation",
      item: "https://www.khizaroverseas.in/services/pre-departure",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does pre-departure support include at Khizar Overseas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our pre-departure services cover live orientation sessions...",
      },
    },
    {
      "@type": "Question",
      name: "Is pre-departure orientation free for students?",
      acceptedAnswer: {
        "@type": "Answer",

        text: "Yes, we offer free pre-departure briefing sessions in Hyderabad after visa approval. Book via call/WhatsApp +91 73298 22309.",
      },
    },
    {
      "@type": "Question",

      name: "When should I attend pre-departure guidance?",
      acceptedAnswer: {
        "@type": "Answer",

        text: "Ideally 4–6 weeks before your flight. We schedule live sessions for 2026/2027 intakes to cover everything from baggage rules to banking abroad.",
      },
    },
    {
      "@type": "Question",
      name: "Do you help with accommodation before departure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes – we guide on university dorms, private housing, homestays, costs, and safe booking options in your study destination.",
      },
    },
    {
      "@type": "Question",
      name: "What is included in your study abroad packing checklist?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our comprehensive checklist includes documents, electronics, clothing for weather, medicines, adapters, and essentials – customized by country.",
      },
    },
    // Add more if you have space/content
  ],
};

export default function PreDeparturePage() {
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

      <main className="bg-[#0b1220] text-gray-200">
        <Hero />
        <Services />
        <LiveSession />
        <Checklist />
        <Trust />
        <CTA />
      </main>
    </>
  );
}
