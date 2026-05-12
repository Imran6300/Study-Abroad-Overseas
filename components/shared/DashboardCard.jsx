"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  onClick,
  isLoading = false,
}) {
  const showTrend = trend !== undefined;

  const isPositive = trend?.startsWith("+") || trend === "0%";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onClick={onClick}
      className="
        relative overflow-hidden
        rounded-2xl
        bg-gradient-to-br
        from-[#0b1220]
        via-[#0d1629]
        to-[#0f1a36]
        border border-sky-500/15
        p-6
        shadow-xl shadow-black/40
        group
      "
    >
      {/* Glow */}
      <div
        className="
          absolute inset-0 opacity-0
          group-hover:opacity-70
          bg-gradient-to-br
          from-sky-600/10
          via-cyan-500/5
          to-transparent
          transition-opacity duration-700
        "
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <p className="text-slate-400 text-sm font-medium">{title}</p>

          {icon && <div className="opacity-80">{icon}</div>}
        </div>

        {/* Value */}
        {isLoading ? (
          <div className="h-10 w-24 bg-slate-700 rounded animate-pulse" />
        ) : (
          <h2 className="text-4xl font-bold text-white">{value}</h2>
        )}

        {/* Subtitle */}
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}

        {/* Trend */}
        {showTrend && (
          <div className="flex items-center gap-1.5 mt-3">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-400" />
            )}

            <span
              className={`text-sm font-medium ${
                isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {trend}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
