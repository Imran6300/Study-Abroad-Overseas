import { motion } from "framer-motion";

export default function QuickStats({
  applications,
  shortlistedCount,
  upcomingDeadlines,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12"
    >
      {[
        { title: "Applications", value: applications.length, emoji: "🎓" },
        { title: "Shortlisted", value: shortlistedCount, emoji: "⭐" },
        {
          title: "Deadlines",
          value: upcomingDeadlines.length,
          emoji: "⏰",
        },
        { title: "Visa", value: "In Progress", emoji: "🛂" },
      ].map((stat, i) => (
        <motion.div
          key={stat.title}
          whileHover={{ y: -6 }}
          className="bg-white/6 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-white/10 hover:border-[#32CD32]/30 transition-all shadow-md"
        >
          <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{stat.emoji}</div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">{stat.title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {stat.value}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
