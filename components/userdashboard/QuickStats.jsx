import { motion } from "framer-motion";

export default function QuickStats({
  applications,
  shortlistedCount,
  upcomingDeadlines,
  visaStatus,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12"
    >
      {[
        { title: "Applications", value: applications || 0, emoji: "🎓" },
        { title: "Shortlisted", value: shortlistedCount, emoji: "⭐" },
        {
          title: "Deadlines",
          value: upcomingDeadlines.length,
          emoji: "⏰",
        },
        {
          title: "Visa",
          value: visaStatus || "Not Started",
          emoji: "🛂",
        },
      ].map((stat, i) => (
        <motion.div
          key={stat.title}
          whileHover={{ y: -6 }}
          className="bg-white/6 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-white/10 hover:border-[#32CD32]/30 transition-all shadow-md flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]"
        >
          <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 flex-shrink-0">
            {stat.emoji}
          </div>

          <p className="text-xs sm:text-sm text-gray-400 mb-1 whitespace-nowrap">
            {stat.title}
          </p>

          <p className="text-2xl sm:text-3xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
            {stat.value}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
