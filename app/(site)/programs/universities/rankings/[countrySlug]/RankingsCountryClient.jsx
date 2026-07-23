// Server-rendered (no "use client" — nothing interactive beyond plain
// <Link>s), same discipline as ScholarshipCountryClient.jsx /
// VisaGuideCountryClient.jsx.
//
// IMPORTANT: `cheapest[].fee` comes from feeParser.js parsing a free-text
// field. This component deliberately shows the raw source string next
// to the parsed figure and badges "(estimated)" entries distinctly —
// see feeParser.js for why that matters. Don't remove that without
// re-reading the caveat there; presenting a parsed/estimated number as
// if it were an authoritative fee is a real "student makes a financial
// decision based on this" risk, not a cosmetic one.

import Link from "next/link";
import Image from "next/image";
import { Trophy, Wallet, ArrowRight, Info } from "lucide-react";

export default function RankingsCountryClient({ country, topRanked, cheapest }) {
  const { name, slug, flagImage } = country;

  return (
    <main className="bg-[#0F172A] text-[#E5E7EB] font-sans">
      {/* Hero */}
      <section className="relative px-5 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <nav className="text-xs sm:text-sm opacity-70 mb-6 flex gap-2 flex-wrap">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/programs/universities/rankings"
            className="hover:underline"
          >
            Rankings
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
            Top &amp; Most Affordable Universities in {name}
          </h1>
        </div>

        <p className="text-base sm:text-lg opacity-90 max-w-2xl mb-8">
          QS-ranked and budget-friendly universities in {name}, side by
          side. Talk to Khizar Overseas for a shortlist matched to your
          budget and profile.
        </p>

        <Link
          href="/assessment"
          className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-black rounded-2xl font-semibold text-sm sm:text-base hover:scale-[1.02] transition-transform w-fit"
        >
          Get My University Shortlist
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Top ranked */}
      {topRanked.length > 0 && (
        <section className="px-5 sm:px-6 py-12 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="text-[#F59E0B]" />
            Top-Ranked Universities in {name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {topRanked.map((uni, i) => (
              <Link
                key={uni._id || uni.slug}
                href={`/programs/universities/${uni.slug}`}
                className="rounded-2xl border border-white/10 bg-[#020617]/70 p-5 flex gap-4 hover:border-white/30 transition-colors"
              >
                <span className="text-2xl font-black text-white/30 w-8 shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-white">{uni.name}</p>
                  {uni.city && (
                    <p className="text-xs opacity-70 mt-1">{uni.city}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    QS Rank #{uni.qsRanking}
                    {typeof uni.acceptanceRate === "number" &&
                      ` · ${uni.acceptanceRate}% acceptance rate`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cheapest */}
      {cheapest.length > 0 && (
        <section className="px-5 sm:px-6 py-12 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-2">
            <Wallet className="text-[#10B981]" />
            Most Affordable Universities in {name}
          </h2>
          <p className="flex items-start gap-2 text-xs opacity-60 mb-6 max-w-2xl">
            <Info size={14} className="shrink-0 mt-0.5" />
            Fees are as published by each university, or estimated where
            not publicly disclosed (marked below). Currency and
            program/year basis can vary — confirm the exact figure with
            us or the university before applying.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {cheapest.map((uni) => (
              <Link
                key={uni._id || uni.slug}
                href={`/programs/universities/${uni.slug}`}
                className="rounded-2xl border border-white/10 bg-[#020617]/70 p-5 hover:border-white/30 transition-colors"
              >
                <p className="font-semibold text-white">{uni.name}</p>
                {uni.city && (
                  <p className="text-xs opacity-70 mt-1">{uni.city}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-semibold text-emerald-400">
                    {uni.tuitionFee}
                  </span>
                  {uni.fee?.estimated && (
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      Estimated
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="px-5 sm:px-6 py-16 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
          Which of these actually fits your profile?
        </h2>
        <p className="opacity-80 mb-8">
          Free shortlist based on your budget, grades and target intake
          for {name}.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:scale-[1.03] transition-transform"
        >
          Start Free Shortlist
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
