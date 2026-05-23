"use client";

import { useState, useEffect } from "react";

import StageSection from "@/components/adminform/addapplication/StageSection";
import PersonalSection from "@/components/adminform/addapplication/PersonalSection";
import EducationSection from "@/components/adminform/addapplication/EducationSection";
import TestsSection from "@/components/adminform/addapplication/TestsSection";
import ProgramSection from "@/components/adminform/addapplication/ProgramSection";
import ExperienceSection from "@/components/adminform/addapplication/ExperienceSection";
import FinanceSection from "@/components/adminform/addapplication/FinanceSection";
import FinalSection from "@/components/adminform/addapplication/FinalSection";
import ConfirmationModal from "@/components/adminform/confirmmsg";

export default function ApplicationForm({
  initialData = {},
  onSubmit,
  onCancel,
  saving,
}) {
  const isEdit = Boolean(initialData?._id);

  const [form, setForm] = useState({
    stage: "",
    personalInfo: {},
    education: {},
    tests: {},
    programPreference: {},
    experience: {},
    finance: {},
    documents: {},
    source: "",
    comments: "",
    agreed: false,
  });
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "OK",
    confirmVariant: "success",
    onConfirm: null,
  });

  const showModal = ({
    title,
    message,
    confirmText = "OK",
    confirmVariant = "success",
    onConfirm = null,
  }) => {
    setModal({
      open: true,
      title,
      message,
      confirmText,
      confirmVariant,
      onConfirm,
    });
  };

  useEffect(() => {
    if (initialData && initialData._id) {
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
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Application"
                : "Save Application"}
          </button>
        </div>
      </form>
      {modal.open && (
        <ConfirmationModal
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          confirmVariant={modal.confirmVariant}
          onConfirm={
            modal.onConfirm ||
            (() => setModal((prev) => ({ ...prev, open: false })))
          }
          onCancel={() => setModal((prev) => ({ ...prev, open: false }))}
        />
      )}
    </div>
  );
}
