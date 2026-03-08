import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactHeader from "@/components/contact/ContactHeader";

// app/contact/metadata.js

export const metadata = {
  title:
    "Contact Khizar Overseas – Best Study Abroad Consultants in Hyderabad 2026 | Free Consultation",
  description:
    "Contact top study abroad consultants in Hyderabad for free profile evaluation & expert guidance. Study in USA, UK, Canada, Australia, Germany with 98.7% visa success rate & 5000+ students placed. Call/WhatsApp +91 73298 22309 now for 2026 intakes – Nampally office.",

  keywords: [
    "study abroad consultants Hyderabad contact",
    "overseas education consultants Hyderabad phone",
    "best study abroad consultants in Hyderabad",
    "free study abroad consultation Hyderabad",
    "Khizar Overseas contact number",
    "study visa consultants Hyderabad WhatsApp",
    "study in USA UK Canada Australia Germany Hyderabad",
    "overseas education consultants near me Hyderabad",
    "Nampally study abroad consultants",
    "scholarship guidance Hyderabad contact",
    "best visa success rate consultants Hyderabad 2026",
  ].join(", "),

  // Helps a tiny bit with local SEO signals (not super powerful but harmless)
  other: {
    "geo.region": "Telangana",
    "geo.placename": "Hyderabad",
    "geo.position": "17.390090;78.469326",
  },

  openGraph: {
    title:
      "Contact Khizar Overseas – Top Study Abroad Consultants Hyderabad | 98.7% Visa Success",
    description:
      "Get free expert consultation today! 5000+ students placed worldwide. USA, UK, Canada, Australia, Germany admissions, scholarships, visa support. WhatsApp/Call: +91 73298 22309. Visit us in Nampally, Hyderabad.",
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/contact`,
    type: "website",
    siteName: "Khizar Overseas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.khizaroverseas.in/images/contact-og-2026.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Khizar Overseas – Best Overseas Education Consultants in Hyderabad 2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Khizar Overseas | Free Study Abroad Consultation Hyderabad",
    description:
      "98.7% visa success • 5000+ placed • Free 2026 intake guidance • Call/WhatsApp +91 73298 22309",
    images: ["https://www.khizaroverseas.in/images/contact-og-2026.jpg"],
  },

  alternates: {
    canonical: "https://www.khizaroverseas.in/contact",
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

export const revalidate = 3600;
const schema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Khizar Overseas",
  url: "https://www.khizaroverseas.in",
  logo: "https://www.khizaroverseas.in/logo.png",
  telephone: "+917329822309",
  email: "khizaroverseas@gmail.com",

  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No.35, 5-4-410 Nampally",
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

  areaServed: ["Hyderabad", "India"],

  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+917329822309",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi", "Telugu"],
  },
};

export default function Contact() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white px-5 sm:px-6 py-20 md:py-20 lg:py-24">
        <ContactHeader />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
    </>
  );
}
