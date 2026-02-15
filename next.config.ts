/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "previews.123rf.com",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
    ],
    qualities: [68, 72, 75, 78],
  },
};

export default nextConfig;
