// components/adminform/AddUniversityForm.jsx
"use client";

import { useState, useEffect } from "react";
import StepIndicator from "./universityform/StepIndicator";
import StepBasicInfo from "./universityform/StepBasicInfo";
import StepStats from "./universityform/StepStats";
import StepDescriptionCourses from "./universityform/StepDescriptionCourses";
import StepAdmissionsSimilar from "./universityform/StepAdmissionsSimilar";
import StepImages from "./universityform/StepImages";
import ConfirmationModal from "./confirmmsg";
import { AnimatePresence } from "framer-motion";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);
  const [coursesList, setCoursesList] = useState([]);

  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    flag: "",
    website: "",
    qsRanking: "",
    acceptanceRate: "",
    totalStudents: "",
    tuitionFee: "",
    intakes: "",
    description: "",
    courses: [],
    admissionRequirements: "",
    similarUniversities: ["", "", ""],
    featured: false,
    partnered: false,
    studentsPlaced: "",
    programs: [],
    logoFile: null,
    imageFiles: [],
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Sync initialData (edit mode)
  useEffect(() => {
    if (!initialData) {
      // ✅ Add mode reset
      setForm({
        name: "",
        country: "",
        city: "",
        flag: "",
        website: "",
        qsRanking: "",
        acceptanceRate: "",
        totalStudents: "",
        tuitionFee: "",
        intakes: "",
        description: "",
        courses: [],
        admissionRequirements: "",
        similarUniversities: ["", "", ""],
        featured: false,
        partnered: false,
        studentsPlaced: "",
        programs: [], // 🔥 IMPORTANT
        logoFile: null,
        imageFiles: [],
      });

      setLogoPreview(null);
      setImagePreviews([]);
      setCurrentStep(1);
      return;
    }

    // ✅ Edit mode
    setForm({
      name: initialData.name || "",
      country: initialData.country || "",
      city: initialData.city || "",
      flag: initialData.flag || "",
      website: initialData.website || "",
      qsRanking: initialData.qsRanking ? String(initialData.qsRanking) : "",
      acceptanceRate: initialData.acceptanceRate ?? "",
      totalStudents: initialData.totalStudents
        ? String(initialData.totalStudents)
        : "",
      tuitionFee: initialData.tuitionFee ?? "",
      intakes: initialData.intakes || "",
      description: initialData.description || "",
      courses: Array.isArray(initialData.courses)
        ? initialData.courses.map((c) => c._id)
        : [],
      admissionRequirements: initialData.admissionRequirements || "",
      similarUniversities: Array.isArray(initialData.similarUniversities)
        ? initialData.similarUniversities
        : ["", "", ""],
      featured: !!initialData.featured,
      partnered: !!initialData.partnered,
      studentsPlaced: initialData.studentsPlaced ?? "",
      programs: Array.isArray(initialData.programs) ? initialData.programs : [], // 🔥 IMPORTANT
      logoFile: null,
      imageFiles: [],
    });

    setLogoPreview(initialData.logo || null);
    setImagePreviews(
      Array.isArray(initialData.images) ? initialData.images : [],
    );
    setCurrentStep(1);
  }, [initialData]);

  const handleChange = (e) => {
    if (isViewMode) return;
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (name === "logo") {
        const file = files?.[0];
        if (file) {
          setForm((prev) => ({ ...prev, logoFile: file }));
          setLogoPreview(URL.createObjectURL(file));
        }
      } else if (name === "images") {
        const newFiles = Array.from(files || []);
        setForm((prev) => ({
          ...prev,
          imageFiles: [...prev.imageFiles, ...newFiles],
        }));
        setImagePreviews((prev) => [
          ...prev,
          ...newFiles.map((f) => URL.createObjectURL(f)),
        ]);
      }
    } else if (name.startsWith("similarUniversities-")) {
      const index = Number(name.split("-")[1]);
      const updated = [...form.similarUniversities];
      updated[index] = value;
      setForm((prev) => ({ ...prev, similarUniversities: updated }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    if (isViewMode) return;
    setForm((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => setCoursesList(data.courses || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode || isSubmitting) return;

    if (!form.name?.trim() || !form.country?.trim() || !form.website?.trim()) {
      setModalConfig({
        title: "Missing Fields",
        message: "Name, Country and Website are required.",
        confirmText: "OK",
        confirmVariant: "warning",
        onConfirm: () => setModalConfig(null),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Text fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === "courses") {
          value.forEach((courseId) => {
            formData.append("courses", courseId);
          });
        } else if (key === "similarUniversities") {
          value.forEach((uni, i) => {
            formData.append(`similarUniversities[${i}]`, uni.trim());
          });
        } else if (key === "programs") {
          formData.append("programs", JSON.stringify(value));
        } else if (key !== "logoFile" && key !== "imageFiles") {
          formData.append(key, value ?? "");
        }
      });

      // Files
      if (form.logoFile) formData.append("logo", form.logoFile);
      form.imageFiles.forEach((file) => formData.append("images", file));

      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/universities/${initialData._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/universities`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setModalConfig({
        title: "Success 🎉",
        message: data.message || "University saved successfully!",
        confirmText: "Great!",
        confirmVariant: "success",
        onConfirm: () => {
          setModalConfig(null);
          if (onSuccess) onSuccess(data.data || data);

          // Reset only in add mode (not edit)
          if (!isEditMode) {
            setForm({
              name: "",
              country: "",
              city: "",
              flag: "",
              website: "",
              qsRanking: "",
              acceptanceRate: "",
              totalStudents: "",
              tuitionFee: "",
              intakes: "",
              description: "",
              courses: [],
              admissionRequirements: "",
              similarUniversities: ["", "", ""],
              featured: false,
              partnered: false,
              studentsPlaced: "",
              programs: [],
              logoFile: null,
              imageFiles: [],
            });
            setLogoPreview(null);
            setImagePreviews([]);
            setCurrentStep(1);
          }
        },
      });
    } catch (err) {
      console.error(err);
      setModalConfig({
        title: "Error",
        message: err.message || "Failed to save university. Please try again.",
        confirmText: "Close",
        confirmVariant: "danger",
        onConfirm: () => setModalConfig(null),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
          <StepBasicInfo
            form={form}
            onChange={handleChange}
            isViewMode={isViewMode}
          />
        )}
        {currentStep === 2 && (
          <StepStats
            form={form}
            onChange={handleChange}
            isViewMode={isViewMode}
          />
        )}
        {currentStep === 3 && (
          <StepDescriptionCourses
            form={form}
            setForm={setForm}
            coursesList={coursesList}
            onChange={handleChange}
            isViewMode={isViewMode}
          />
        )}
        {currentStep === 4 && (
          <StepAdmissionsSimilar
            form={form}
            onChange={handleChange}
            isViewMode={isViewMode}
          />
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
            disabled={isSubmitting}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            {isViewMode ? "Close" : "Cancel"}
          </button>

          {!isViewMode && currentStep === totalSteps && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-8 py-3 rounded-xl font-semibold text-white shadow-md transition-all flex items-center gap-2
                ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 hover:shadow-lg"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : isEditMode ? (
                "Update University"
              ) : (
                "Add University"
              )}
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {modalConfig && (
          <ConfirmationModal
            title={modalConfig.title}
            message={modalConfig.message}
            confirmText={modalConfig.confirmText}
            confirmVariant={modalConfig.confirmVariant || "primary"}
            cancelText=""
            onConfirm={() => {
              modalConfig.onConfirm?.();
              setModalConfig(null);
            }}
            onCancel={() => setModalConfig(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
