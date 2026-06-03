"use client";

import { useState, useEffect, useRef } from "react";

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

  // Search State
  const [searchUniversity, setSearchUniversity] = useState("");
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Ref for click-outside detection
  const searchContainerRef = useRef(null);

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

  // Handle clicking outside of the search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialData && initialData._id) {
      setForm({
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
      setSelectedUniversities(
        initialData?.programPreference?.universities || [],
      );
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

  // Robust Search with AbortController for Race Conditions
  useEffect(() => {
    setSearchError(null);

    if (!searchUniversity.trim()) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const delayDebounce = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${encodeURIComponent(
            searchUniversity,
          )}`,
          { signal },
        );

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();

        if (data.success) {
          setSearchResults(data.universities || []);
        } else {
          setSearchError(data.message || "Failed to fetch results.");
        }
      } catch (err) {
        // Ignore AbortError as it's an intentional cancellation
        if (err.name !== "AbortError") {
          console.error("University search failed", err);
          setSearchError("An error occurred while searching.");
        }
      } finally {
        // Only stop loading if the request wasn't aborted
        if (!signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort(); // Cancel pending requests if user keeps typing
    };
  }, [searchUniversity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT FORM", JSON.stringify(form, null, 2));
    onSubmit(form);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="bg-gray-200 p-8 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-100 p-6 rounded-xl border border-gray-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            University Selection
          </h3>

          <div className="relative" ref={searchContainerRef}>
            <input
              type="text"
              placeholder="Search university..."
              value={searchUniversity}
              onChange={(e) => {
                setSearchUniversity(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (searchUniversity.trim()) setShowDropdown(true);
              }}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {showDropdown && searchUniversity.trim() && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-xl max-h-72 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-gray-500 text-center animate-pulse">
                    Searching...
                  </div>
                ) : searchError ? (
                  <div className="p-4 text-red-500 text-center text-sm">
                    {searchError}
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((uni) => (
                    <button
                      key={uni._id}
                      type="button"
                      onClick={() => {
                        const exists = selectedUniversities.some(
                          (u) => u.universitySlug === uni.slug,
                        );

                        if (exists) {
                          setSearchUniversity("");
                          setShowDropdown(false);
                          return;
                        }

                        const newUniversity = {
                          universitySlug: uni.slug,
                          universityName: uni.name,
                          status: "application_submitted",
                        };

                        const updatedUniversities = [
                          ...selectedUniversities,
                          newUniversity,
                        ];

                        setSelectedUniversities(updatedUniversities);

                        updateSection("programPreference", {
                          universities: updatedUniversities,
                        });

                        setSearchUniversity("");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 transition-colors duration-150 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">
                        {uni.name}
                      </div>
                      <div className="text-sm text-gray-500">{uni.city}</div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-gray-500 text-center">
                    No universities found
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedUniversities.map((uni) => (
                <div
                  key={uni.universitySlug}
                  className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg flex items-center gap-2 border border-indigo-200"
                >
                  <span className="font-medium text-sm">
                    {uni.universityName}
                  </span>
                  <button
                    type="button"
                    className="text-indigo-500 hover:text-indigo-800 focus:outline-none"
                    aria-label={`Remove ${uni.universityName}`}
                    onClick={() => {
                      const updated = selectedUniversities.filter(
                        (u) => u.universitySlug !== uni.universitySlug,
                      );

                      setSelectedUniversities(updated);

                      updateSection("programPreference", {
                        universities: updated,
                      });
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

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
            className="px-6 py-3 rounded-xl border border-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition-colors ${
              saving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
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
