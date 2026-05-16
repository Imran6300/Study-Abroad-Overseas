"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Kanban } from "lucide-react";
import { useRouter } from "next/navigation";

const PIPELINE_STAGES = [
  {
    key: "Submitted to Khizar",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    dot: "bg-indigo-400",
  },
  {
    key: "Documents Reviewing",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
  },
  {
    key: "University Applied",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-400",
  },
  {
    key: "Offer Received",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-400",
  },
  {
    key: "Visa Processing",
    color: "bg-violet-50 border-violet-200 text-violet-700",
    dot: "bg-violet-400",
  },
  {
    key: "Visa Approved",
    color: "bg-teal-50 border-teal-200 text-teal-700",
    dot: "bg-teal-400",
  },
  {
    key: "Completed",
    color: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-400",
  },
];

/**
 * ApplicationPipelineBoard
 * @prop {Array} applications — array of application objects
 */
export default function ApplicationPipelineBoard({ applications = [] }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Kanban size={15} className="text-indigo-600" />
        </div>
        <h2 className="text-base font-bold text-slate-800">
          Application Pipeline
        </h2>
        <span className="text-xs text-slate-400 font-medium ml-auto">
          {applications.length} total
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {PIPELINE_STAGES.map((stage) => {
            const stageApps = applications.filter(
              (a) => a.status === stage.key,
            );
            return (
              <div key={stage.key} className="w-56 shrink-0">
                {/* Column header */}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-2.5 border ${stage.color}`}
                >
                  <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                  <span className="text-[11px] font-bold truncate flex-1">
                    {stage.key}
                  </span>
                  <span className="text-[11px] font-bold shrink-0">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2 min-h-[80px]">
                  {stageApps.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl py-6 text-center text-[11px] text-slate-400 font-medium">
                      Empty
                    </div>
                  ) : (
                    stageApps.map((app, i) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                        onClick={() =>
                          router.push(
                            `/dashboard/counselor-dashboard/khizar-applications/${app.id}`,
                          )
                        }
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${app.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                          >
                            {app.avatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {app.student}
                            </p>
                            <p className="text-[9px] font-mono text-slate-400">
                              {app.appId}
                            </p>
                          </div>
                          <Eye
                            size={11}
                            className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {app.university}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {app.intake}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
