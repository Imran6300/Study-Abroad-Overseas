import { useState } from "react";

import ApplicationsHeader from "./ApplicationsHeader";
import ApplicationForm from "./ApplicationForm";
import ApplicationCard from "./ApplicationCard";

export default function ApplicationsTab({ application }) {
  const [apps, setApps] = useState([
    {
      id: "app1",
      university: "University of Toronto",
      country: "Canada",
      course: "Computer Science (MSc)",
      intake: "Fall 2026",
      status: "under_review",
      appliedDate: "2026-05-12",
      portalId: "UOT-2026-MSC-0342",
      notes: "Strong profile, awaiting decision.",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    university: "",
    country: "",
    course: "",
    intake: "",
    status: "pending",
    appliedDate: "",
    portalId: "",
    notes: "",
  });

  const appSubStatusConfig = {
    pending: {
      label: "Pending",
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
    },
    under_review: {
      label: "Under Review",
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
    },
    accepted: {
      label: "Accepted",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    rejected: {
      label: "Rejected",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
    },
  };

  const handleAdd = async () => {
    if (!form.university.trim() || !form.course.trim()) return;

    setSaving(true);

    await new Promise((r) => setTimeout(r, 500));

    setApps((prev) => [
      ...prev,
      {
        id: `app${Date.now()}`,
        ...form,
      },
    ]);

    setForm({
      university: "",
      country: "",
      course: "",
      intake: "",
      status: "pending",
      appliedDate: "",
      portalId: "",
      notes: "",
    });

    setShowForm(false);

    setSaving(false);
  };

  const updateStatus = (id, status) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const removeApp = (id) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <ApplicationsHeader apps={apps} setShowForm={setShowForm} />

      <ApplicationForm
        showForm={showForm}
        form={form}
        setForm={setForm}
        handleAdd={handleAdd}
        saving={saving}
        setShowForm={setShowForm}
        appSubStatusConfig={appSubStatusConfig}
      />

      {apps.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
          No university applications tracked yet.
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              updateStatus={updateStatus}
              removeApp={removeApp}
              appSubStatusConfig={appSubStatusConfig}
            />
          ))}
        </div>
      )}
    </div>
  );
}
