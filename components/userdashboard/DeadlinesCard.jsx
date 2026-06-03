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
      style={{
        backgroundColor: "var(--brand-bg)",
        borderColor: "var(--brand-primary)",
      }}
      className="
backdrop-blur-xl
rounded-2xl
sm:rounded-3xl
p-5
sm:p-8
mb-10
sm:mb-12
border
shadow-xl
"
    >
      <h2
        style={{ color: "var(--brand-accent)" }}
        className="text-xl sm:text-2xl font-bold  mb-5 flex items-center gap-3"
      >
        <span
          style={{
            color: "var(--brand-primary)",
          }}
          className=" text-2xl"
        >
          ⏰
        </span>{" "}
        Urgent Deadlines
      </h2>
      {!upcomingDeadlines.length ? (
        <div
          className="text-center py-8"
          style={{
            color: "var(--brand-accent)",
            opacity: 0.7,
          }}
        >
          No urgent deadlines 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingDeadlines.map((item) => (
            <div
              key={item._id}
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "var(--brand-primary)",
              }}
              className="
flex flex-col sm:flex-row sm:items-center justify-between
gap-3 p-4 rounded-xl border transition-all
"
            >
              <div>
                <h4
                  style={{
                    color: "var(--brand-accent)",
                  }}
                  className="font-semibold text-base sm:text-lg"
                >
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  {new Date(item.dueDate).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`font-bold text-base sm:text-lg ${getDaysLeftColor(item.daysLeft)}`}
              >
                {item.daysLeft} days left
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
