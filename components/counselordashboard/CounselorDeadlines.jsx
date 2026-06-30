// components/counselordashboard/CounselorDeadlines.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { counselorApi } from "@/lib/counselorApi";

const STAGE_CONFIG = {
  lead: {
    label: "Leads",
    color: "from-sky-500 to-cyan-400",
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  contacted: {
    label: "Contacted",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  qualified: {
    label: "Counseled",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  application_started: {
    label: "App Started",
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  application_submitted: {
    label: "Applied",
    color: "from-fuchsia-500 to-pink-500",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-600",
  },
  offer_received: {
    label: "Offer",
    color: "from-amber-400 to-orange-400",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  visa_process: {
    label: "Visa",
    color: "from-emerald-500 to-green-400",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  enrolled: {
    label: "Enrolled",
    color: "from-teal-500 to-emerald-400",
    bg: "bg-teal-50",
    text: "text-teal-600",
  },
};

const STAGE_ORDER = Object.keys(STAGE_CONFIG);

export default function CounselorPipeline() {
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    counselorApi
      .getPipeline()
      .then((data) => {
        // data.data is an array of { stage, count, students }
        setPipeline(data.data || []);
      })
      .catch((err) => console.error("Pipeline load error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Build ordered list matching STAGE_ORDER
  const stageMap = Object.fromEntries(pipeline.map((s) => [s.stage, s]));
  const orderedStages = STAGE_ORDER.map((key) => ({
    key,
    config: STAGE_CONFIG[key],
    count: stageMap[key]?.count || 0,
  })).filter((s) => s.config); // skip stages not in config

  const MAX = orderedStages[0]?.count || 1;
  const enrolledCount = stageMap["enrolled"]?.count || 0;

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
          {loading ? "..." : `${enrolledCount} Enrolled`}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {STAGE_ORDER.slice(0, 7).map((_, i) => (
            <div
              key={i}
              className="h-8 bg-slate-100  rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {orderedStages.map((item, i) => {
              const pct = Math.round((item.count / MAX) * 100);
              const prev = orderedStages[i - 1];
              const dropPct =
                prev && prev.count > 0
                  ? Math.round(((prev.count - item.count) / prev.count) * 100)
                  : null;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-right shrink-0">
                      <span className="text-xs font-semibold text-slate-500">
                        {item.config.label}
                      </span>
                    </div>
                    <div className="flex-1 h-8 bg-slate-100 rounded-xl overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(pct, 4)}%` }}
                        transition={{
                          delay: i * 0.07 + 0.2,
                          duration: 0.7,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className={`h-full bg-gradient-to-r ${item.config.color} rounded-xl flex items-center justify-end pr-0.5`}
                      >
                        <span className="text-white text-xs font-bold">
                          {item.count}
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

          <div className="flex gap-2 flex-wrap">
            {orderedStages.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                whileHover={{ y: -2 }}
                className={`${item.config.bg} rounded-xl px-3 py-2 text-center min-w-[70px] cursor-pointer border border-white hover:shadow-sm transition-all duration-200`}
              >
                <p className={`text-lg font-extrabold ${item.config.text}`}>
                  {item.count}
                </p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  {item.config.label}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
