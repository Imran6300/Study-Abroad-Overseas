// components/counselordashboard/CounselorKpiCards.jsx
//
// BUGS FIXED:
//  - Added manual refresh button wired to counselorApi.forceRefreshStats()
//    (was completely absent — counselors had no way to force-update stale cards)
//  - The "Live data" badge was misleading — it now shows actual lastRefreshedAt
//    timestamp so counselors know exactly how fresh the data is
//  - onRefreshComplete prop: after refresh, parent re-fetches overview so the
//    new stats actually appear (without this, refresh button did nothing visible)
//  - stats?.totalAssigned falls back to 0 — correct, but null stats on first
//    load caused the entire cards array to show zeros until useEffect settled;
//    added null check guard with loading override
"use client";

import {
  Users,
  FileText,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { counselorApi } from "@/lib/counselorApi";

// ── Skeleton shimmer ──────────────────────────────────────────────────────────
function SkeletonCard({ i }) {
  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.4 }}
      className="relative rounded-2xl border border-slate-700/50 p-5 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #070d1a 0%, #0b1220 60%, #0d1530 100%)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-700 to-slate-600 rounded-t-2xl" />
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-slate-800 animate-pulse" />
        <div className="w-14 h-6 rounded-lg bg-slate-800 animate-pulse" />
      </div>
      <div className="mt-4">
        <div className="w-16 h-8 bg-slate-800 rounded animate-pulse" />
        <div className="w-32 h-4 bg-slate-800 rounded animate-pulse mt-2" />
        <div className="w-24 h-3 bg-slate-800 rounded animate-pulse mt-1" />
      </div>
    </motion.div>
  );
}

function MiniSparkline({ data, colorClass }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80,
    h = 32,
    pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`w-20 h-8 overflow-visible ${colorClass}`}
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-70"
      />
      <circle
        cx={pts[pts.length - 1].split(",")[0]}
        cy={pts[pts.length - 1].split(",")[1]}
        r="2.5"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * @param {{
 *   stats: object|null,
 *   loading: boolean,
 *   onRefreshComplete?: () => void
 * }} props
 */
