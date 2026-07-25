// app/(site)/partners/layout.jsx
//
// SEO UPGRADE NOTES (read before editing further):
//
// 1. TITLE — the root layout (app/layout.tsx) defines a title template:
//        template: "%s | Overseas Admission Experts – USA, UK, Canada, Australia, Germany"
//    If this page's `metadata.title` is a plain string, Next.js appends that
//    entire template to it, producing a title well over 90 characters that
//    Google will truncate mid-sentence in search results. Since "Partners"
//    is a distinct product (not a generic admissions page), we override the
//    template with `title.absolute` so this page gets a clean, full-control
//    title tag under ~60 characters.
//
// 2. OG / TWITTER IMAGE — now points to a dedicated 1200x630 banner
//    (/og-partners-1200x630.jpg) instead of reusing the homepage image, so
//    the page has its own accurate, on-brand preview in search, WhatsApp,
//    LinkedIn, Slack, and X/Twitter share cards. Drop the generated file
//    into /public/og-partners-1200x630.jpg (paired .png also provided).
//
// 3. STRUCTURED DATA — rebuilt as a single linked @graph using stable @id
//    references (Organization <-> WebPage <-> SoftwareApplication <->
//    BreadcrumbList <-> FAQPage). Linking nodes by @id (instead of repeating
//    inline objects) is what Google's docs recommend so the entities are
//    understood as the *same* thing across schemas, which is what actually
//    unlocks rich results (sitelinks search box, FAQ rich snippets, software
//    app cards) — this is the highest-leverage change here, more so than
//    the <meta name="keywords"> tag, which Google has not used as a ranking
//    signal since 2009. Kept `keywords` populated anyway for Bing/other
//    engines and internal content-strategy reference, but real first-page
//    ranking will come from on-page content depth, internal linking, page
//    speed, and backlinks — not meta tags alone.
//
// 4. Nothing about the reCAPTCHA / background visual behavior below changed.

export const metadata = {
  // Full control over the <title> tag — bypasses the root layout's
  // generic template so this page's title stays clean and on-topic.
  title: {
    absolute:
      "Partner With Us | White-Label Study Abroad Platform for Agencies",
  },

  description:
    "White-label study abroad CRM and partner platform for agencies and counselors: student CRM, commission-based student lead sharing, visa workflow automation, and a fully branded portal — live in 24 hours. Join 20+ partner agencies already scaling with us.",

  keywords: [
    "study abroad platform for agencies",
    "white label education CRM",
    "white label study abroad software",
    "overseas education consultancy software",
    "student visa management system",
    "university application tracking software",
    "study abroad agency tools",
    "study abroad tools for counselors",
    "white label student portal",
    "education agency CRM",
    "CRM for study abroad consultants",
    "overseas consultancy management platform",
    "study abroad partner program",
    "study abroad franchise software",
    "student CRM for education consultants",
    "visa workflow automation software",
    "branded education portal India",
    "overseas education SaaS platform",
    "start a study abroad consultancy",
    "education agency management system India",
    "commission based student leads",
    "commission based student leads for agencies",
    "student lead sharing platform",
    "study abroad lead generation for agencies",
    "buy student leads overseas education",
  ],

  authors: [{ name: "Khizar Overseas", url: "/contact" }],
  category: "Education Technology",
  applicationName: "Khizar Overseas Partner Program",

  openGraph: {
    title: "Partner With Us | White-Label Study Abroad Platform for Agencies",
    description:
      "Run your entire overseas education consultancy from one platform — white-label dashboards, student CRM, visa workflows, and team management, all under your own brand. Live in 24 hours.",
    type: "website",
    locale: "en_IN",
    // Relative URL — resolved against metadataBase ("https://www.khizaroverseas.in")
    // set in app/layout.tsx, same pattern the rest of the site uses.
    url: "/partners",
    siteName: "Khizar Overseas",
    images: [
      {
        // Dedicated partners banner — see notes above. Place the generated
        // file at /public/og-partners-1200x630.jpg.
        url: "https://www.khizaroverseas.in/og-partners-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Khizar Overseas Partner Program — White-Label Study Abroad Platform for Agencies",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Partner With Us | White-Label Study Abroad Platform for Agencies",
    description:
      "Student CRM, visa workflow automation, and a fully branded portal for your overseas education agency — live in 24 hours.",
    images: ["https://www.khizaroverseas.in/og-partners-1200x630.png"],
  },

  alternates: {
    canonical: "/partners",
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

const BASE_URL = "https://www.khizaroverseas.in";

// Structured data: one linked @graph — Organization, WebPage,
// SoftwareApplication, BreadcrumbList, and FAQPage, all tied together by
// @id so Google resolves them as the same underlying entities rather than
// isolated, duplicate-looking schemas.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Khizar Overseas",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      description:
        "The operating system for overseas education agencies — white-label infrastructure powering study abroad consultancies worldwide.",
    },
    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/partners#webpage`,
      url: `${BASE_URL}/partners`,
      name: "Partner With Us | White-Label Study Abroad Platform for Agencies",
      description:
        "White-label study abroad CRM and partner platform for agencies and counselors: student CRM, commission-based student lead sharing, visa workflow automation, and a fully branded portal — live in 24 hours.",
      isPartOf: { "@id": `${BASE_URL}/#organization` },
      about: { "@id": `${BASE_URL}/partners#software` },
      breadcrumb: { "@id": `${BASE_URL}/partners#breadcrumb` },
      primaryImageOfPage: `${BASE_URL}/og-partners-1200x630.png`,
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE_URL}/partners#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Partners",
          item: `${BASE_URL}/partners`,
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/partners#software`,
      name: "Khizar Overseas Partner Program",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Education CRM",
      operatingSystem: "Web",
      image: `${BASE_URL}/og-partners-1200x630.png`,
      url: `${BASE_URL}/partners`,
      description:
        "White-label study abroad management platform for overseas education agencies. Includes student CRM, university application tracking, visa workflow automation, team management, and branded portals.",
      provider: { "@id": `${BASE_URL}/#organization` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free demo available. Partner pricing on request.",
      },
      featureList: [
        "White-label branded portal",
        "Student CRM system",
        "Commission-based student lead sharing",
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
      "@type": "FAQPage",
      "@id": `${BASE_URL}/partners#faq`,
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
        {
          "@type": "Question",
          name: "Do I need any technical or development skills to get started?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. We handle domain, branding, and setup end-to-end. If you can use email, you can run your agency on the platform.",
          },
        },
        {
          "@type": "Question",
          name: "Do you provide commission-based student leads to partner agencies?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Beyond the CRM, partner agencies and counselors can opt into our student lead-sharing network — you only pay a commission on students you actually enroll. No retainers, no upfront lead-buying cost.",
          },
        },
        {
          "@type": "Question",
          name: "Is this a CRM, a study abroad tool, or both?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Both. It's a white-label student CRM and a full set of study abroad tools — application tracking, visa workflows, and analytics — built specifically for overseas education agencies and counselors, not a generic sales CRM.",
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
