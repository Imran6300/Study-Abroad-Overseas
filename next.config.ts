/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "previews.123rf.com" },
      { protocol: "https", hostname: "www.shutterstock.com" },
      { protocol: "https", hostname: "shutterstock.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "https", hostname: "logo.clearbit.com" }
    ],
    qualities: [68, 72, 75, 78],
  },
};

module.exports = withBundleAnalyzer(nextConfig);