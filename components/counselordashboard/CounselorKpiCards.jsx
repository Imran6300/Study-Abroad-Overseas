"use client";

import {
  Users,
  FileText,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    id: 1,
    title: "Assigned Students",
    value: 42,
    subtitle: "Currently managed students",
    icon: Users,
    iconColor: "text-sky-400",
    iconGlow: "shadow-[0_0_18px_rgba(56,189,248,0.35)]",
    iconBg: "bg-sky-500/15 border border-sky-500/20",
    accentFrom: "from-sky-500",
    accentTo: "to-cyan-400",
    gradientBg: "from-sky-500/8 to-transparent",
    trend: "+12%",
    trendUp: true,
    sparkline: [20, 28, 25, 35, 30, 42],
  },
  {
    id: 2,
    title: "Applications Submitted",
    value: 18,
    subtitle: "Applications sent this month",
    icon: FileText,
    iconColor: "text-violet-400",
    iconGlow: "shadow-[0_0_18px_rgba(167,139,250,0.35)]",
    iconBg: "bg-violet-500/15 border border-violet-500/20",
    accentFrom: "from-violet-500",
    accentTo: "to-purple-400",
    gradientBg: "from-violet-500/8 to-transparent",
    trend: "+8%",
    trendUp: true,
    sparkline: [8, 10, 12, 14, 16, 18],
  },
  {
    id: 3,
    title: "Offers Received",
    value: 11,
    subtitle: "Students received offers",
    icon: BadgeCheck,
    iconColor: "text-amber-400",
    iconGlow: "shadow-[0_0_18px_rgba(251,191,36,0.35)]",
    iconBg: "bg-amber-500/15 border border-amber-500/20",
    accentFrom: "from-amber-400",
    accentTo: "to-orange-400",
    gradientBg: "from-amber-500/8 to-transparent",
    trend: "+5%",
    trendUp: true,
    sparkline: [6, 7, 8, 9, 10, 11],
  },
  {
    id: 4,
    title: "Visa Approved",
    value: 7,
    subtitle: "Successful visa approvals",
    icon: ShieldCheck,
    iconColor: "text-emerald-400",
    iconGlow: "shadow-[0_0_18px_rgba(52,211,153,0.35)]",
    iconBg: "bg-emerald-500/15 border border-emerald-500/20",
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-400",
    gradientBg: "from-emerald-500/8 to-transparent",
    trend: "+3%",
    trendUp: true,
    sparkline: [2, 3, 4, 5, 6, 7],
  },
];

function MiniSparkline({ data, colorClass }) {
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

export default function CounselorKpiCards() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track your students and application progress
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg hidden sm:block">
          Updated just now
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5">
        {cards.map((card, i) => {
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
              {/* Top accent gradient line */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.accentFrom} ${card.accentTo} rounded-t-2xl`}
              />

              {/* Subtle inner glow bg */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.gradientBg} rounded-full blur-2xl pointer-events-none`}
              />

              {/* Top row: icon + trend */}
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

              {/* Value + labels */}
              <div className="mt-4 relative z-10">
                <p className="text-3xl font-extrabold text-white leading-none">
                  {card.value}
                </p>
                <p className="text-sm font-semibold text-slate-300 mt-1.5">
                  {card.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{card.subtitle}</p>
              </div>

              {/* Sparkline */}
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
