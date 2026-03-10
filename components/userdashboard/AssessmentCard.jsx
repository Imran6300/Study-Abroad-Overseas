import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
export default function AssessmentCard({ hasAssessment }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="bg-white/6 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#32CD32]/30 transition-all shadow-md mb-10"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            📝 Study Abroad Assessment
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            {hasAssessment
              ? "You already submitted your assessment"
              : "Submit your assessment to get university recommendations"}
          </p>
        </div>

        {hasAssessment ? (
          <MotionLink
            href="/assessment"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#4169E1] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3258c9] transition"
          >
            Edit Assessment ✏️
          </MotionLink>
        ) : (
          <MotionLink
            href="/assessment"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#32CD32] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#28b428] transition"
          >
            Submit Assessment 🚀
          </MotionLink>
        )}
      </div>
    </motion.div>
  );
}
