import { motion } from "framer-motion";

import { Check, X, Pencil } from "lucide-react";

import VisaStepNoteEditor from "./VisaStepNoteEditor";

export default function VisaStepCard({
  step,
  index,
  editingStep,
  setEditingStep,
  stepNote,
  setStepNote,
  updateStepStatus,
  saveStepNote,
  visaStepConfig,
}) {
  const sc = visaStepConfig[step.status] || visaStepConfig.not_started;

  return (
    <motion.div
      layout
      className="bg-white border border-slate-200 rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
            step.status === "completed"
              ? "bg-emerald-500 text-white"
              : step.status === "in_progress"
                ? "bg-blue-500 text-white"
                : step.status === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-slate-100 text-slate-500"
          }`}
        >
          {step.status === "completed" ? (
            <Check size={12} />
          ) : step.status === "rejected" ? (
            <X size={12} />
          ) : (
            index + 1
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">{step.step}</p>

          {step.notes && (
            <p className="text-xs text-slate-400 mt-0.5">{step.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setEditingStep(editingStep === step.id ? null : step.id);

              setStepNote(step.notes);
            }}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all"
          >
            <Pencil size={11} className="text-slate-400" />
          </button>

          <select
            value={step.status}
            onChange={(e) => updateStepStatus(step.id, e.target.value)}
            className={`text-[11px] font-semibold border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 ${sc.bg} ${sc.text} ${sc.border}`}
          >
            {Object.entries(visaStepConfig).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <VisaStepNoteEditor
        step={step}
        editingStep={editingStep}
        stepNote={stepNote}
        setStepNote={setStepNote}
        saveStepNote={saveStepNote}
        setEditingStep={setEditingStep}
      />
    </motion.div>
  );
}
