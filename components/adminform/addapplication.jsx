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
    if (initialData) {
      setForm({
        stage: initialData.stage || "",
        personalInfo: initialData.personalInfo || {},
        education: initialData.education || {},
        tests: initialData.tests || {},
        programPreference: initialData.programPreference || {},
        experience: initialData.experience || {},
        finance: initialData.finance || {},
        documents: initialData.documents || {},
        source: initialData.source || "",
        comments: initialData.comments || "",
        agreed: initialData.agreed || false,
      });
    }
  }, [initialData]);

  const updateSection = (section, fields) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...fields,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-gray-200 p-8 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <StageSection
          value={form.stage}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              stage: value,
            }))
          }
        />

        <PersonalSection
          data={form.personalInfo}
          updateSection={(fields) => updateSection("personalInfo", fields)}
        />

        <EducationSection
          data={form.education}
          updateSection={(fields) => updateSection("education", fields)}
        />

        <TestsSection
          data={form.tests}
          updateSection={(fields) => updateSection("tests", fields)}
        />

        <ProgramSection
          data={form.programPreference}
          updateSection={(fields) => updateSection("programPreference", fields)}
        />

        <ExperienceSection
          data={form.experience}
          updateSection={(fields) => updateSection("experience", fields)}
        />

        <FinanceSection
          data={form.finance}
          updateSection={(fields) => updateSection("finance", fields)}
        />

        <DocumentsSection
          data={form.documents}
          updateSection={(fields) => updateSection("documents", fields)}
        />

        <FinalSection
          data={{
            comments: form.comments,
            source: form.source,
            agreed: form.agreed,
          }}
          updateSection={(fields) =>
            setForm((prev) => ({
              ...prev,
              ...fields,
            }))
          }
        />

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
