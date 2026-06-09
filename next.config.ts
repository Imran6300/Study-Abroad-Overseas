/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/universities/:slug",
        destination: "/programs/universities/:slug",
        permanent: true,
      },
    ];
  },

  async rewrites() {
  return [
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
      { protocol: "https", hostname: "previews.123rf.com" },
      { protocol: "https", hostname: "www.shutterstock.com" },
      { protocol: "https", hostname: "shutterstock.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    qualities: [68, 72, 75, 78],
  },
};

module.exports = withBundleAnalyzer(nextConfig);