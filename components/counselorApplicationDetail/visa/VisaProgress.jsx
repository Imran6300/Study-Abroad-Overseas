import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export default function VisaProgress({
  completedCount,
  totalSteps,
  progressPct,
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
          <Plane size={16} className="text-teal-600" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800">Visa Processing</h3>

          <p className="text-xs text-slate-400">
            {completedCount} of {totalSteps} steps completed
          </p>
        </div>
      </div>

      <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
        />
      </div>
    </>
  );
}
