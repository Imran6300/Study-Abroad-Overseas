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
    <motion.div variants={cardVariants} whileHover="hover" className="h-full">
      <Link href={`/courses/${course.slug}`} className="block h-full group">
        <div className="relative h-full rounded-3xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-500 hover:border-transparent hover:shadow-2xl group-hover:bg-white/8">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500" />

          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md">
            {course.field} • {course.level}
          </span>

          <h3 className="mt-6 text-2xl font-bold group-hover:text-indigo-300 transition-colors">
            {course.title}
          </h3>

          <p className="mt-3 text-gray-400 leading-relaxed">
            {course.topUniversities?.join(", ")}
          </p>

          <div className="mt-10 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {course.duration} • ${course.fees}/year
            </span>

            <span className="text-indigo-400 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
              Explore <span>→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
