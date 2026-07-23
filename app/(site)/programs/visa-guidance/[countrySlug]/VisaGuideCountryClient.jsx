// Server-rendered (no "use client" — nothing interactive beyond plain
// <Link>s), keeping first paint fully crawlable — same discipline as
// ScholarshipCountryClient.jsx.

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  FileCheck2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function VisaGuideCountryClient({ country }) {
  const {
    name,
    slug,
    eligibilityRequirements = [],
    topUniversities = [],
    flagImage,
    visaSuccessRate,
    visaSuccessRateEstimated,
  } = country;

  return (
    <main className="bg-[#0F172A] text-[#E5E7EB] font-sans">
      {/* Hero */}
      <section className="relative px-5 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <nav className="text-xs sm:text-sm opacity-70 mb-6 flex gap-2 flex-wrap">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/programs/visa-guidance" className="hover:underline">
            Visa Guidance
          </Link>
          <span>/</span>
          <span className="text-white">{name}</span>
        </nav>

        <div className="flex items-center gap-4 mb-6">
          {flagImage?.url && (
            <Image
              src={flagImage.url}
              alt={`${name} flag`}
              width={56}
              height={40}
              className="rounded-md object-cover"
            />
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            {name} Student Visa Guide
          </h1>
        </div>

        {typeof visaSuccessRate === "number" && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-emerald-500/40 bg-emerald-500/10 text-sm font-semibold text-emerald-300">
            <ShieldCheck size={16} />
            {visaSuccessRate}% visa success rate with Khizar Overseas
            {visaSuccessRateEstimated ? " (estimated)" : ""}
          </div>
        )}

        <p className="text-base sm:text-lg opacity-90 max-w-2xl mb-8">
          What it takes to get a student visa approved for {name} —
          eligibility, documentation and the mistakes that cause
          rejections. Get a free document check from Khizar Overseas
          before you apply.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-black rounded-2xl font-semibold text-sm sm:text-base hover:scale-[1.02] transition-transform"
          >
            Free Visa Eligibility Check
            <ArrowRight size={16} />
          </Link>
          <Link
            href={`/study-in-${slug}`}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-white/30 rounded-2xl font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors"
          >
            Full {name} Study Guide
          </Link>
        </div>
      </section>

      {/* Eligibility / requirements */}
      <section className="px-5 sm:px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <FileCheck2 className="text-[#3B82F6]" />
          Visa Eligibility &amp; Requirements
        </h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {eligibilityRequirements.map((requirement, i) => (
            <li
              key={i}
              className="rounded-2xl border border-white/10 bg-[#020617]/70 p-5 flex gap-3"
            >
              <CheckCircle2
                className="text-[#10B981] shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm sm:text-base opacity-90">
                {requirement}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top universities — internal linking into the University entity pages */}
      {topUniversities.length > 0 && (
        <section className="px-5 sm:px-6 py-12 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <GraduationCap className="text-[#F43F5E]" />
            Popular Universities in {name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topUniversities.map((uni) => (
              <Link
                key={uni._id || uni.slug}
                href={`/programs/universities/${uni.slug}`}
                className="rounded-2xl border border-white/10 bg-[#020617]/70 p-5 hover:border-white/30 transition-colors"
              >
                <p className="font-semibold text-white">{uni.name}</p>
                {uni.city && (
                  <p className="text-xs opacity-70 mt-1">{uni.city}</p>
                )}
                {uni.qsRanking && (
                  <p className="text-xs opacity-70 mt-1">
                    QS Rank #{uni.qsRanking}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="px-5 sm:px-6 py-16 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
          Want your {name} visa documents reviewed before you apply?
        </h2>
        <p className="opacity-80 mb-8">
          Free eligibility check — we flag the gaps that cause visa
          rejections before they cost you an intake.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:scale-[1.03] transition-transform"
        >
          Start Free Visa Check
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
