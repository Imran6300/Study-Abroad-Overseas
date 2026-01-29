"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react"; // ← optional: npm install lucide-react

export default function AdminCard({
  title,
  value,
  icon,               // can be emoji string or JSX <Icon />
  trend,              // string like "+18.2%" or "-3%"
  trendUpColor = "text-emerald-400",
  trendDownColor = "text-rose-400",
  subtitle,           // optional small text below value
  onClick,
  isLoading = false,
  className = "",
}) {
  const showTrend = trend !== undefined;
  const isPositive = trend?.startsWith("+") || trend === "0%";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${title}: ${value}`}
      className={`
        relative overflow-hidden
        rounded-2xl
        bg-gradient-to-br from-[#0b1220] via-[#0d1629] to-[#0f1a36]
        border border-sky-500/15
        p-6
        shadow-xl shadow-black/40
        group
        cursor-${onClick ? "pointer" : "default"}
        ${className}
      `}
    >
      {/* Subtle animated glow on hover */}
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-70
          bg-gradient-to-br from-sky-600/10 via-cyan-500/5 to-transparent
          transition-opacity duration-700 ease-out
          pointer-events-none
        "
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top row: title + icon */}
        <div className="flex items-start justify-between mb-4">
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            {title}
          </p>

          {icon && (
            <div className="text-4xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              {typeof icon === "string" ? icon : icon}
            </div>
          )}
        </div>

        {/* Main value area */}
        <div className="mt-auto">
          {isLoading ? (
            <div className="h-10 w-24 bg-slate-700/50 rounded animate-pulse" />
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
              {value}
            </h2>
          )}

          {subtitle && !isLoading && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}

          {/* Trend indicator */}
          {showTrend && !isLoading && (
            <div className="flex items-center gap-1.5 mt-2">
              {isPositive ? (
                <TrendingUp className={`h-4 w-4 ${trendUpColor}`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${trendDownColor}`} />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? trendUpColor : trendDownColor
                }`}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom shine line on hover */}
      <div
        className="
          absolute bottom-0 left-0 h-[3px] w-full
          bg-gradient-to-r from-transparent via-sky-400/70 to-transparent
          opacity-0 group-hover:opacity-100
          scale-x-0 group-hover:scale-x-100
          origin-center transition-all duration-500 ease-out
        "
      />
    </motion.div>
  );
}