// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import AuthInitializer from "@/components/AuthInitializer";
import AuthGate from "@/components/AuthGate";
import Script from "next/script";
import UniversityInitializer from "@/components/UniversityInitializer";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://khizaroverseas.in"),

  title: {
    default: "Best Study Abroad Consultants in India | Overseas Education 2026",
    template: "%s | Overseas Admission Experts – USA, UK, Canada, Australia, Germany",
  },

  description:
    "Top study abroad consultancy in Hyderabad, India. Expert guidance for USA, UK, Canada, Australia & Germany universities. Profile evaluation, SOP writing, visa support, scholarships & 2026 intakes.",

  keywords: [
    "study abroad consultants in India",
    "overseas education consultants Hyderabad",
    "best study abroad consultants 2026",
    "USA student visa guidance India",
    "MS in USA for Indian students",
    "Canada PR after study",
    "study in Australia from India",
    "UK universities for Indian students",
  ],

  authors: [{ name: "Khizar Overseas", url: "https://khizaroverseas.in/contact" }],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Khizar Overseas",
    title: "Best Study Abroad Consultants in India | Overseas Education 2026",
    description:
      "Expert overseas education guidance for Indian students. Apply to top universities in USA, UK, Canada, Australia. Free profile evaluation & visa help.",
    images: [
      {
        url: "/og-image-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Study Abroad Consultants India – Get Admission in Top Universities",
      },
    ],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  // JSON-LD Structured Data (multiple in one script is fine)
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Khizar Overseas",
    url: "https://khizaroverseas.in",
    logo: "https://khizaroverseas.in/logo.png",
    sameAs: [
      "https://www.instagram.com/yourhandle",
      "https://www.youtube.com/@yourchannel",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+917329822309",
      contactType: "Customer Service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No.35, 5-4-410,Nampally, Hyderabad",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500001",
      addressCountry: "IN",
    },
  };

  const jsonLdLocal = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Khizar Overseas – Study Abroad Experts",
    image: "https://khizaroverseas.in/office-photo.png",
    "@id": "https://khizaroverseas.in/#localbusiness",
    url: "https://khizaroverseas.in",
    telephone: "+917329822309",
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No.35, 5-4-410,Nampally",
      addressLocality: "Hyderabad",
      addressRegion: "TG",
      postalCode: "500001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.3898133,
      longitude: 78.4701148,
    },

    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "18:30",
    },
    sameAs: ["https://www.google.com/maps?ll=17.390067,78.470148&z=18&t=m&hl=en&gl=IN&mapclient=embed&cid=17350965534326549540",
      "https://www.facebook.com/people/Khizar-Overseas-Education-Consultant/61553895275238/?rdid=Peg2Nkx4KdECSUkD&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DNf4akFXe%2F"],
  };

  const jsonLdWeb = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Khizar Overseas",
    url: "https://khizaroverseas.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://khizaroverseas.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Structured Data – all in one block is fine & recommended */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([jsonLdOrg, jsonLdLocal, jsonLdWeb]),
          }}
        />
      </head>

      <body className="overflow-x-hidden antialiased">
        <ReduxProvider>
          <AuthInitializer>
            <UniversityInitializer>
              <AuthGate>{children}</AuthGate>
            </UniversityInitializer>
          </AuthInitializer>
        </ReduxProvider>


        {/* Google tag (gtag.js) – Analytics + optional GA4 events */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1W7JC83PF0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1W7JC83PF0', { 
              page_path: window.location.pathname 
            });
          `}
        </Script>
      </body>
    </html>
  );
}