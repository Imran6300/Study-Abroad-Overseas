/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,

  // FIX (Organic Growth Audit — silent 404 bake-in, July 2026): the
  // combined 1,885 (course×country) + ~8,091 (university×course hot set)
  // programmatic pages each fire their own live fetch to the backend
  // during generateStaticParams. Uncapped, Next.js runs a large number of
  // these concurrently, which briefly overwhelmed the backend during a
  // recent build — transient failures were silently caught and treated as
  // "page doesn't exist," permanently baking wrong 404s into otherwise-real
  // pages. staticGenerationMaxConcurrency caps how many pages generate at
  // once per worker; staticGenerationRetryCount adds a framework-level
  // retry on top of the manual retries already added to getComboPage() /
  // getUniversityCourse(). Two layers because a build-breaking failure is
  // far more expensive to diagnose than a slightly slower build.
  experimental: {
    staticGenerationMaxConcurrency: 4,
    staticGenerationRetryCount: 2,
  },

  async redirects() {
    return [
      // Existing university redirect
      {
        source: "/universities/:slug",
        destination: "/programs/universities/:slug",
        permanent: true,
      },

      // NEW: Country URL migration redirect
      {
        source: "/all-countries/:slug",
        destination: "/study-in-:slug",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // Country SEO URLs
      {
        source: "/study-in-:slug",
        destination: "/study-in/:slug",
      },


{
  source: "/study-:combo",
  destination: "/study-combo/:combo",
},

      // Sitemap index
      {
        source: "/sitemap.xml",
        destination: "https://api.khizaroverseas.in/sitemap.xml",
      },

      {
        source: "/sitemap-countries.xml",
        destination: "https://api.khizaroverseas.in/sitemap-countries.xml",
      },

      {
        source: "/sitemap-universities.xml",
        destination: "https://api.khizaroverseas.in/sitemap-universities.xml",
      },

      {
        source: "/sitemap-courses.xml",
        destination: "https://api.khizaroverseas.in/sitemap-courses.xml",
      },

      {
        source: "/sitemap-static.xml",
        destination: "https://api.khizaroverseas.in/sitemap-static.xml",
      },

      {
        source: "/sitemap-combo.xml",
        destination: "https://api.khizaroverseas.in/sitemap-combo.xml",
      },

      {
        source: "/sitemap-blogs.xml",
        destination: "https://api.khizaroverseas.in/sitemap-blogs.xml",
      },
      
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // previews.123rf.com, www.shutterstock.com, shutterstock.com, and
      // media.istockphoto.com removed (Organic Growth Audit, item #7).
      // Confirmed via scripts/auditStockImageCdns.js that no DB field or
      // blog content anywhere references these CDNs — safe to drop.
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    qualities: [68, 72, 75, 78],
  },
};

module.exports = withBundleAnalyzer(nextConfig);