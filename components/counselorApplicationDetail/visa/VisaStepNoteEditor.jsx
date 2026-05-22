import { AnimatePresence, motion } from "framer-motion";

export default function VisaStepNoteEditor({
  step,
  editingStep,
  stepNote,
  setStepNote,
  saveStepNote,
  setEditingStep,
}) {
  return (
    <AnimatePresence>
      {editingStep === step.id && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-slate-100 px-4 pb-4 pt-3 bg-slate-50"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={stepNote}
              onChange={(e) => setStepNote(e.target.value)}
              placeholder="Add a note for this step..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            />

            <button
              onClick={() => saveStepNote(step.id)}
              className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              Save
            </button>

            <button
              onClick={() => setEditingStep(null)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
