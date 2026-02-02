"use client";

import { useState, useEffect } from "react";
import VisaStatusSection from "./visaform/VisaStatusSection"
import VisaCoreFields from "./visaform/VisaCoreFields";
import VisaFormActions from "./visaform/VisaFormActions";

export default function VisaCaseForm({ mode="add", initialData, onSuccess, onCancel }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [form, setForm] = useState({
    studentName: "",
    passportNo: "",
    country: "",
    visaType: "",
    status: "Under Review",
    submissionDate: "",
    expectedDecision: "",
    counselor: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(prev => ({
        ...prev,
        ...initialData,
        expectedDecision: initialData.expectedDecision?.split("T")[0] || "",
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isView) return;
    onSuccess(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <VisaStatusSection
        status={form.status}
        setStatus={(status) => setForm(p => ({ ...p, status }))}
        mode={mode}
      />

      <VisaCoreFields
        form={form}
        handleChange={handleChange}
        isView={isView}
      />

      <VisaFormActions
        isView={isView}
        isAdd={isAdd}
        onCancel={onCancel}
      />
    </form>
  );
}
