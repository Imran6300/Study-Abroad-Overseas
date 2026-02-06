// components/adminform/AddCourseForm.jsx
"use client";

import { useState, useEffect } from "react";

import StepIndicator from "./universityform/StepIndicator";          // create these sub-components
import StepHeroBasic from "./courseform/StepHeroBasic";
import StepOverviewHighlights from "./courseform/StepOverviewHighlights";
import StepRequirements from "./courseform/StepRequirements";
import StepCareerOutcomes from "./courseform/StepCareerOutcomes";
import StepTopUniversitiesImages from "./courseform/StepTopUniversitiesImages";

export default function AddCourseForm({
  mode = "add",
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    // Hero / Basic
    bgImageFile: null,
    topLabel: "Master's Program",      // default example
    title: "",
    subtitle: "",
    duration: "",
    fees: "",
    scholarships: "",
    avgSalary: "",

    // Overview & Highlights
    overviewTitle: "Program Overview",
    overviewDescription: "",
    keyHighlights: [""],               // array of strings

    // Entry Requirements
    entryRequirements: [{ title: "", description: "" }],  // array of objects

    // Career & Outcomes
    careerProspects: "",
    popularJobRoles: [""],
    salaryExpectations: "",

    // Top Universities & Other
    topUniversities: [""],             // array of names
    featured: false,
  });

  // Previews
  const [bgPreview, setBgPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        bgImageFile: null,
        topLabel: initialData.topLabel || "Master's Program",
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        duration: initialData.duration || "",
        fees: initialData.fees || "",
        scholarships: initialData.scholarships || "",
        avgSalary: initialData.avgSalary || "",

        overviewTitle: initialData.overviewTitle || "Program Overview",
        overviewDescription: initialData.overviewDescription || "",
        keyHighlights: Array.isArray(initialData.keyHighlights) ? initialData.keyHighlights : [""],

        entryRequirements: Array.isArray(initialData.entryRequirements)
          ? initialData.entryRequirements
          : [{ title: "", description: "" }],

        careerProspects: initialData.careerProspects || "",
        popularJobRoles: Array.isArray(initialData.popularJobRoles) ? initialData.popularJobRoles : [""],
        salaryExpectations: initialData.salaryExpectations || "",

        topUniversities: Array.isArray(initialData.topUniversities) ? initialData.topUniversities : [""],
        featured: !!initialData.featured,
      });

      setBgPreview(initialData.bgImage || null); // URL from DB
      setCurrentStep(1);
    } else {
      // reset for add
      setForm({
        bgImageFile: null,
        topLabel: "Master's Program",
        title: "",
        subtitle: "",
        duration: "",
        fees: "",
        scholarships: "",
        avgSalary: "",

        overviewTitle: "Program Overview",
        overviewDescription: "",
        keyHighlights: [""],

        entryRequirements: [{ title: "", description: "" }],

        careerProspects: "",
        popularJobRoles: [""],
        salaryExpectations: "",

        topUniversities: [""],
        featured: false,
      });
      setBgPreview(null);
      setCurrentStep(1);
    }
  }, [initialData]);

  const handleChange = (e) => {
    if (isViewMode) return;
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
    } else if (type === "file" && name === "bgImage") {
      const file = files?.[0];
      if (file) {
        setForm((p) => ({ ...p, bgImageFile: file }));
        setBgPreview(URL.createObjectURL(file));
      }
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  // Helper to update arrays (key highlights, job roles, universities, etc.)
  const updateArrayField = (fieldName, index, value) => {
    setForm((prev) => {
      const updated = [...prev[fieldName]];
      updated[index] = value;
      return { ...prev, [fieldName]: updated };
    });
  };

  const addArrayItem = (fieldName, defaultValue = "") => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], defaultValue],
    }));
  };

  const removeArrayItem = (fieldName, index) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  // For entry requirements (array of objects)
  const updateRequirement = (index, key, value) => {
    setForm((prev) => {
      const updated = [...prev.entryRequirements];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, entryRequirements: updated };
    });
  };

  const addRequirement = () => {
    setForm((prev) => ({
      ...prev,
      entryRequirements: [...prev.entryRequirements, { title: "", description: "" }],
    }));
  };

  const removeRequirement = (index) => {
    setForm((prev) => ({
      ...prev,
      entryRequirements: prev.entryRequirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!form.title || !form.duration) {
      alert("Please fill required fields: Title, Duration");
      return;
    }

    onSuccess(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {!isViewMode && (
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={() => setCurrentStep((p) => Math.min(p + 1, totalSteps))}
          onPrev={() => setCurrentStep((p) => Math.max(p - 1, 1))}
        />
      )}

      {currentStep === 1 && (
        <StepHeroBasic
          form={form}
          onChange={handleChange}
          bgPreview={bgPreview}
          isViewMode={isViewMode}
        />
      )}

      {currentStep === 2 && (
        <StepOverviewHighlights
          form={form}
          onChange={handleChange}
          updateArrayField={updateArrayField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          isViewMode={isViewMode}
        />
      )}

      {currentStep === 3 && (
        <StepRequirements
          form={form}
          updateRequirement={updateRequirement}
          addRequirement={addRequirement}
          removeRequirement={removeRequirement}
          isViewMode={isViewMode}
        />
      )}

      {currentStep === 4 && (
        <StepCareerOutcomes
          form={form}
          onChange={handleChange}
          updateArrayField={updateArrayField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          isViewMode={isViewMode}
        />
      )}

      {currentStep === 5 && (
        <StepTopUniversitiesImages
          form={form}
          updateArrayField={updateArrayField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          isViewMode={isViewMode}
        />
      )}

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          {isViewMode ? "Close" : "Cancel"}
        </button>

        {!isViewMode && currentStep === totalSteps && (
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            {isEditMode ? "Update Course" : "Add Course"}
          </button>
        )}
      </div>
    </form>
  );
}