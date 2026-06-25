"use client";

import { memo } from "react";
import { motion } from "framer-motion";

function UserTypeCard({
  icon,
  eyebrow,
  headline,
  description,
  benefits,
  ctaLabel,
  ctaSubtext,
  accentFrom,
  accentTo,
  badgeLabel,
  badgeColor,
  onSelect,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.15 + index * 0.1,
        ease: "easeOut",
      }}
      className="group relative flex flex-col rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      aria-label={`I am a ${eyebrow}`}
    >
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
        }}
      />

      <div className="flex flex-col flex-1 p-6 sm:p-7">
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${accentFrom}18, ${accentTo}18)`,
            }}
          >
            {icon}
          </div>
          {badgeLabel && (
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${badgeColor}18`,
                color: badgeColor,
              }}
            >
              {badgeLabel}
            </span>
          )}
        </div>

        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1">
          {eyebrow}
        </p>

        <h3 className="text-[1.2rem] font-extrabold text-gray-900 leading-snug mb-2">
          {headline}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-5">
          {description}
        </p>

        <ul className="flex flex-col gap-2 mb-6">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2.5 text-sm text-gray-700"
            >
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                }}
              >
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="flex-1" />

        <button
          className="w-full py-3.5 rounded-xl font-semibold text-[0.95rem] text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          tabIndex={-1}
        >
          {ctaLabel}
        </button>

        {ctaSubtext && (
          <p className="text-center text-[11px] text-gray-400 mt-2.5">
            {ctaSubtext}
          </p>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${accentFrom}08 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

export default memo(UserTypeCard);
