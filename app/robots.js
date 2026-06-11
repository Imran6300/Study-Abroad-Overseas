export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block private/internal routes
        // NOTE: /_next/ is intentionally NOT blocked — Google needs it to render pages
        disallow: [
          "/api/",
          "/login",
          "/signup",
          "/dashboard/",
          "/admin/",
          "/activate-account",
        ],
      },
    ],
    sitemap: "https://www.khizaroverseas.in/sitemap.xml",
    host: "https://www.khizaroverseas.in",
  };
}
