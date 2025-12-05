"use client";

import { motion } from "framer-motion";

export default function ServicesCard({ Data }) {
  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-2 
        gap-10 max-w-[1200px] mx-auto 
        px-6
      "
    >
      {Data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
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
              items-center text-center

              min-h-[430px]   /* 🔥 FIXED CARD HEIGHT */
              h-full          /* ensures equal height */
            "
          >
            {/* Icon */}
            <div
              className="
                w-16 h-16 mx-auto mb-5 rounded-full 
                bg-gradient-to-br from-[#60A5FA] to-[#A78BFA]
                flex items-center justify-center text-white 
                text-3xl shadow-lg
              "
            >
              ⭐
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-2">{item.Title}</h3>

            {/* Subtitle */}
            <h4 className="text-lg font-medium text-gray-300 mb-4">
              {item.SubHeading}
            </h4>

            {/* Description — grows but doesn’t break layout */}
            <p
              className="
                text-gray-300 text-sm leading-6 mb-6 
                flex-grow   /* 🔥 pushes button to bottom */
              "
            >
              {item.Description}
            </p>

            {/* Button — always aligned at bottom */}
            <button
              className="
                px-6 py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-[#60A5FA] to-[#A78BFA]
                shadow-lg
                transition-all duration-200
                hover:scale-105 hover:shadow-xl
                active:scale-95
                mt-auto   /* 🔥 ensures bottom alignment */
              "
            >
              {item.BtnTitle}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