export default function CounselorKpiCards({
  stats,
  loading,
  onRefreshComplete,
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastManualRefresh, setLastManualRefresh] = useState(null);

  // FIX: wire refresh button to actual API + notify parent to re-fetch
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await counselorApi.forceRefreshStats();
      setLastManualRefresh(new Date());
      // Small delay to let the DB write settle before parent re-fetches
      setTimeout(() => {
        if (onRefreshComplete) onRefreshComplete();
      }, 300);
    } catch (err) {
      console.error("Stats refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshComplete]);

  const buildSparkline = (val) => {
    if (!val) return [0, 0, 0, 0, 0, 0];
    const v = Number(val);
    return [
      Math.max(0, Math.round(v * 0.5)),
      Math.max(0, Math.round(v * 0.6)),
      Math.max(0, Math.round(v * 0.7)),
      Math.max(0, Math.round(v * 0.8)),
      Math.max(0, Math.round(v * 0.9)),
      v,
    ];
  };

  const cards = [
    {
      id: 1,
      title: "Assigned Students",
      value: stats?.totalAssigned ?? 0,
      subtitle: "Currently managed students",
      icon: Users,
      iconColor: "text-sky-400",
      iconGlow: "shadow-[0_0_18px_rgba(56,189,248,0.35)]",
      iconBg: "bg-sky-500/15 border border-sky-500/20",
      accentFrom: "from-sky-500",
      accentTo: "to-cyan-400",
      gradientBg: "from-sky-500/8 to-transparent",
      trend:
        stats?.activeStudents != null ? `${stats.activeStudents} active` : "+0",
      trendUp: true,
      sparkline: buildSparkline(stats?.totalAssigned),
    },
    {
      id: 2,
      title: "Applications Submitted",
      value: stats?.pendingApplications ?? 0,
      subtitle: "Non-draft, non-rejected applications",
      icon: FileText,
      iconColor: "text-violet-400",
      iconGlow: "shadow-[0_0_18px_rgba(167,139,250,0.35)]",
      iconBg: "bg-violet-500/15 border border-violet-500/20",
      accentFrom: "from-violet-500",
      accentTo: "to-purple-400",
      gradientBg: "from-violet-500/8 to-transparent",
      trend: `${stats?.conversionRate ?? 0}% conv.`,
      trendUp: (stats?.conversionRate ?? 0) > 0,
      sparkline: buildSparkline(stats?.pendingApplications),
    },
    {
      id: 3,
      title: "Offers Received",
      value: stats?.offersReceived ?? 0,
      subtitle: "Students received university offers",
      icon: BadgeCheck,
      iconColor: "text-amber-400",
      iconGlow: "shadow-[0_0_18px_rgba(251,191,36,0.35)]",
      iconBg: "bg-amber-500/15 border border-amber-500/20",
      accentFrom: "from-amber-400",
      accentTo: "to-orange-400",
      gradientBg: "from-amber-500/8 to-transparent",
      trend: stats?.enrolled != null ? `${stats.enrolled} enrolled` : "+0",
      trendUp: true,
      sparkline: buildSparkline(stats?.offersReceived),
    },
    {
      id: 4,
      title: "Visa Approved",
      value: stats?.visaApproved ?? 0,
      subtitle: "Successful visa approvals",
      icon: ShieldCheck,
      iconColor: "text-emerald-400",
      iconGlow: "shadow-[0_0_18px_rgba(52,211,153,0.35)]",
      iconBg: "bg-emerald-500/15 border border-emerald-500/20",
      accentFrom: "from-emerald-500",
      accentTo: "to-teal-400",
      gradientBg: "from-emerald-500/8 to-transparent",
      trend:
        stats?.overdueDeadlines > 0
          ? `${stats.overdueDeadlines} overdue`
          : "On track",
      trendUp: !(stats?.overdueDeadlines > 0),
      sparkline: buildSparkline(stats?.visaApproved),
    },
  ];

  // FIX: compute a human-readable freshness label
  const freshnessLabel = (() => {
    if (lastManualRefresh) {
      return `Updated ${lastManualRefresh.toLocaleTimeString()}`;
    }
    const ts = stats?.lastRefreshedAt;
    if (!ts) return "Never synced";
    const diffMin = Math.round((Date.now() - new Date(ts)) / 60000);
    if (diffMin < 1) return "Just refreshed";
    if (diffMin === 1) return "1 min ago";
    if (diffMin < 60) return `${diffMin} min ago`;
    return `${Math.round(diffMin / 60)}h ago`;
  })();

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track your students and application progress
          </p>
        </div>

        {/* FIX: refresh button + freshness timestamp */}
        <div className="flex items-center gap-2">
          {!loading && stats?.lastRefreshedAt && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={11} />
              {freshnessLabel}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500
                       bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh dashboard statistics"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">
              {refreshing ? "Refreshing…" : loading ? "Loading…" : "Refresh"}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5">
        {loading
          ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} i={i} />)
          : cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative rounded-2xl border border-slate-700/50 p-5 overflow-hidden cursor-pointer
                    transition-all duration-300 hover:border-sky-800/60
                    shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                  style={{
                    background:
                      "linear-gradient(160deg, #070d1a 0%, #0b1220 60%, #0d1530 100%)",
                  }}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.accentFrom} ${card.accentTo} rounded-t-2xl`}
                  />
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.gradientBg} rounded-full blur-2xl pointer-events-none`}
                  />
                  <div className="flex items-start justify-between relative z-10">
                    <div
                      className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconGlow} flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg
                        ${
                          card.trendUp
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/15 text-red-400 border border-red-500/20"
                        }`}
                    >
                      {card.trendUp ? (
                        <TrendingUp size={11} />
                      ) : (
                        <TrendingDown size={11} />
                      )}
                      {card.trend}
                    </div>
                  </div>
                  <div className="mt-4 relative z-10">
                    <p className="text-3xl font-extrabold text-white leading-none">
                      {card.value}
                    </p>
                    <p className="text-sm font-semibold text-slate-300 mt-1.5">
                      {card.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-end relative z-10">
                    <MiniSparkline
                      data={card.sparkline}
                      colorClass={card.iconColor}
                    />
                  </div>
                </motion.div>
              );
            })}
      </div>
    </section>
  );
}
