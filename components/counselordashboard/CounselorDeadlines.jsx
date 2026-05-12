"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const pipeline = [
  {
    label: "Leads",
    value: 120,
    color: "from-sky-500 to-cyan-400",
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  {
    label: "Contacted",
    value: 92,
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    label: "Counseled",
    value: 74,
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    label: "Applied",
    value: 48,
    color: "from-fuchsia-500 to-pink-500",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-600",
  },
  {
    label: "Offer",
    value: 26,
    color: "from-amber-400 to-orange-400",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    label: "Visa",
    value: 14,
    color: "from-emerald-500 to-green-400",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    label: "Enrolled",
    value: 7,
    color: "from-teal-500 to-emerald-400",
    bg: "bg-teal-50",
    text: "text-teal-600",
  },
];

const MAX = pipeline[0].value;

export default function CounselorPipeline() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Pipeline</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Full journey from lead to enrolled
          </p>
        </div>
        <span className="text-xs font-semibold bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg border border-sky-100">
          {pipeline[pipeline.length - 1].value} Enrolled
        </span>
      </div>

      {/* Funnel bar view */}
      <div className="space-y-3 mb-6">
        {pipeline.map((item, i) => {
          const pct = Math.round((item.value / MAX) * 100);
          const dropPct =
            i > 0
              ? Math.round(
                  ((pipeline[i - 1].value - item.value) /
                    pipeline[i - 1].value) *
                    100,
                )
              : null;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group"
            >
              <div className="flex items-center gap-3">
                <div className="w-20 text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-500">
                    {item.label}
                  </span>
                </div>
                <div className="flex-1 h-8 bg-slate-100 rounded-xl overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      delay: i * 0.07 + 0.2,
                      duration: 0.7,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className={`h-full bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-end pr-3`}
                  >
                    <span className="text-white text-xs font-bold">
                      {item.value}
                    </span>
                  </motion.div>
                </div>
                <div className="w-14 shrink-0 text-right">
                  {dropPct !== null ? (
                    <span className="text-[10px] font-semibold text-slate-400">
                      -{dropPct}%
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400">
                      base
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Card chips row */}
      <div className="flex gap-2 flex-wrap">
        {pipeline.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            whileHover={{ y: -2 }}
            className={`${item.bg} rounded-xl px-3 py-2 text-center min-w-[70px] cursor-pointer border border-white hover:shadow-sm transition-all duration-200`}
          >
            <p className={`text-lg font-extrabold ${item.text}`}>
              {item.value}
            </p>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
