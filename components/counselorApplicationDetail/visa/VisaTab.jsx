import { useState } from "react";

import VisaProgress from "./VisaProgress";
import VisaInfoForm from "./VisaInfoForm";
import VisaChecklist from "./VisaChecklist";

export default function VisaTab({ application }) {
  const defaultSteps = [
    {
      id: "vs1",
      step: "Offer Letter Received",
      status: "not_started",
      notes: "",
    },
    {
      id: "vs2",
      step: "GIC / Financial Proof",
      status: "not_started",
      notes: "",
    },
    {
      id: "vs3",
      step: "Biometrics Enrollment",
      status: "not_started",
      notes: "",
    },
    {
      id: "vs4",
      step: "Visa Application Filed",
      status: "not_started",
      notes: "",
    },
    {
      id: "vs5",
      step: "Medical Examination",
      status: "not_started",
      notes: "",
    },
    {
      id: "vs6",
      step: "Visa Decision",
      status: "not_started",
      notes: "",
    },
  ];

  const visaStepConfig = {
    not_started: {
      label: "Not Started",
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
    },
    in_progress: {
      label: "In Progress",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    completed: {
      label: "Completed",
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

  const [steps, setSteps] = useState(defaultSteps);

  const [visaInfo, setVisaInfo] = useState({
    visaType: "Student Visa (Study Permit)",
    fileNo: "",
    submissionDate: "",
    decisionDate: "",
    outcome: "",
    remarks: "",
  });

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [editingStep, setEditingStep] = useState(null);

  const [stepNote, setStepNote] = useState("");

  const updateStepStatus = (id, status) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const saveStepNote = (id) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, notes: stepNote } : s)),
    );

    setEditingStep(null);

    setStepNote("");
  };

  const handleSaveVisaInfo = async () => {
    setSaving(true);

    await new Promise((r) => setTimeout(r, 600));

    setSaving(false);

    setSaved(true);

    setTimeout(() => setSaved(false), 2500);
  };

  const completedCount = steps.filter((s) => s.status === "completed").length;

  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-6">
      <VisaProgress
        completedCount={completedCount}
        totalSteps={steps.length}
        progressPct={progressPct}
      />

      <VisaInfoForm
        visaInfo={visaInfo}
        setVisaInfo={setVisaInfo}
        handleSaveVisaInfo={handleSaveVisaInfo}
        saving={saving}
        saved={saved}
      />

      <VisaChecklist
        steps={steps}
        editingStep={editingStep}
        setEditingStep={setEditingStep}
        stepNote={stepNote}
        setStepNote={setStepNote}
        updateStepStatus={updateStepStatus}
        saveStepNote={saveStepNote}
        visaStepConfig={visaStepConfig}
      />
    </div>
  );
}
