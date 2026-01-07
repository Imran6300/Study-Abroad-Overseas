"use client";

import { motion } from "framer-motion";

export default function ServicesCard({ Data }) {
  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
        gap-10 max-w-[1400px] mx-auto
        px-6
      "
    >
      {Data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div
            className="
              bg-white/10 backdrop-blur-xl
              border border-white/20
              rounded-2xl p-8
              shadow-[0_8px_25px_rgba(0,0,0,0.25)]
              hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)]
              hover:-translate-y-2 hover:border-white/40
              transition-all duration-300
              flex flex-col
              min-h-[430px]
              h-full
            "
          >
            {/* Icon */}
            <div
              className="
                w-16 h-16 mx-auto mb-6 rounded-full
                bg-gradient-to-br from-[#60A5FA] to-[#A78BFA]
                flex items-center justify-center text-white
                text-3xl shadow-lg
              "
            >
              {item.Icon || "⭐"}{" "}
              {/* Use dynamic icon if provided, fallback to star */}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-3 text-center">
              {item.Title}
            </h3>

            {/* Subtitle */}
            {item.SubHeading && (
              <h4 className="text-lg font-medium text-gray-300 mb-4 text-center">
                {item.SubHeading}
              </h4>
            )}

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow text-center">
              {item.Description}
            </p>

            {/* Button - pinned to bottom */}
            <button
              className="
                mt-auto mx-auto
                px-6 py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-[#60A5FA] to-[#A78BFA]
                shadow-lg
                transition-all duration-200
                hover:scale-105 hover:shadow-xl
                active:scale-95
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
