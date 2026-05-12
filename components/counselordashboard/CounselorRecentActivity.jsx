"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const deadlines = [
  {
    id: 1,
    title: "University of Toronto — Application Deadline",
    student: "Ahmed Khan",
    country: "Canada",
    flag: "🇨🇦",
    daysLeft: 3,
    date: "May 15, 2026",
    urgent: true,
    status: "pending",
  },
  {
    id: 2,
    title: "UCL London — Document Submission",
    student: "Priya Sharma",
    country: "UK",
    flag: "🇬🇧",
    daysLeft: 8,
    date: "May 20, 2026",
    urgent: false,
    status: "in-progress",
  },
  {
    id: 3,
    title: "MIT — Visa Interview Preparation",
    student: "Ali Hassan",
    country: "USA",
    flag: "🇺🇸",
    daysLeft: 14,
    date: "May 26, 2026",
    urgent: false,
    status: "pending",
  },
  {
    id: 4,
    title: "Monash University — Fee Payment",
    student: "Fatima Noor",
    country: "Australia",
    flag: "🇦🇺",
    daysLeft: 21,
    date: "Jun 2, 2026",
    urgent: false,
    status: "pending",
  },
  {
    id: 5,
    title: "TU Munich — Language Test Submission",
    student: "Omar Sheikh",
    country: "Germany",
    flag: "🇩🇪",
    daysLeft: 0,
    date: "Today",
    urgent: true,
    status: "overdue",
  },
];

const statusMap = {
  pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  "in-progress": { icon: AlertCircle, color: "text-sky-500", bg: "bg-sky-50" },
  overdue: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
  done: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
};

function urgencyBar(days) {
  if (days === 0) return "bg-red-500";
  if (days <= 5) return "bg-red-400";
  if (days <= 10) return "bg-amber-400";
  return "bg-emerald-400";
}

export default function CounselorDeadlines() {
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

      <div className="space-y-3">
        {deadlines.map((d, i) => {
          const { icon: StatusIcon, color, bg } = statusMap[d.status];
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ x: 3 }}
              className={`relative flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 group
                ${d.urgent ? "border-red-100 bg-red-50/30 hover:bg-red-50/60" : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/60"}`}
            >
              {/* Urgency indicator */}
              <div
                className={`w-1 h-full absolute left-0 top-0 rounded-l-2xl ${urgencyBar(d.daysLeft)}`}
              />

              {/* Flag + status icon */}
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 text-lg`}
              >
                {d.flag}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                  {d.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-medium">
                    {d.student}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${color}`}
                  >
                    <StatusIcon size={11} />
                    {d.date}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                {d.daysLeft === 0 ? (
                  <span className="text-xs font-extrabold text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                    Due today
                  </span>
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
    </div>
  );
}
