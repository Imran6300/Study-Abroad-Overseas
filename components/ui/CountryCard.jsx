"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CountryCard = memo(function CountryCard({
  title,
  slug,
  image,
  flag,
  capital,
  visaSuccessRate,
  visaSuccessRateEstimated,
  hrefPrefix = "/all-countries",
  buttonText = "Explore Programs",
  priority = false,
  variant = "default",
}) {
  const base =
    variant === "light"
      ? "bg-white/5 border-white/10"
      : "bg-[#0B0F1A] border-white/[0.08]";

  return (
    <Link href={`${hrefPrefix}/${slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -8 }}
        className={`
          relative flex flex-col h-[340px] rounded-[20px] overflow-hidden border
          ${base}
          transition-shadow duration-300
          hover:shadow-[0_20px_48px_rgba(34,211,238,0.12)]
        `}
      >
        {/* Top accent line — appears on hover */}
        <div
          className="
          absolute top-0 left-0 right-0 h-[2px] z-10
          bg-gradient-to-r from-transparent via-cyan-400 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        "
        />

        {/* Hero image — fixed height, never grows */}
        <div className="relative w-full h-40 flex-shrink-0 overflow-hidden">
          <Image
            src={image || "/country-placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />

          {/* Fade to card bg at bottom so text reads cleanly */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F1A]/80" />

          {/* Flag — bottom-left of image, inset with a soft ring */}
          {flag && (
            <div className="absolute bottom-2.5 left-3 z-50 bg-white rounded overflow-hidden">
              <img
                src={flag}
                alt={`${title} flag`}
                className="w-8 h-[22px] object-cover"
              />
            </div>
          )}
        </div>

        {/* Card body — flex-1 so it always fills the remaining space */}
        <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4 gap-1.5">
          {/* Country name */}
          <h3 className="text-[17px] font-bold text-white leading-tight truncate m-0">
            {title}
          </h3>

          {/* Capital */}
          {capital && (
            <p className="text-[12px] text-white/40 m-0">Capital: {capital}</p>
          )}

          {/* Divider */}
          <div className="h-px bg-white/[0.06] my-1" />

          {/* Visa badge pill */}
          {typeof visaSuccessRate === "number" && (
            <div
              className="
              inline-flex items-center gap-1.5 w-fit
              bg-cyan-400/[0.08] border border-cyan-400/20
              rounded-full px-2.5 py-[3px]
            "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-cyan-400 tracking-wide">
                {visaSuccessRate}% Visa Success Rate
                {visaSuccessRateEstimated ? " est." : ""}
              </span>
            </div>
          )}

          {/* Footer — pushed to bottom with mt-auto */}
          <div className="mt-auto flex items-center justify-between">
            <span className="text-[13px] font-semibold text-sky-400 group-hover:text-cyan-300 transition-colors">
              {buttonText}
            </span>

            {/* Circular arrow button */}
            <div
              className="
              w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0
              border border-sky-400/30
              group-hover:bg-sky-400/10 group-hover:border-sky-400/60
              transition-all duration-200
            "
            >
              <ArrowRight size={12} className="text-sky-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

export default CountryCard;
