import { motion } from "framer-motion";
export default function DeadlinesCard({ upcomingDeadlines }) {
  const getDaysLeftColor = (days) => {
    if (days <= 3) return "text-red-400";
    if (days <= 7) return "text-orange-400";
    return "text-gray-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-red-950/30 to-amber-950/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-10 sm:mb-12 border border-red-500/20 shadow-xl"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 flex items-center gap-3">
        <span className="text-red-400 text-2xl">⏰</span> Urgent Deadlines
      </h2>
      <div className="space-y-4">
        {upcomingDeadlines.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
          >
            <div>
              <h4 className="font-semibold text-white text-base sm:text-lg">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-400">{item.date}</p>
            </div>
            <span
              className={`font-bold text-base sm:text-lg ${getDaysLeftColor(item.daysLeft)}`}
            >
              {item.daysLeft} days left
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
