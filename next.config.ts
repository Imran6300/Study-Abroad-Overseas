/** @type {import('next').NextConfig} */
//
// BUGS FIXED:
// 1. /sitemap-static.xml rewrite was MISSING entirely.
//    The backend serves it at /sitemap-static.xml but there was no rewrite
//    in next.config → Next.js returned 404 → GSC shows "Couldn't fetch".
//    Fix: added the missing rewrite entry.
//
// 2. /sitemap-combo.xml rewrite was also missing.
//    Fix: added it.
//
// 3. /sitemap-blogs.xml rewrite was also missing.
//    Fix: added it.
//
// NOTE: The old sitemap-static had path: /sitemap-static (no .xml) in the
//       route AND in the GSC submitted URL — both need to match .xml.

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // Existing permanent redirect — keeps old /universities/:slug links working
      {
        source:      "/universities/:slug",
        destination: "/programs/universities/:slug",
        permanent:   true,
      },
    ];
  },

  async rewrites() {
    return [
      // ── Sitemap index ─────────────────────────────────────────────────
      {
        source:      "/sitemap.xml",
        destination: "https://api.khizaroverseas.in/sitemap.xml",
      },

      // ── Sub-sitemaps ──────────────────────────────────────────────────
      {
        source:      "/sitemap-countries.xml",
        destination: "https://api.khizaroverseas.in/sitemap-countries.xml",
      },
      {
        source:      "/sitemap-universities.xml",
        destination: "https://api.khizaroverseas.in/sitemap-universities.xml",
      },
      {
        source:      "/sitemap-courses.xml",
        destination: "https://api.khizaroverseas.in/sitemap-courses.xml",
      },
      // FIX 1+2: these three were missing
      {
        source:      "/sitemap-static.xml",
        destination: "https://api.khizaroverseas.in/sitemap-static.xml",
      },
      {
        source:      "/sitemap-combo.xml",
        destination: "https://api.khizaroverseas.in/sitemap-combo.xml",
      },
      {
        source:      "/sitemap-blogs.xml",
        destination: "https://api.khizaroverseas.in/sitemap-blogs.xml",
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com"      },
      { protocol: "https", hostname: "images.unsplash.com"     },
      { protocol: "https", hostname: "previews.123rf.com"      },
      { protocol: "https", hostname: "www.shutterstock.com"    },
      { protocol: "https", hostname: "shutterstock.com"        },
      { protocol: "https", hostname: "media.istockphoto.com"   },
      { protocol: "https", hostname: "logo.clearbit.com"       },
      { protocol: "https", hostname: "placehold.co"            },
    ],
    qualities: [68, 72, 75, 78],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
