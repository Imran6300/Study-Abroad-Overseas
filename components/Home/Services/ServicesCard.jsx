"use client";

import { motion } from "framer-motion";

export default function ServicesCard({ Data }) {
  return (
    <div
      className="
    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
    gap-8 max-w-[1200px] mx-auto
    px-6
  "
    >
      {Data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          viewport={{ once: true }}
        >
          <div
            className="
    bg-white/10 backdrop-blur-xl
    border border-white/20
    rounded-2xl p-6
    shadow-[0_6px_20px_rgba(0,0,0,0.25)]
    hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
    hover:-translate-y-1.5
    transition-all duration-300
    flex flex-col
    min-h-[420px] sm:min-h-[440px] md:h-[440px]
  "
          >
            {/* Icon */}
            <div
              className="
            w-14 h-14 mx-auto mb-5 rounded-full
            bg-gradient-to-br from-[#60A5FA] to-[#A78BFA]
            flex items-center justify-center
            text-white text-2xl shadow-md
          "
            >
              {item.Icon || "⭐"}
            </div>

            <h3 className="text-xl font-bold text-white mb-2 text-center">
              {item.Title}
            </h3>

            {item.SubHeading && (
              <h4 className="text-sm font-medium text-gray-300 mb-3 text-center">
                {item.SubHeading}
              </h4>
            )}

            <p className="text-gray-300 text-sm leading-relaxed mb-5 flex-grow text-center">
              {item.Description}
            </p>

            <button
              className="
            mt-auto mx-auto
            px-5 py-2.5 rounded-lg
            text-sm font-semibold text-white
            bg-gradient-to-r from-[#60A5FA] to-[#A78BFA]
            shadow-md
            hover:scale-105
            transition
          "
            >
              {item.BtnTitle || "Learn More"}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
