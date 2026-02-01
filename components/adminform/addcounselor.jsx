// components/adminform/counselors/AddCounselorForm.jsx
"use client";

import { useState, useRef, useEffect } from "react";

import CounselorPhotoUpload from "./counselorform/CounselorPhotoUpload";
import PersonalDetailsSection from "./counselorform/PersonalDetailSection";
import ContactInfoSection from "./counselorform/ContactInfoSection";
import WorkInfoSection from "./counselorform/WorkInfoSection";
import AccountAndAccessSection from "./counselorform/AccountAndAccessSection";

export default function AddCounselorForm({
  mode = "add",
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    employeeId: "",
    joiningDate: "",
    specialization: "",
    languages: [],
    yearsOfExperience: "",
    linkedIn: "",
    certifications: "",
    status: "Active",
    role: "Counselor",
    username: "",
    remarks: "",
    // password is intentionally NOT stored in form state for security
    // We handle it only in submit when mode === "add"
  });

  // Counselor Photo
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  // Populate form when editing or viewing an existing counselor
  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.name || "",
        email: initialData.email || "",
        mobile: initialData.phone || "",
        whatsapp: initialData.whatsapp || "",
        dateOfBirth: initialData.dateOfBirth || "",
        gender: initialData.gender || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        employeeId: initialData.employeeId || "",
        joiningDate: initialData.joiningDate || "",
        specialization: initialData.specialization || "",
        languages: initialData.languages || [],
        yearsOfExperience: initialData.yearsOfExperience || "",
        linkedIn: initialData.linkedIn || "",
        certifications: initialData.certifications || "",
        status: initialData.status || "Active",
        role: initialData.role || "Counselor",
        username: initialData.username || initialData.email || "",
        remarks: initialData.remarks || "",
      });
      // If you later store photo URL in initialData → uncomment:
      // setPhotoPreview(initialData.photoUrl || null);
    } else {
      // Reset form for adding new counselor
      setForm({
        fullName: "",
        email: "",
        mobile: "",
        whatsapp: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        employeeId: "",
        joiningDate: "",
        specialization: "",
        languages: [],
        yearsOfExperience: "",
        linkedIn: "",
        certifications: "",
        status: "Active",
        role: "Counselor",
        username: "",
        remarks: "",
      });
      setPhotoPreview(null);
      setPhotoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    if (isViewMode) return;

    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "languages") {
      setForm((prev) => ({
        ...prev,
        languages: checked
          ? [...prev.languages, value]
          : prev.languages.filter((lang) => lang !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isViewMode) return;

    // Basic validation
    if (!form.fullName || !form.email || !form.mobile) {
      alert("Please fill required fields: Full Name, Email, Mobile");
      return;
    }

    // Prepare data to submit
    const submitData = { ...form };

    // Only include password when creating a new counselor
    if (mode === "add") {
      if (!form.password) {
        alert("Please set a password for the new counselor");
        return;
      }
      submitData.password = form.password;
    } else {
      // Never send password when editing
      delete submitData.password;
    }

    // Attach photo file
    submitData.counselorPhoto = photoFile;

    console.log("Submitting counselor data:", submitData);
    onSuccess(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ===================== PHOTO UPLOAD ===================== */}
      <CounselorPhotoUpload
        photoPreview={photoPreview}
        setPhotoPreview={setPhotoPreview}
        setPhotoFile={setPhotoFile}
        fileInputRef={fileInputRef}
        disabled={isViewMode}
      />

      {/* ===================== PERSONAL DETAILS ===================== */}
      <PersonalDetailsSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />

      {/* ===================== CONTACT INFO ===================== */}
      <ContactInfoSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />

      {/* ===================== WORK / PROFESSIONAL INFO ===================== */}
      <WorkInfoSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />

      {/* ===================== ACCOUNT & ACCESS ===================== */}
      <AccountAndAccessSection
        form={form}
        handleChange={handleChange}
        disabled={isViewMode}
      />

      {/* ===================== ACTION BUTTONS ===================== */}
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
            {isEditMode ? "Update Counselor" : "Add Counselor"}
          </button>
        )}
      </div>
    </form>
  );
}