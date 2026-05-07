"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

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
  const backgroundStyles =
    variant === "light"
      ? "bg-white/5 backdrop-blur-sm border border-white/10"
      : "bg-gradient-to-b from-[#0B0F19] to-[#0a0f1f] border border-white/10";

  return (
    <Link href={`${hrefPrefix}/${slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        whileHover={{ y: -12, scale: 1.03 }}
        className={`${backgroundStyles} rounded-3xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-shadow flex flex-col`}
      >
        <div className="relative h-52 overflow-hidden">
          <Image
            src={image || "/country-placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {flag && (
            <div className="absolute top-4 left-4">
              <img
                src={flag}
                alt={`${title} flag`}
                className="w-10 h-6 object-cover rounded shadow-md"
              />
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-2xl font-bold">{title}</h3>

          {capital && (
            <p className="mt-2 text-gray-400 text-base">Capital: {capital}</p>
          )}

          {typeof visaSuccessRate === "number" && (
            <p className="mt-1 text-sm text-cyan-400 font-medium">
              Visa Success Rate: {visaSuccessRate}%
              {visaSuccessRateEstimated ? " est." : ""}
            </p>
          )}

          <div className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 text-[#38BDF8] font-semibold group-hover:text-cyan-300 transition">
              {buttonText} <ArrowRight size={18} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

export default CountryCard;
