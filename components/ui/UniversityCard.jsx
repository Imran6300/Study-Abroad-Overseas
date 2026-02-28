"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  hover: {
    y: -8,
    scale: 1.025,
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 22,
    },
  },
};

const UniversityCard = memo(function UniversityCard({
  uni,
  index,
  mounted,
  shouldReduceMotion,
}) {
  return (
    <motion.div
      layout
      custom={index}
      variants={cardVariants}
      initial={mounted && !shouldReduceMotion ? "hidden" : false}
      animate="visible"
      whileHover={shouldReduceMotion ? undefined : "hover"}
      transition={{ layout: { duration: 0.32, ease: "easeOut" } }}
      className="will-change-transform"
    >
      <Link
        href={`/universities/${uni.slug}`}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
      >
        <div className="relative h-52 sm:h-56 overflow-hidden">
          <Image
            src={
              uni.images?.[0]?.url ||
              uni.logo?.url ||
              "/university-placeholder.jpg"
            }
            alt={uni.name || "University"}
            fill
            priority={index < 6}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow"
          >
            #{uni.qsRanking || "—"}
          </motion.div>

          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4">
            <div className="bg-white/90 backdrop-blur rounded-xl p-2.5 shadow flex-shrink-0">
              <Image
                src={uni.logo?.url || "/logo-placeholder.png"}
                alt={`${uni.name} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <h3 className="font-bold text-lg leading-tight drop-shadow-md">
                {uni.name}
              </h3>
              <p className="text-sm text-white/85 mt-0.5">
                {uni.city && uni.country
                  ? `${uni.city}, ${uni.country}`
                  : uni.country || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <p className="text-gray-600 text-sm line-clamp-3 mb-6">
            {uni.description || uni.desc || "No description available."}
          </p>

          <div className="mt-auto space-y-5">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>
                🎓 {uni.totalStudents?.toLocaleString() || "—"} students
              </span>
              <span>
                📊 {uni.acceptanceRate ? `${uni.acceptanceRate}%` : "—"}{" "}
                acceptance
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <span className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                Explore University
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    repeatDelay: 1.8,
                  }}
                >
                  →
                </motion.span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default UniversityCard;
