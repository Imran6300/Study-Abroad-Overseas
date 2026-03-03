// components/adminform/AddStudentForm.jsx
"use client";

import { useState, useRef, useEffect } from "react";

import StudentPhotoUpload from "./studentform/StudentPhotoUpload";
import PersonalDetailsSection from "./studentform/PersonalDetailsSection";
import ContactInfoSection from "./studentform/ContactInfoSection";
import AcademicSection from "./studentform/AcademicSection";
import PreferenceSection from "./studentform/PreferencesSection";
import TestsAndAdminSection from "./studentform/TestsAndAdminSection";

export default function AddStudentForm({
  mode = "add",
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [form, setForm] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    passportNumber: "",
    passportExpiry: "",
    mobile: "",
    whatsapp: "",
    email: "",
    currentAddress: "",
    city: "",
    state: "",
    pincode: "",
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
    assignedCounselor: "",
    currentStatus: "Lead",
    remarks: "",
  });

  // Student Photo
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  // Populate form when editing or viewing an existing student
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        fullName: initialData.name || "",
        email: initialData.email || "",
        mobile: initialData.phone || "",
        // Map more fields when you store them in the student object
        // For now we only have a few fields in the table row
        preferredCountries: initialData.target ? [initialData.target] : [],
        currentStatus: initialData.status || "Lead",
        assignedCounselor: initialData.counselor || "",
        // If you later add origin, remarks, etc. to student → map them here
      }));

      // If you want to show existing photo in edit/view → you would need
      // to store photo URL in student object and set preview here
      // setPhotoPreview(initialData.photoUrl || null);
    } else {
      // Reset form when adding new student
      setForm({
        fullName: "",
        fatherName: "",
        motherName: "",
        dateOfBirth: "",
        gender: "",
        passportNumber: "",
        passportExpiry: "",
        mobile: "",
        whatsapp: "",
        email: "",
        currentAddress: "",
        city: "",
        state: "",
        pincode: "",
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
        assignedCounselor: "",
        currentStatus: "Lead",
        remarks: "",
      });
      setPhotoPreview(null);
      setPhotoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    if (isViewMode) return; // prevent changes in view mode

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isViewMode) return;

    if (!form.fullName || !form.email || !form.mobile) {
      alert("Please fill required fields: Full Name, Email, Mobile");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: form.fullName,
            email: form.email,
            phone: form.mobile,
            preferredCountry: form.preferredCountries[0],
            counselorStage: form.currentStatus.toLowerCase(),
            assignedCounselor: form.assignedCounselor,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create student");
        return;
      }

      // ✅ send backend response to parent
      onSuccess({
        ...form,
        leadId: data.leadId,
      });
    } catch (error) {
      console.error("Create error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Photo Upload */}
      <StudentPhotoUpload
        photoPreview={photoPreview}
        setPhotoPreview={setPhotoPreview}
        setPhotoFile={setPhotoFile}
        fileInputRef={fileInputRef}
        disabled={isViewMode}
      />

      {/* Sections – pass disabled prop where inputs exist */}
      <PersonalDetailsSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />
      <ContactInfoSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />
      <AcademicSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />
      <PreferenceSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />
      <TestsAndAdminSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          {isViewMode ? "Close" : "Cancel"}
        </button>

        {!isViewMode && (
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            {isEditMode ? "Update Student" : "Add Student"}
          </button>
        )}
      </div>
    </form>
  );
}
