import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
export default function RecommendedUniversities({ universities }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-10 sm:mb-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3 px-1">
        <span className="text-[#32CD32]">🔍</span> Recommended for You
      </h2>

      <div className="overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        <div className="flex gap-5 sm:grid sm:grid-cols-3 sm:gap-6 min-w-max sm:min-w-0">
          {universities.map((uni) => (
            <motion.div
              key={uni.id}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-indigo-950/50 to-[#0A192F] p-5 rounded-2xl border border-indigo-500/20 snap-start min-w-[280px] sm:min-w-0 flex-1 sm:flex-none text-center"
            >
              {uni.logo?.url && (
                <img
                  src={uni.logo.url}
                  alt={uni.name}
                  className="w-14 h-14 object-contain mx-auto mb-4"
                />
              )}
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                {uni.name}
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Recommended University
              </p>
              <div className="text-[#32CD32] font-bold text-lg">Explore →</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <MotionLink
          href="/programs/universities"
          className="text-[#32CD32] font-bold hover:underline text-base sm:text-lg"
        >
          See All Recommendations →
        </MotionLink>
      </div>
    </motion.div>
  );
}
