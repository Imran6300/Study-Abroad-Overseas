import { useState } from "react";
import { CalendarClock, Plus } from "lucide-react";

import DeadlineForm from "./DeadlineForm";
import PendingDocuments from "./PendingDeadlines";
import CompletedDeadlines from "./CompletedDeadlines";

export default function DeadlinesTab({ applicationId }) {
  const [deadlines, setDeadlines] = useState([
    {
      id: "d1",
      title: "SOP Final Submission",
      description: "Submit revised Statement of Purpose to processor",
      dueDate: "2026-05-28",
      priority: "high",
      completed: false,
    },
    {
      id: "d2",
      title: "University Application Portal Deadline",
      description: "University of Toronto Fall 2026 application closes",
      dueDate: "2026-06-15",
      priority: "high",
      completed: false,
    },
    {
      id: "d3",
      title: "Financial Proof Documents",
      description: "Bank statements and sponsorship letter",
      dueDate: "2026-06-30",
      priority: "medium",
      completed: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const handleAdd = async () => {
    if (!form.title.trim() || !form.dueDate) return;

    setSaving(true);

    await new Promise((r) => setTimeout(r, 500));

    const newDeadline = {
      id: `d${Date.now()}`,
      ...form,
      completed: false,
    };

    setDeadlines((prev) => [...prev, newDeadline]);

    setForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    });

    setShowForm(false);

    setSaving(false);
  };

  const toggleComplete = (id) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d)),
    );
  };

  const removeDeadline = (id) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

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

      <DeadlineForm
        showForm={showForm}
        form={form}
        setForm={setForm}
        handleAdd={handleAdd}
        saving={saving}
        setShowForm={setShowForm}
      />

      <PendingDocuments
        deadlines={pending}
        toggleComplete={toggleComplete}
        removeDeadline={removeDeadline}
      />

      <CompletedDeadlines
        deadlines={completed}
        toggleComplete={toggleComplete}
        removeDeadline={removeDeadline}
      />

      {deadlines.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
          No deadlines added yet. Click "Add Deadline" to create one.
        </div>
      )}
    </div>
  );
}
