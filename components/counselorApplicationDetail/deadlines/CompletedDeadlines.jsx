import { Check, Trash2 } from "lucide-react";

export default function CompletedDeadlines({
  deadlines,
  toggleComplete,
  removeDeadline,
}) {
  if (deadlines.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
        Completed
      </p>

      <div className="space-y-2">
        {deadlines.map((d) => (
          <div
            key={d._id}
            className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl opacity-60"
          >
            <button
              onClick={() => toggleComplete(d._id)}
              className="w-5 h-5 rounded-md bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center shrink-0"
            >
              <Check size={11} className="text-white" />
            </button>

            <p className="text-sm text-slate-500 line-through flex-1">
              {d.title}
            </p>

            <button onClick={() => removeDeadline(d._id)}>
              <Trash2
                size={13}
                className="text-slate-300 hover:text-red-400 transition-all"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
