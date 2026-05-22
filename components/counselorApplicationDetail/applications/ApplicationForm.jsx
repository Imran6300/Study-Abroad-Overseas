import { AnimatePresence, motion } from "framer-motion";

export default function ApplicationForm({
  showForm,
  form,
  setForm,
  handleAdd,
  saving,
  setShowForm,
  appSubStatusConfig,
}) {
  return (
    <AnimatePresence>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 space-y-4"
        >
          <h4 className="text-sm font-bold text-indigo-800">New Application</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                University <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                value={form.university}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    university: e.target.value,
                  }))
                }
                placeholder="e.g. University of Toronto"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Country
              </label>

              <input
                type="text"
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    country: e.target.value,
                  }))
                }
                placeholder="e.g. Canada"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Course <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                value={form.course}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    course: e.target.value,
                  }))
                }
                placeholder="e.g. Computer Science (MSc)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Intake
              </label>

              <input
                type="text"
                value={form.intake}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    intake: e.target.value,
                  }))
                }
                placeholder="e.g. Fall 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Application Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                {Object.entries(appSubStatusConfig).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Applied Date
              </label>

              <input
                type="date"
                value={form.appliedDate}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    appliedDate: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Portal / Application ID
              </label>

              <input
                type="text"
                value={form.portalId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    portalId: e.target.value,
                  }))
                }
                placeholder="e.g. UOT-2026-0342"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Internal Notes
              </label>

              <input
                type="text"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    notes: e.target.value,
                  }))
                }
                placeholder="Any remarks..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all disabled:opacity-60"
            >
              {saving ? "Saving..." : "Add Application"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
