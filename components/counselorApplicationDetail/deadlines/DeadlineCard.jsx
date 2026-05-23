import { motion } from "framer-motion";
import { Calendar, Trash2 } from "lucide-react";

const deadlinePriorityConfig = {
  urgent: {
    label: "Urgent",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  high: {
    label: "High",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
  medium: {
    label: "Medium",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  low: {
    label: "Low",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
  },
};

export default function DeadlineCard({
  deadline,
  toggleComplete,
  removeDeadline,
}) {
  const getDaysLeft = (dueDate) => {
    const today = new Date();

    const due = new Date(dueDate);

    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    return diff;
  };

  const pc = deadlinePriorityConfig[deadline.priority];

  const daysLeft = getDaysLeft(deadline.dueDate);

  return (
    <motion.div
      layout
      className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all"
    >
      <button
        onClick={() => toggleComplete(deadline._id)}
        className="mt-0.5 w-5 h-5 rounded-md border-2 border-slate-300 hover:border-indigo-400 flex items-center justify-center transition-all shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-800">
            {deadline.title}
          </p>

          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${pc.bg} ${pc.text} ${pc.border}`}
          >
            {pc.label}
          </span>
        </div>

        {deadline.description && (
          <p className="text-xs text-slate-500 mt-0.5">
            {deadline.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />

            {new Date(deadline.dueDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>

          <span
            className={`text-xs font-semibold ${
              daysLeft < 0
                ? "text-red-500"
                : daysLeft <= 7
                  ? "text-amber-500"
                  : "text-emerald-600"
            }`}
          >
            {daysLeft < 0
              ? `${Math.abs(daysLeft)}d overdue`
              : daysLeft === 0
                ? "Due today"
                : `${daysLeft}d left`}
          </span>
        </div>
      </div>

      <button
        onClick={() => removeDeadline(deadline._id)}
        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center"
      >
        <Trash2 size={13} className="text-slate-400 hover:text-red-500" />
      </button>
    </motion.div>
  );
}
