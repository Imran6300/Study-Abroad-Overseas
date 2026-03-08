export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL),

  title: "Best Countries to Study Abroad in 2026 | Top Study Destinations",
  description:
    "Explore the best countries to study abroad including USA, Canada, UK, Australia and more.",
  keywords: [
    "study abroad countries",
    "best countries to study abroad",
    "study abroad destinations",
    "study in USA",
    "study in Canada",
    "study in UK",
    "study abroad opportunities",
  ],

  openGraph: {
    title: "Best Countries to Study Abroad",
    description:
      "Discover top countries for international students including visa success rate, universities and scholarships.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/all-countries`,
  },

  alternates: {
    canonical: "/all-countries",
  },
};
export default function AllCountriesLayout({ children }) {
  return children;
}
