// components/adminform/AddUniversityForm.jsx
"use client";

import { useState, useEffect } from "react";

import StepIndicator from "./universityform/StepIndicator";
import StepBasicInfo from "./universityform/StepBasicInfo";
import StepStats from "./universityform/StepStats";
import StepDescriptionCourses from "./universityform/StepDescriptionCourses";
import StepAdmissionsSimilar from "./universityform/StepAdmissionsSimilar";
import StepImages from "./universityform/StepImages";

export default function AddUniversityForm({
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
    name: "",
    country: "",
    city: "",
    website: "",
    qsRanking: "",
    acceptanceRate: "",
    numStudents: "",
    tuitionFees: "",
    intakes: "",
    description: "",
    courses: "",
    admissionRequirements: "",
    similarUniversities: ["", "", ""],
    featured: false,
    partnered: false,
    studentsPlaced: "",
    logoFile: null,
    imageFiles: [],
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  // ─── IMPORTANT: Sync initialData when it changes ───
  useEffect(() => {
    if (initialData) {
      console.log("Edit mode - received initialData:", initialData); // ← debug

      setForm({
        name: initialData.name || "",
        country: initialData.country || "",
        city: initialData.city || "",
        website: initialData.website || "",
        qsRanking: initialData.qsRanking ?? "",           // use ?? to handle null/undefined
        acceptanceRate: initialData.acceptanceRate || "",
        numStudents: initialData.numStudents ?? "",
        tuitionFees: initialData.tuitionFees || "",
        intakes: initialData.intakes || "",
        description: initialData.description || "",
        courses: initialData.courses || "",
        admissionRequirements: initialData.admissionRequirements || "",
        similarUniversities: Array.isArray(initialData.similarUniversities)
          ? initialData.similarUniversities
          : ["", "", ""],
        featured: !!initialData.featured,
        partnered: !!initialData.partnered,
        studentsPlaced: initialData.studentsPlaced ?? "",
        logoFile: null,                // new file only – don't carry old file
        imageFiles: [],                // new files only
      });

      // Handle existing logo & gallery images (assuming they are URLs in initialData)
      setLogoPreview(initialData.logo || null);
      setImagePreviews(
        Array.isArray(initialData.images)
          ? initialData.images
          : initialData.imagePreviews || []
      );

      setCurrentStep(1); // reset to first step when editing
    } else {
      // Reset for add mode
      setForm({
        name: "",
        country: "",
        city: "",
        website: "",
        qsRanking: "",
        acceptanceRate: "",
        numStudents: "",
        tuitionFees: "",
        intakes: "",
        description: "",
        courses: "",
        admissionRequirements: "",
        similarUniversities: ["", "", ""],
        featured: false,
        partnered: false,
        studentsPlaced: "",
        logoFile: null,
        imageFiles: [],
      });
      setLogoPreview(null);
      setImagePreviews([]);
      setCurrentStep(1);
    }
  }, [initialData]); // ← dependency is correct

  // Handlers remain the same
  const handleChange = (e) => {
    if (isViewMode) return;
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
    } else if (type === "file" && name === "logo") {
      const file = files?.[0];
      if (file) {
        setForm((p) => ({ ...p, logoFile: file }));
        setLogoPreview(URL.createObjectURL(file));
      }
    } else if (type === "file" && name === "images") {
      const fileArr = Array.from(files || []);
      setForm((p) => ({ ...p, imageFiles: [...p.imageFiles, ...fileArr] }));
      setImagePreviews((p) => [
        ...p,
        ...fileArr.map((f) => URL.createObjectURL(f)),
      ]);
    } else if (name.startsWith("similarUniversities")) {
      const index = Number(name.split("-")[1]);
      const updated = [...form.similarUniversities];
      updated[index] = value;
      setForm((p) => ({ ...p, similarUniversities: updated }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const removeImage = (index) => {
    if (isViewMode) return;
    setForm((p) => ({
      ...p,
      imageFiles: p.imageFiles.filter((_, i) => i !== index),
    }));
    setImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;
    if (!form.name || !form.country || !form.website) {
      alert("Please fill required fields: Name, Country, Website");
      return;
    }
    onSuccess(form); // send the whole form object
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
        <StepBasicInfo form={form} onChange={handleChange} isViewMode={isViewMode} />
      )}
      {currentStep === 2 && (
        <StepStats form={form} onChange={handleChange} isViewMode={isViewMode} />
      )}
      {currentStep === 3 && (
        <StepDescriptionCourses form={form} onChange={handleChange} isViewMode={isViewMode} />
      )}
      {currentStep === 4 && (
        <StepAdmissionsSimilar form={form} onChange={handleChange} isViewMode={isViewMode} />
      )}
      {currentStep === 5 && (
        <StepImages
          form={form}
          logoPreview={logoPreview}
          imagePreviews={imagePreviews}
          onChange={handleChange}
          removeImage={removeImage}
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
            {isEditMode ? "Update University" : "Add University"}
          </button>
        )}
      </div>
    </form>
  );
}