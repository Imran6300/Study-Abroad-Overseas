import { CheckSquare } from "lucide-react";

import VisaStepCard from "./VisaStepCard";

export default function VisaChecklist({
  steps,
  editingStep,
  setEditingStep,
  stepNote,
  setStepNote,
  updateStepStatus,
  saveStepNote,
  visaStepConfig,
}) {
  return (
    <div>
      <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
        <CheckSquare size={14} className="text-teal-500" />
        Processing Checklist
      </h4>

      <div className="space-y-2.5">
        {steps.map((s, i) => (
          <VisaStepCard
            key={s.id}
            step={s}
            index={i}
            editingStep={editingStep}
            setEditingStep={setEditingStep}
            stepNote={stepNote}
            setStepNote={setStepNote}
            updateStepStatus={updateStepStatus}
            saveStepNote={saveStepNote}
            visaStepConfig={visaStepConfig}
          />
        ))}
      </div>
    </div>
  );
}
