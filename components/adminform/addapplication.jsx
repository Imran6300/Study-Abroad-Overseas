// components/adminform/addapplication.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import StudentPhotoUpload from "../adminform/studentform/StudentPhotoUpload";

import PersonalDetailsSection from "./studentform/PersonalDetailsSection";
import ContactInfoSection from "./studentform/ContactInfoSection";
import AcademicSection from "./studentform/AcademicSection";
import TestsAndAdminSection from "./studentform/TestsAndAdminSection";
import PreferenceSection from "./studentform/PreferencesSection";

export default function AddApplicationForm({
  mode = "add",
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [form, setForm] = useState({
    studentName: "",
    email: "",
    mobile: "",
    university: "",
    course: "",
    stage: "Documents Pending",
    deadline: "",
    counselor: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    passportNumber: "",
    passportExpiry: "",
    whatsapp: "",
    currentCity: "",
    state: "",
    country: "India",
    currentQualification: "",
    stream: "",
    passingYear: "",
    percentage: "",
    backlogs: "0",
    englishTest: "None",
    englishScore: "",
    preferredCountries: [],
    preferredIntake: "",
    studyLevel: "",
    fieldOfStudy: "",
    budgetTuition: "",
    leadSource: "",
    remarks: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  // ─── Load initial data ───
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        studentName: initialData.studentName || "",
        email: initialData.email || "",
        mobile: initialData.mobile || "",
        university: initialData.university || "",
        course: initialData.course || "",
        stage: initialData.stage || "Documents Pending",
        deadline: initialData.deadline ? initialData.deadline.split("T")[0] : "",
        counselor: initialData.counselor || "",
        fullName: initialData.studentName || "",
        // Add more mappings when you save them
      }));
      // setPhotoPreview(initialData.photoUrl || null); // if you have URL
    } else if (isAdd) {
      setForm((prev) => ({ ...prev, stage: "Documents Pending" }));
      setPhotoPreview(null);
      setPhotoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    if (isView) return;

    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        preferredCountries: checked
          ? [...prev.preferredCountries, value]
          : prev.preferredCountries.filter((c) => c !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.studentName.trim()) newErrors.studentName = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    if (!form.university?.trim()) newErrors.university = "Required";
    if (!form.course?.trim()) newErrors.course = "Required";
    if (!form.stage?.trim()) newErrors.stage = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isView) return;
    if (!validateForm()) return;

    const submitData = {
      ...form,
      studentName: form.studentName || form.fullName,
      studentPhoto: photoFile,
    };

    onSuccess(submitData);
  };

  // Stage options with colors
  const stageOptions = [
    { value: "Lead / Enquiry", label: "Lead / Enquiry", color: "bg-gray-100 text-gray-800" },
    { value: "Profile Completed", label: "Profile Completed", color: "bg-blue-100 text-blue-800" },
    { value: "Documents Pending", label: "Documents Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "Application Submitted", label: "Application Submitted", color: "bg-indigo-100 text-indigo-800" },
    { value: "Offer Received", label: "Offer Received", color: "bg-green-100 text-green-800" },
    { value: "Visa Applied", label: "Visa Applied", color: "bg-purple-100 text-purple-800" },
    { value: "Visa Approved", label: "Visa Approved", color: "bg-emerald-100 text-emerald-800" },
    { value: "Enrolled / Completed", label: "Enrolled / Completed", color: "bg-teal-100 text-teal-800" },
    { value: "Rejected / Lost", label: "Rejected / Lost", color: "bg-red-100 text-red-800" },
  ];

  const currentStageStyle = stageOptions.find(s => s.value === form.stage)?.color || "bg-gray-100 text-gray-800";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Prominent Stage Updater - Top of the form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {isAdd ? "Initial Stage" : isEdit ? "Update Application Stage" : "Current Application Stage"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isView ? "Status of this application" : "Select the current/next stage"}
            </p>
          </div>

          {isView ? (
            <span className={`px-6 py-2.5 rounded-full text-base font-medium ${currentStageStyle}`}>
              {form.stage || "N/A"}
            </span>
          ) : (
            <div className="w-full sm:w-80">
              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all ${currentStageStyle}`}
              >
                {stageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Photo */}
      {isView ? (
        photoPreview ? (
          <div className="flex justify-center">
            <img
              src={photoPreview}
              alt="Student"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md"
            />
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">No photo uploaded</p>
        )
      ) : (
        <StudentPhotoUpload
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          setPhotoFile={setPhotoFile}
          fileInputRef={fileInputRef}
        />
      )}

      {/* Core fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
          {isView ? (
            <p className="font-medium text-gray-900">{form.studentName || "—"}</p>
          ) : (
            <input
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-sky-500"
              required
            />
          )}
        </div>

        {/* University */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
          {isView ? (
            <p className="font-medium text-gray-900">{form.university || "—"}</p>
          ) : (
            <input
              name="university"
              value={form.university}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-sky-500"
            />
          )}
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
          {isView ? (
            <p className="font-medium text-gray-900">{form.course || "—"}</p>
          ) : (
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-sky-500"
            />
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          {isView ? (
            <p className="font-medium text-gray-900">
              {form.deadline ? new Date(form.deadline).toLocaleDateString("en-IN") : "—"}
            </p>
          ) : (
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          )}
        </div>

        {/* Counselor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Counselor</label>
          {isView ? (
            <p className="font-medium text-gray-900">{form.counselor || "Unassigned"}</p>
          ) : (
            <input
              name="counselor"
              value={form.counselor}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Detailed Sections */}
      <PersonalDetailsSection form={form} handleChange={handleChange} disabled={isView} />
      <ContactInfoSection form={form} handleChange={handleChange} disabled={isView} />
      <AcademicSection form={form} handleChange={handleChange} disabled={isView} />
      <TestsAndAdminSection form={form} handleChange={handleChange} disabled={isView} />
      <PreferenceSection form={form} handleChange={handleChange} disabled={isView} />

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          {isView ? "Close" : "Cancel"}
        </button>

        {!isView && (
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            {isAdd ? "Create Application" : "Update Application"}
          </button>
        )}
      </div>
    </form>
  );
}