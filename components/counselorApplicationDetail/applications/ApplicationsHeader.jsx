import { ClipboardList, Plus } from "lucide-react";

export default function ApplicationsHeader({ apps, setShowForm }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
          <ClipboardList size={16} className="text-indigo-600" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800">
            University Applications
          </h3>

          <p className="text-xs text-slate-400">
            {apps?.length || 0} application
            {(apps?.length || 0) !== 1 ? "s" : ""} tracked
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowForm((v) => !v)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all"
      >
        <Plus size={13} />
        Add Application
      </button>
    </div>
  );
}
