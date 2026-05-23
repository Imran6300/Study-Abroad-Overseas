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

  const [searchUniversity, setSearchUniversity] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
      setSearchUniversity(initialData?.university?.name || "");
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

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchUniversity.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${encodeURIComponent(searchUniversity)}`,
        );

        const data = await res.json();

        if (data.success) {
          setSearchResults(data.universities || []);
        }
      } catch (err) {
        console.error("University search failed", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchUniversity]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);
  };

  return (
    <div className="bg-gray-200 p-8 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-100 p-6 rounded-xl border border-gray-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            University Selection
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search university..."
              value={searchUniversity}
              onChange={(e) => {
                setSearchUniversity(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300"
            />

            {showDropdown && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-xl max-h-72 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((uni) => (
                    <button
                      key={uni._id}
                      type="button"
                      onClick={() => {
                        updateSection("programPreference", {
                          universitySlug: uni.slug,
                        });

                        setSearchUniversity(uni.name);

                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                    >
                      <div className="font-medium">{uni.name}</div>

                      <div className="text-sm text-gray-500">{uni.city}</div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">No universities found</div>
                )}
              </div>
            )}
          </div>
        </div>
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
          updateForm={(fields) => updateSection("personalInfo", fields)}
        />

        <EducationSection
          data={form.education}
          updateForm={(fields) => updateSection("education", fields)}
        />

        <TestsSection
          data={form.tests}
          updateForm={(fields) => updateSection("tests", fields)}
        />

        <ProgramSection
          data={form.programPreference}
          updateForm={(fields) => updateSection("programPreference", fields)}
        />

        <ExperienceSection
          data={form.experience}
          updateForm={(fields) => updateSection("experience", fields)}
        />

        <FinanceSection
          data={form.finance}
          updateForm={(fields) => updateSection("finance", fields)}
        />

        <FinalSection
          data={{
            comments: form.comments,
            source: form.source,
            agreed: form.agreed,
          }}
          updateForm={(fields) =>
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
