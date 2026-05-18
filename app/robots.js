export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block pages that shouldn't be indexed — saves crawl budget
        disallow: [
          "/api/",
          "/_next/",
          "/login",
          "/signup",
          "/dashboard",
          "/admin",
        ],
      },
    ],
    sitemap: "https://www.khizaroverseas.in/sitemap.xml",
    host: "https://www.khizaroverseas.in",
  };
}
