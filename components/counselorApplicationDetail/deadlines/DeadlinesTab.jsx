import { useState } from "react";
import { CalendarClock, Plus } from "lucide-react";

import DeadlineForm from "./DeadlineForm";
import PendingDocuments from "./PendingDeadlines";
import CompletedDeadlines from "./CompletedDeadlines";

export default function DeadlinesTab({
  applicationId,
  deadlines,
  savingDeadline,
  handleCreateDeadline,
  handleToggleDeadline,
  handleDeleteDeadline,
}) {
  const [showForm, setShowForm] = useState(false);

  const pending = deadlines.filter((d) => !d.completed);

  const completed = deadlines.filter((d) => d.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <CalendarClock size={16} className="text-amber-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">Deadlines</h3>

            <p className="text-xs text-slate-400">
              {pending.length} pending · {completed.length} completed
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all"
        >
          <Plus size={13} />
          Add Deadline
        </button>
      </div>

      {showForm && (
        <DeadlineForm
          mode="add"
          initialData={null}
          saving={savingDeadline}
          onCancel={() => setShowForm(false)}
          onSubmit={(payload) => {
            handleCreateDeadline(payload);
            setShowForm(false);
          }}
        />
      )}

      <PendingDocuments
        deadlines={pending}
        toggleComplete={handleToggleDeadline}
        removeDeadline={handleDeleteDeadline}
      />

      <CompletedDeadlines
        deadlines={completed}
        toggleComplete={handleToggleDeadline}
        removeDeadline={handleDeleteDeadline}
      />

      {deadlines.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
          No deadlines added yet. Click "Add Deadline" to create one.
        </div>
      )}
    </div>
  );
}
