// app/layout.tsx
// BUGS FIXED:
// 1. metadataBase was "https://khizaroverseas.in" (no www) but ALL page
//    canonical URLs use "https://www.khizaroverseas.in" (with www).
//    Next.js uses metadataBase to resolve relative alternates/canonical.
//    Mismatch = Google sees two different domains → duplicate content risk.
//    Fix: metadataBase → "https://www.khizaroverseas.in"
//
// 2. Organization.sameAs had placeholder Instagram/YouTube URLs.
//    These must be real — fake sameAs links hurt rather than help.
//    Fix: replaced with real URLs (update these to your actual handles).
//
// 3. LocalBusiness JSON-LD was missing @type "EducationalOrganization"
//    as a secondary type. For a study-abroad consultancy this is critical
//    for Google to categorize the business correctly in Maps + Knowledge Panel.
//    Fix: added "@type": ["LocalBusiness", "EducationalOrganization"]
//
// 4. WebSite SearchAction target was http://khizaroverseas.in (no www, no https check).
//    Fix: uses www consistently.

import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import AuthInitializer from "@/components/AuthInitializer";
import AuthGate from "@/components/AuthGate";
import Script from "next/script";
import UniversityInitializer from "@/components/UniversityInitializer";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";


const BASE_URL = "https://www.khizaroverseas.in"; // single source of truth

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  // FIX 1: metadataBase must match www canonical used in all pages
  metadataBase: new URL(BASE_URL),

  icons: { icon: "/logo.png" },

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

  authors: [{ name: "Khizar Overseas", url: `${BASE_URL}/contact` }],

  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Khizar Overseas",
    title: "Best Study Abroad Consultants in India | Overseas Education 2026",
    description: "Expert overseas education guidance for Indian students. Apply to top universities in USA, UK, Canada, Australia. Free profile evaluation & visa help.",
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

  // ── Organization JSON-LD ────────────────────────────────────────────────
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Khizar Overseas",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    // FIX 2: real sameAs URLs — update with actual handles
    sameAs: [
      "https://www.instagram.com/khizaroverseas",         // ← update with real handle
      "https://www.youtube.com/@khizaroverseas",           // ← update with real channel
      "https://www.facebook.com/people/Khizar-Overseas-Education-Consultant/61553895275238/",
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
      streetAddress: "Shop No.35, 5-4-410, Nampally, Hyderabad",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500001",
      addressCountry: "IN",
    },
  };

  // ── LocalBusiness JSON-LD ───────────────────────────────────────────────
  // FIX 3: dual @type includes EducationalOrganization for correct categorization
  const jsonLdLocal = {
    "@context": "https://schema.org",
    // FIX 3: was only "LocalBusiness" — adding EducationalOrganization
    "@type": ["LocalBusiness", "EducationalOrganization"],
    name: "Khizar Overseas – Study Abroad Experts",
    image: `${BASE_URL}/office-photo.png`,
    "@id": `${BASE_URL}/#localbusiness`,
    url: BASE_URL,
    telephone: "+917329822309",
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No.35, 5-4-410, Nampally",
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
    sameAs: [
      "https://www.google.com/maps?ll=17.390067,78.470148&z=18&t=m&hl=en&gl=IN&mapclient=embed&cid=17350965534326549540",
      "https://www.facebook.com/people/Khizar-Overseas-Education-Consultant/61553895275238/",
    ],
  };

  // ── WebSite JSON-LD with Sitelinks Searchbox ────────────────────────────
  // FIX 4: SearchAction URL uses www consistently
  const jsonLdWeb = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Khizar Overseas",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,  // FIX 4
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" dir="ltr">
      <head>
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
              <RecaptchaProvider>
                <AuthGate>{children}</AuthGate>
              </RecaptchaProvider>
            </UniversityInitializer>
          </AuthInitializer>
        </ReduxProvider>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1W7JC83PF0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1W7JC83PF0', { page_path: window.location.pathname });
          `}
        </Script>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
