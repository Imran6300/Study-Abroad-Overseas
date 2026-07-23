"use client";

// app/(site)/programs/cost-of-living/CostOfLivingCalculatorClient.jsx
//
// Interactive part of item #13. Receives the full curated dataset as a
// prop from page.jsx (already fetched server-side) — no client-side
// fetch, no loading spinner needed. Selecting a country or budget tier
// is pure local state; the numbers are looked up instantly from the
// dataset already in memory.

import { useState, useMemo } from "react";
import { Home, UtensilsCrossed, Bus, Info } from "lucide-react";

const TIERS = [
  {
    key: "budget",
    label: "Budget",
    hint: "Shared room, home cooking, public transit",
  },
  {
    key: "mid",
    label: "Mid-range",
    hint: "Typical international-student lifestyle",
  },
  {
    key: "comfortable",
    label: "Comfortable",
    hint: "Private studio, more dining out",
  },
];

function formatUsd(n) {
  return `$${n.toLocaleString("en-US")}`;
}

export default function CostOfLivingCalculatorClient({
  countries = [],
  source,
}) {
  const [selectedSlug, setSelectedSlug] = useState(countries[0]?.slug || "");
  const [tier, setTier] = useState("mid");

  const selectedCountry = useMemo(
    () => countries.find((c) => c.slug === selectedSlug) || countries[0],
    [countries, selectedSlug],
  );

  const tierData = selectedCountry?.tiers?.[tier];

  return (
    <div className="rounded-3xl border border-white/10 bg-[#020617]/70 p-6 sm:p-8">
      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            htmlFor="col-country"
            className="block text-sm font-semibold mb-2 opacity-80"
          >
            Destination country
          </label>
          <select
            id="col-country"
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full rounded-xl bg-[#0F172A] border border-white/15 px-4 py-3 text-white font-medium focus:outline-none focus:border-[#F59E0B] transition-colors"
          >
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-sm font-semibold mb-2 opacity-80">
            Budget style
          </span>
          <div className="grid grid-cols-3 gap-2">
            {TIERS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTier(t.key)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold border transition-colors ${
                  tier === t.key
                    ? "bg-[#F59E0B] text-[#0F172A] border-[#F59E0B]"
                    : "bg-transparent text-[#E5E7EB] border-white/15 hover:border-white/35"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tierData && (
        <>
          {/* Total */}
          <div className="text-center mb-8">
            <p className="text-sm opacity-70 mb-1">
              Estimated monthly total in {selectedCountry.country}
            </p>
            <p className="text-4xl sm:text-5xl font-black text-white">
              {formatUsd(tierData.total)}
              <span className="text-lg font-medium opacity-60"> / month</span>
            </p>
            <p className="text-xs opacity-60 mt-1">
              {TIERS.find((t) => t.key === tier)?.hint}
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 flex items-center gap-4">
              <Home size={22} className="text-[#F59E0B] shrink-0" />
              <div>
                <p className="text-xs opacity-60">Rent</p>
                <p className="text-xl font-bold text-white">
                  {formatUsd(tierData.rent)}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 flex items-center gap-4">
              <UtensilsCrossed size={22} className="text-[#F59E0B] shrink-0" />
              <div>
                <p className="text-xs opacity-60">Food</p>
                <p className="text-xl font-bold text-white">
                  {formatUsd(tierData.food)}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 flex items-center gap-4">
              <Bus size={22} className="text-[#F59E0B] shrink-0" />
              <div>
                <p className="text-xs opacity-60">Transport</p>
                <p className="text-xl font-bold text-white">
                  {formatUsd(tierData.transport)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Disclosure — same "estimated, not exact" discipline as the
          tuitionFee "Estimated" badge on the rankings page. Don't remove
          this without a good reason; it's load-bearing for trust. */}
      <div className="flex items-start gap-2 mt-8 pt-6 border-t border-white/10 text-xs opacity-60">
        <Info size={14} className="shrink-0 mt-0.5" />
        <p>
          These are planning estimates only, not guaranteed figures — actual
          costs vary by city, lifestyle, and exchange rates. Baseline data:{" "}
          {source?.name || "public cost-of-living indices"}, adapted for typical
          student budgets.
        </p>
      </div>
    </div>
  );
}
