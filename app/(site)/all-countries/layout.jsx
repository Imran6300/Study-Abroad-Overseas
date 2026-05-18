export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL),

  title: "Study Abroad Countries 2026 | Visa Success Rates for Indian Students",
  description:
    "Compare visa success rates, tuition fees & scholarships for 100+ study abroad destinations. Expert guidance from Hyderabad. Free counseling — get your profile assessed today.",
  keywords: [
    "study abroad countries 2026",
    "best countries to study abroad for indian students",
    "study abroad visa success rate",
    "study in usa for indian students",
    "study in canada for indian students",
    "study in uk for indian students",
    "study abroad from hyderabad",
    "study abroad consultants india",
    "student visa success rate by country",
  ],

  openGraph: {
    title:
      "Study Abroad Countries 2026 | Visa Success Rates for Indian Students",
    description:
      "Compare 100+ countries: visa success rates, fees, scholarships & top universities. Free profile evaluation from Khizar Overseas, Hyderabad.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/all-countries`,
    siteName: "Khizar Overseas",
  },

  twitter: {
    card: "summary_large_image",
    title: "Study Abroad Countries 2026 | Visa Success Rates",
    description:
      "Compare visa success rates, fees & scholarships for 100+ countries. Free counseling from Khizar Overseas.",
  },

  alternates: {
    canonical: "/all-countries",
  },
};

export default function AllCountriesLayout({ children }) {
  return children;
}
