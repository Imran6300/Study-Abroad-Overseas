import Link from "next/link";
import StudentStoryCard from "@/components/StudentCard/StudentStoryCard";
import FadeUp from "@/components/Animations/FadeUp";

export const metadata = {
  title: "Success Stories & Visa Approvals 2025–2026 | Khizar Overseas",
  description:
    "Real success stories from Indian students: 500+ visa approvals (USA, UK, Canada, Australia, Germany), full scholarships, top university admissions with Khizar Overseas. Read inspiring student testimonials & visa success stories now.",
  keywords: [
    "study abroad success stories",
    "visa success stories India",
    "Khizar Overseas success stories",
    "study abroad visa approval stories",
    "student visa success stories 2025",
    "overseas education testimonials",
    "Khizar Overseas reviews",
    "study in USA success stories",
    "Canada study visa approval stories",
    "UK student visa success",
    "Australia PR pathway success",
    "Germany study abroad success",
    "scholarship success stories",
    "best study abroad consultant Hyderabad",
    "real student testimonials study abroad",
  ],
  openGraph: {
    title:
      "Real Success Stories | 500+ Students Placed Abroad – Khizar Overseas",
    description:
      "See how Indian students achieved their dreams: visa approvals, scholarships, admissions to top universities in USA, UK, Canada, Australia & more with expert guidance from Khizar Overseas.",
    url: "https://www.khizaroverseas.in/success-stories",
    type: "website",
    images: [
      {
        url: "/images/success-stories-og.jpg",
        width: 1200,
        height: 630,
        alt: "Khizar Overseas student success stories and visa approvals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Success Stories | Khizar Overseas – Visa & Scholarship Wins",
    description:
      "Inspiring real stories: 500+ visa approvals, scholarships & top university admits by Khizar Overseas.",
    images: ["/images/success-stories-twitter.jpg"], // ← your Twitter card image
  },
};
export const revalidate = 60; // ISR (best for testimonials)

export default async function SuccessStories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonials`,
    {
      next: { revalidate: 60 },
    },
  );

  const data = await res.json();
  const stories = data.success ? data.data : [];
  const heroData = stories[0];

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">
      {/* HERO */}
      <section className="relative py-28 border-b border-white/10 overflow-hidden">
        {/* 🔵 Center Glow Effect */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />

          {/* Main Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)]" />
        </div>
        <FadeUp className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {heroData?.pageTitle?.split(".")[0]}.
            <br />
            <span className="text-indigo-400">
              {heroData?.pageTitle?.split(".")[1]?.trim()}.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            {heroData?.pageSubtitle}
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat
              value={`${heroData?.studentsPlaced}+`}
              label="Students Placed"
            />
            <Stat
              value={`${heroData?.visaSuccessRate}%`}
              label="Visa Success Rate"
            />
            <Stat
              value={`${heroData?.partnerUniversities}+`}
              label="Partner Universities"
            />
            <Stat
              value={`$${heroData?.scholarshipsSecured}M+`}
              label="Scholarships Secured"
            />
          </div>
        </FadeUp>
      </section>

      {/* STORIES GRID */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Student Success Highlights
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <StudentStoryCard key={story._id} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your Success Story Could Be Next
          </h2>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 transition px-10 py-5 text-lg font-semibold"
          >
            Get Free Assessment
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 py-6">
      <p className="text-3xl font-bold text-indigo-400">{value}</p>
      <p className="mt-2 text-sm text-gray-400">{label}</p>
    </div>
  );
}
