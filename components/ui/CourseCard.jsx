"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -8, transition: { duration: 0.3 } },
};

export default function CourseCard({ course }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="h-full" // important for grid row stretching
    >
      <Link href={`/courses/${course.slug}`} className="block h-full group">
        <div
          className={`
            relative h-72
            rounded-3xl p-6                 
            bg-white/5 backdrop-blur-sm
            border border-white/10
            overflow-hidden
            transition-all duration-500
            hover:border-transparent hover:shadow-2xl group-hover:bg-white/8

            flex flex-col
          `}
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500" />

          {/* Badge - stays small */}
          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md shrink-0">
            {course.field} • {course.level}
          </span>

          {/* Title - limit to 2 lines max */}
          <h3 className="mt-4 text-xl font-bold group-hover:text-indigo-300 transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Universities - clamp to 2–3 lines + ellipsis on last line */}
          <p className="mt-2 text-gray-400 text-sm leading-relaxed line-clamp-3 overflow-hidden">
            {course.topUniversities
              ?.slice(0, 4) // show max 4
              ?.map((uni) => uni.name || uni.university || "—")
              .join(", ") || "Top institutions available"}
          </p>

          {/* Bottom row pushed to the end with mt-auto */}
          <div className="mt-auto pt-6 flex items-center justify-between text-sm shrink-0">
            <span className="text-gray-500">
              {course.duration} • ${course.fees}/year
            </span>

            <span className="text-indigo-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Explore <span>→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
