// components/counselordashboard/CounselorRecentActivity.jsx
"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const statusMap = {
  pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  in_progress: { icon: AlertCircle, color: "text-sky-500", bg: "bg-sky-50" },
  overdue: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
};

function urgencyBar(daysLeft) {
  if (daysLeft < 0) return "bg-red-500";
  if (daysLeft <= 5) return "bg-red-400";
  if (daysLeft <= 10) return "bg-amber-400";
  return "bg-emerald-400";
}

function countryFlag(country = "") {
  const flags = {
    canada: "🇨🇦",
    uk: "🇬🇧",
    usa: "🇺🇸",
    australia: "🇦🇺",
    germany: "🇩🇪",
    "new zealand": "🇳🇿",
    france: "🇫🇷",
    ireland: "🇮🇪",
    singapore: "🇸🇬",
  };
  return flags[country.toLowerCase()] || "🌍";
}

/**
 * @param {{ deadlines: Array, loading: boolean }} props
 * deadline shape (from /api/counselor/deadlines):
 *   { _id, title, category, dueDate, status, priority, student: { name, email } }
 */
export default function CounselorRecentActivity({
  deadlines = [],
  loading = false,
}) {
  const now = Date.now();

  const enriched = deadlines.slice(0, 6).map((d) => {
    const daysLeft = Math.ceil(
      (new Date(d.dueDate).getTime() - now) / (1000 * 60 * 60 * 24),
    );
    const status =
      daysLeft < 0 && d.status !== "completed"
        ? "overdue"
        : d.status || "pending";
    return { ...d, daysLeft, computedStatus: status };
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarClock size={20} className="text-sky-500" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Upcoming Deadlines
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Critical dates to track
            </p>
          </div>
        </div>
        <button className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors">
          Calendar view
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : enriched.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">
          No upcoming deadlines
        </div>
      ) : (
        <div className="space-y-3">
          {enriched.map((d, i) => {
            const {
              icon: StatusIcon,
              color,
              bg,
            } = statusMap[d.computedStatus] || statusMap.pending;
            const isUrgent = d.daysLeft <= 3 || d.computedStatus === "overdue";
            return (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 3 }}
                className={`relative flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 group
                  ${
                    isUrgent
                      ? "border-red-100 bg-red-50/30 hover:bg-red-50/60"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/60"
                  }`}
              >
                <div
                  className={`w-1 h-full absolute left-0 top-0 rounded-l-2xl ${urgencyBar(d.daysLeft)}`}
                />

                <div
                  className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 text-lg`}
                >
                  {countryFlag(d.student?.country || "")}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                    {d.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-medium">
                      {d.student?.name || "—"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold ${color}`}
                    >
                      <StatusIcon size={11} />
                      {new Date(d.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {d.daysLeft === 0 ? (
                    <span className="text-xs font-extrabold text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                      Due today
                    </span>
                  ) : d.daysLeft < 0 ? (
                    <div>
                      <p className="text-xl font-extrabold text-red-500">
                        {Math.abs(d.daysLeft)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        days overdue
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p
                        className={`text-xl font-extrabold ${d.daysLeft <= 5 ? "text-red-500" : d.daysLeft <= 10 ? "text-amber-500" : "text-slate-700"}`}
                      >
                        {d.daysLeft}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        days left
                      </p>
                    </div>
                  )}
                </div>

                <ChevronRight
                  size={14}
                  className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0"
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
