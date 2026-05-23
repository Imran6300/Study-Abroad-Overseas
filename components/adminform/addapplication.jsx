"use client";

import { useState, useEffect } from "react";

import StageSection from "./addapplication/StageSection";
import PersonalSection from "./addapplication/PersonalSection";
import EducationSection from "./addapplication/EducationSection";
import TestsSection from "./addapplication/TestsSection";
import ProgramSection from "./addapplication/ProgramSection";
import ExperienceSection from "./addapplication/ExperienceSection";
import FinanceSection from "./addapplication/FinanceSection";
import FinalSection from "./addapplication/FinalSection";
import ConfirmationModal from "@/components/adminform/confirmmsg";

export default function AdminApplicationForm({
  initialData = {},
  onSubmit,
  onCancel,
  studentId,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/applications/${initialData._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/applications`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          userId: studentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showModal({
          title: "Error",
          message: data.message || "Something went wrong",
          confirmVariant: "danger",
        });
        return;
      }

      // return updated data to parent page
      if (onSubmit) {
        showModal({
          title: "Success",
          message: isEdit
            ? "Application updated successfully"
            : "Application created successfully",
          confirmText: "Continue",
          confirmVariant: "success",
          onConfirm: () => {
            if (onSubmit) onSubmit(data.application);
            setModal((prev) => ({ ...prev, open: false }));
          },
        });
      }
    } catch (error) {
      console.error("Submit error:", error);

      showModal({
        title: "Server Error",
        message: "Something went wrong. Please try again.",
        confirmVariant: "danger",
      });
    }
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
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            {isEdit ? "Update Application" : "Save Application"}
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
