import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
export default function SavedUniversities() {
  return (
    <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-10 sm:mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/6 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3">
          <span className="text-[#32CD32]">🏛️</span> Saved Universities
        </h2>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          No universities saved yet — start exploring!
        </p>
        <MotionLink
          href="/programs/universities"
          className="text-[#32CD32] font-bold hover:underline text-base sm:text-lg flex items-center gap-2"
        >
          Browse Now <span>→</span>
        </MotionLink>
      </motion.div>
      {/* Visa Progress */}
    </div>
  );
}
