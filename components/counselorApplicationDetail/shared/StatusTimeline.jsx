import {
  Send,
  FileText,
  Building2,
  Star,
  Shield,
  CheckCircle2,
  Check,
} from "lucide-react";

import { motion } from "framer-motion";

// ─── Timeline Steps ─────────────────────────────────────────────
const TIMELINE_STEPS = [
  { key: "Submitted to Khizar", label: "Submitted", icon: Send },
  { key: "Documents Reviewing", label: "Doc Reviewing", icon: FileText },
  { key: "University Applied", label: "Uni Applied", icon: Building2 },
  { key: "Offer Received", label: "Offer Received", icon: Star },
  { key: "Visa Processing", label: "Visa Processing", icon: Shield },
  { key: "Visa Approved", label: "Visa Approved", icon: CheckCircle2 },
  { key: "Completed", label: "Completed", icon: Check },
];

// ─── Status Timeline ────────────────────────────────────────────
export default function StatusTimeline({ currentStatus }) {
  const statusOrder = TIMELINE_STEPS.map((s) => s.key);
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="relative">
      {/* Desktop */}
      <div className="hidden md:flex items-center">
        {TIMELINE_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    active
                      ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200"
                      : done
                        ? "bg-emerald-500 border-emerald-500"
                        : "bg-white border-slate-200"
                  }`}
                >
                  <Icon
                    size={15}
                    className={done || active ? "text-white" : "text-slate-400"}
                  />
                </motion.div>

                <span
                  className={`text-[10px] font-bold text-center leading-tight whitespace-nowrap ${
                    active
                      ? "text-indigo-600"
                      : done
                        ? "text-emerald-600"
                        : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mb-5 rounded-full transition-all ${
                    i < currentIdx ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4 relative pl-8 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {TIMELINE_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative flex items-center gap-3">
              <div
                className={`absolute -left-8 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  active
                    ? "bg-indigo-600 border-indigo-600"
                    : done
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-white border-slate-200"
                }`}
              >
                <Icon
                  size={13}
                  className={done || active ? "text-white" : "text-slate-400"}
                />
              </div>

              <span
                className={`text-sm font-semibold ${
                  active
                    ? "text-indigo-600"
                    : done
                      ? "text-emerald-600"
                      : "text-slate-400"
                }`}
              >
                {step.label}
              </span>

              {active && (
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
