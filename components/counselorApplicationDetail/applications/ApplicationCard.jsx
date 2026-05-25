import { motion } from "framer-motion";

import { Building2, Hash, Calendar, Trash2, Eye } from "lucide-react";

export default function ApplicationCard({
  app,
  updateStatus,
  removeApp,
  appSubStatusConfig,
  onView,
}) {
  const normalizedStatus = app.isRejected
    ? "lost"
    : app.workflow?.visaApproved
      ? "enrolled"
      : app.workflow?.visaApplied
        ? "visa_process"
        : app.workflow?.offerReceived
          ? "offer_received"
          : app.workflow?.universityApplied
            ? "application_submitted"
            : "application_started";
  const sc =
    appSubStatusConfig[normalizedStatus] ||
    appSubStatusConfig.application_started;

  return (
    <motion.div
      layout
      className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-indigo-600" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-slate-800">
                {app.university?.name || "N/A"}
              </p>

              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
              >
                {sc.label}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              {app.programPreference?.field || "N/A"}
              {app.university?.country ? ` · ${app.university.country}` : ""}

              {app.programPreference?.intake
                ? ` · ${app.programPreference.intake}`
                : ""}
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              {app.portalId && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Hash size={10} />
                  {app.portalId}
                </span>
              )}

              {app.appliedDate && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={10} />
                  Applied:{" "}
                  {new Date(app.appliedDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            {app.notes && (
              <p className="text-xs text-slate-400 mt-2 italic">{app.notes}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={normalizedStatus}
            onChange={(e) => updateStatus(app._id, e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            {Object.entries(appSubStatusConfig).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => onView(app)}
            className="w-8 h-8 rounded-lg hover:bg-indigo-50 flex items-center justify-center transition-all"
          >
            <Eye size={13} className="text-slate-400 hover:text-indigo-500" />
          </button>

          <button
            onClick={() => removeApp(app._id)}
            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-all"
          >
            <Trash2 size={13} className="text-slate-400 hover:text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
