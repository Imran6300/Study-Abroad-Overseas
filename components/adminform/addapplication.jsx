"use client";

import { useState, useEffect } from "react";

import StageSection from "./addapplication/StageSection";
import PersonalSection from "./addapplication/PersonalSection";
import EducationSection from "./addapplication/EducationSection";
import TestsSection from "./addapplication/TestsSection";
import ProgramSection from "./addapplication/ProgramSection";
import ExperienceSection from "./addapplication/ExperienceSection";
import FinanceSection from "./addapplication/FinanceSection";
import DocumentsSection from "./addapplication/DocumentsSection";
import FinalSection from "./addapplication/FinalSection";

export default function AdminApplicationForm({
  initialData = {},
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  const updateForm = (fields) => {
    setForm((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-gray-200 p-8 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <StageSection data={form} updateForm={updateForm} />

        <PersonalSection data={form} updateForm={updateForm} />

        <EducationSection data={form} updateForm={updateForm} />

        <TestsSection data={form} updateForm={updateForm} />

        <ProgramSection data={form} updateForm={updateForm} />

        <ExperienceSection data={form} updateForm={updateForm} />

        <FinanceSection data={form} updateForm={updateForm} />

        <DocumentsSection data={form} updateForm={updateForm} />

        <FinalSection data={form} updateForm={updateForm} />

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-400">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-gray-400 bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            Save Application
          </button>
        </div>
      </form>
    </div>
  );
}
