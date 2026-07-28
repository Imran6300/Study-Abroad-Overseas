// app/courses/layout.jsx
// app/courses/layout.jsx
export const metadata = {
  title:
    "Top Study Abroad Courses 2025–2026 | Engineering, Cybersecurity, Medicine, IT & More",
  description:
    "Discover the best study abroad programs for international students: Engineering, Business & MBA, Computer Science, Medicine, Data Science & AI. Compare courses, top universities, fees, scholarships & career outcomes. Free guidance from Hyderabad experts.",

  // Optional but very helpful additions (Next.js 14+ supports them)
  keywords: [
    "study abroad courses",
    "best courses to study abroad 2025",
    "study abroad programs",
    "international students courses",
    "engineering courses abroad",
    "MBA abroad",
    "medicine study abroad",
    "computer science abroad",
    "data science courses abroad",
    "study abroad from India",
  ].join(", "),

  alternates: {
    canonical: "https://www.khizaroverseas.in/courses",
  },

  openGraph: {
    title: "Best Study Abroad Courses & Programs 2025–2026",
    description:
      "Explore popular international courses in Engineering, Business, IT, Medicine & more. Find top universities, scholarships, eligibility & application guidance.",
    url: "https://www.khizaroverseas.in/courses",
    siteName: "Khizar Overseas",
    images: [
      {
        url: "/og-courses.jpg", // ← create a nice 1200×630 image
        width: 1200,
        height: 630,
        alt: "Study Abroad Courses Overview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Top Study Abroad Courses 2026 | Engineering, MBA, Medicine...",
    description:
      "Find the right international course for your career goals – Engineering, IT, Business, Medicine & more.",
    images: ["/og-courses.jpg"],
  },
};

export default function CoursesLayout({ children }) {
  return children;
}
