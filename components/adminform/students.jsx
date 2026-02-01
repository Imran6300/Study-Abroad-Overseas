// components/adminform/AddStudentForm.jsx
"use client";

import { useState, useRef } from "react";

import StudentPhotoUpload from "./studentform/StudentPhotoUpload";
import PersonalDetailsSection from "./studentform/PersonalDetailsSection"
import ContactInfoSection from "./studentform/ContactInfoSection"
import AcademicSection from "./studentform/AcademicSection"
import PreferenceSection from "./studentform/PreferencesSection";
import TestsAndAdminSection from "./studentform/TestsAndAdminSection";

export default function AddStudentForm({ onSuccess, onCancel }) {
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

  // ──── Student Photo State ────
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
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



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.mobile) {
      alert("Please fill required fields: Full Name, Email, Mobile");
      return;
    }

    // Prepare data to send (you can include photoFile in FormData later)
    const submitData = { ...form, studentPhoto: photoFile };

    console.log("Submitting new student:", submitData);

    onSuccess(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ===================== PHOTO UPLOAD SECTION ===================== */}
      <StudentPhotoUpload photoPreview={photoPreview} setPhotoPreview={setPhotoPreview} setPhotoFile={setPhotoFile} fileInputRef={fileInputRef}/>

      {/* ===================== PERSONAL DETAILS ===================== */}
      <PersonalDetailsSection form={form} handleChange={handleChange}/>
      {/* ===================== CONTACT ===================== */}
      <ContactInfoSection form={form} handleChange={handleChange}/>

      {/* ===================== ACADEMIC ===================== */}
      <AcademicSection form={form} handleChange={handleChange}/>

      {/* ===================== PREFERENCES ===================== */}
      <PreferenceSection form={form} handleChange={handleChange}/>

      {/* ===================== TESTS & ADMIN INFO ===================== */}
      <TestsAndAdminSection form={form} handleChange={handleChange}/>

      {/* BUTTONS */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Add Student
        </button>
      </div>
    </form>
  );
}

