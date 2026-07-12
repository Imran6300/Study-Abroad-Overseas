export const metadata = {
  title: "Partner With Us – White-Label Study Abroad Platform for Agencies",

  description:
    "Power your overseas education consultancy with our white-label platform. Student CRM, visa workflows, branded portal, team management & analytics — live in 24 hours. Join 20+ partner agencies.",

  keywords: [
    "study abroad platform for agencies",
    "white label education CRM",
    "overseas education consultancy software",
    "student visa management system",
    "university application tracking software",
    "study abroad agency tools",
    "white label student portal",
    "education agency CRM",
    "overseas consultancy management platform",
    "study abroad partner program",
  ],

  openGraph: {
    title: "Partner With Us – White-Label Study Abroad Platform for Agencies",
    description:
      "Run your entire overseas education consultancy from one platform. White-label dashboards, student CRM, visa workflows, and team management — all under your brand. Live in 24 hours.",
    type: "website",
    url: "https://yourdomain.com/partners",
    siteName: "YourPlatformName",
    images: [
      {
        url: "https://yourdomain.com/og/partners.png", // 1200x630px recommended
        width: 1200,
        height: 630,
        alt: "White-Label Study Abroad Platform for Agencies",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Partner With Us – White-Label Study Abroad Platform for Agencies",
    description:
      "Run your entire overseas education consultancy from one platform. Student CRM, visa workflows, branded portals — live in 24 hours.",
    images: ["https://yourdomain.com/og/partners.png"],
  },

  alternates: {
    canonical: "https://yourdomain.com/partners",
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

// Structured data: SoftwareApplication + Organization schema
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "YourPlatformName Partner Program",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "White-label study abroad management platform for overseas education agencies. Includes student CRM, university application tracking, visa workflow automation, team management, and branded portals.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free demo available. Partner pricing on request.",
      },
      featureList: [
        "White-label branded portal",
        "Student CRM system",
        "University application tracking",
        "Visa workflow automation",
        "Multi-counselor team management",
        "Analytics and reporting dashboard",
        "Custom domain support",
        "Workflow automation",
      ],
      audience: {
        "@type": "Audience",
        audienceType:
          "Overseas Education Consultancies and Study Abroad Agencies",
      },
    },
    {
      "@type": "Organization",
      name: "YourPlatformName",
      url: "https://yourdomain.com",
      description:
        "The operating system for overseas education agencies — white-label infrastructure powering study abroad consultancies worldwide.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Sales",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Will my students know this is a third-party platform?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely not. Students see only your brand — your logo, your domain, your colors. We operate entirely in the background.",
          },
        },
        {
          "@type": "Question",
          name: "How long does it take to get set up?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most partners are fully live within 24 hours. We handle domain setup, branding configuration, and initial data migration for you.",
          },
        },
        {
          "@type": "Question",
          name: "Can I manage multiple branch offices?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Our platform supports unlimited branches with separate counselor teams, each with their own dashboards and access controls.",
          },
        },
        {
          "@type": "Question",
          name: "Is my student data safe and private?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Enterprise-grade encryption and access controls protect every piece of data. You own your student data completely — always.",
          },
        },
        {
          "@type": "Question",
          name: "What happens as I scale from 50 to 5,000 students?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nothing changes on your end. Our infrastructure scales automatically. You just focus on growing your agency.",
          },
        },
      ],
    },
  ],
};

export default function PartnersLayout({ children }) {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* reCAPTCHA: intentionally NOT loaded here anymore. The root
          app/layout.tsx already wraps every page (including this one) in
          <RecaptchaProvider>, which loads
          https://www.google.com/recaptcha/api.js?render=<SITE_KEY> once,
          site-wide. Loading it a second time here (as a raw <Script> tag)
          was corrupting window.grecaptcha and causing "Could not connect
          to the reCAPTCHA service" errors on this page. The
          window.grecaptcha.execute(...) call in page.jsx still works fine
          since the script is already loaded globally by the time this
          page's form submits. */}

      <div className="min-h-screen bg-[#071226] text-white overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-[-120px] left-[-100px] w-[350px] h-[350px] bg-[#4169E1]/20 blur-3xl rounded-full" />
          <div className="absolute top-[30%] right-[-120px] w-[350px] h-[350px] bg-[#32CD32]/10 blur-3xl rounded-full" />
          <div className="absolute bottom-[-120px] left-[20%] w-[320px] h-[320px] bg-[#FF8C00]/15 blur-3xl rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {children}
      </div>
    </>
  );
}
