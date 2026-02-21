// components/adminform/add-success-story.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import StudentPhotoUpload from "@/components/adminform/studentform/StudentPhotoUpload";

export default function AddSuccessStoryForm({
  mode = "add",
  initialData = null,
  onSuccess,
  onCancel,
  submitting = false,
}) {
  const isViewMode = mode === "view";

  const [formData, setFormData] = useState({
    // Page title/subtitle
    pageTitle: "",
    pageSubtitle: "",

    // Page stats (numbers)
    studentsPlaced: 0,
    visaSuccessRate: 0,
    partnerUniversities: 0,
    scholarshipsSecured: 0,

    // Student info
    studentName: "",
    university: "",
    course: "",
    country: "",
    visaStatus: "Approved",
    scholarship: "",
    year: 0,
    // Content
    excerpt: "",
    fullDescription: "",
    published: true,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        pageTitle: initialData.pageTitle || "",
        pageSubtitle: initialData.pageSubtitle || "",
        studentsPlaced: initialData.studentsPlaced || 0,
        visaSuccessRate: initialData.visaSuccessRate || 0,
        partnerUniversities: initialData.partnerUniversities || 0,
        scholarshipsSecured: initialData.scholarshipsSecured || 0,
        studentName: initialData.studentName || "",
        university: initialData.university || "",
        course: initialData.course || "",
        country: initialData.country || "",
        scholarship: initialData.scholarship || "",
        year: initialData.year || 0,
        visaStatus: initialData.visaStatus || "Approved",
        excerpt: initialData.excerpt || "",
        fullDescription: initialData.fullDescription || "",
        published: initialData.published ?? true,
      });
      if (initialData.photo?.url) {
        setPhotoPreview(initialData.photo.url);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Title/Subtitle validation
    if (!formData.pageTitle.trim()) newErrors.pageTitle = "Page title required";
    if (!formData.pageSubtitle.trim())
      newErrors.pageSubtitle = "Page subtitle required";

    // Stats validation (optional but must be numbers)
    if (isNaN(formData.studentsPlaced) || formData.studentsPlaced < 0) {
      newErrors.studentsPlaced = "Must be valid number";
    }
    if (
      isNaN(formData.visaSuccessRate) ||
      formData.visaSuccessRate < 0 ||
      formData.visaSuccessRate > 100
    ) {
      newErrors.visaSuccessRate = "Must be 0-100";
    }
    if (
      isNaN(formData.partnerUniversities) ||
      formData.partnerUniversities < 0
    ) {
      newErrors.partnerUniversities = "Must be valid number";
    }
    if (
      isNaN(formData.scholarshipsSecured) ||
      formData.scholarshipsSecured < 0
    ) {
      newErrors.scholarshipsSecured = "Must be valid number";
    }

    // Required fields
    if (!formData.studentName.trim()) newErrors.studentName = "Required";
    if (!formData.university.trim()) newErrors.university = "Required";
    if (!formData.course.trim()) newErrors.course = "Required";
    if (!formData.country.trim()) newErrors.country = "Required";
    if (!formData.excerpt.trim())
      newErrors.excerpt = "Short testimonial required";
    if (!formData.fullDescription.trim())
      newErrors.fullDescription = "Full story required";

    if (mode === "add" && !photoFile) {
      newErrors.photo = "Student photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;
    if (!validateForm()) return;

    onSuccess({
      ...formData,
      photoFile,
    });
  };

  // Status options with DeadlineForm colors
  const visaStatusOptions = [
    {
      value: "Approved",
      label: "✅ Approved",
      color:
        "bg-green-100 text-green-800 border-green-200 hover:border-green-300",
    },
    {
      value: "Processing",
      label: "⏳ Processing",
      color:
        "bg-yellow-100 text-yellow-800 border-yellow-200 hover:border-yellow-300",
    },
    {
      value: "Pending",
      label: "⏳ Pending",
      color: "bg-blue-100 text-blue-800 border-blue-200 hover:border-blue-300",
    },
    {
      value: "Rejected",
      label: "❌ Rejected",
      color: "bg-red-100 text-red-800 border-red-200 hover:border-red-300",
    },
  ];

  const currentVisaStatusStyle =
    visaStatusOptions.find((s) => s.value === formData.visaStatus)?.color ||
    "bg-gray-100 text-gray-800 border-gray-200 hover:border-gray-300";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-200"
    >
      {/* NEW: Page Title & Subtitle Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Edit Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pageTitle"
            value={formData.pageTitle}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-4 py-3 text-xl rounded-lg border border-gray-300 font-bold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.pageTitle ? "border-red-300 bg-red-50" : "hover:border-gray-400"} disabled:bg-gray-50`}
            placeholder="e.g. Success Stories 2026"
          />
          {errors.pageTitle && (
            <p className="text-red-600 font-medium mt-2">{errors.pageTitle}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Edit Subtitle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pageSubtitle"
            value={formData.pageSubtitle}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-semibold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.pageSubtitle ? "border-red-300 bg-red-50" : "hover:border-gray-400"} disabled:bg-gray-50`}
            placeholder="e.g. 500+ Students Placed | 98% Visa Success"
          />
          {errors.pageSubtitle && (
            <p className="text-red-600 font-medium mt-2">
              {errors.pageSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Page Stats Section - Clean DeadlineForm Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-8 rounded-xl border border-gray-200">
        <div className="text-center">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            Students Placed
          </label>
          <input
            type="number"
            name="studentsPlaced"
            value={formData.studentsPlaced}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-24 mx-auto text-2xl font-black text-sky-600 bg-transparent border-0 focus:ring-2 focus:ring-sky-500 p-0 ${errors.studentsPlaced ? "text-red-600" : ""}`}
            min="0"
          />
          {errors.studentsPlaced && (
            <p className="text-red-600 text-xs mt-1">{errors.studentsPlaced}</p>
          )}
        </div>

        <div className="text-center">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            Visa Success Rate
          </label>
          <div className="flex items-center justify-center">
            <input
              type="number"
              name="visaSuccessRate"
              value={formData.visaSuccessRate}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-20 text-2xl font-black text-sky-600 bg-transparent border-0 focus:ring-2 focus:ring-sky-500 p-0 pr-0 ${errors.visaSuccessRate ? "text-red-600" : ""}`}
              min="0"
              max="100"
            />
            <span className="ml-1 text-lg font-semibold text-gray-500">%</span>
          </div>
          {errors.visaSuccessRate && (
            <p className="text-red-600 text-xs mt-1">
              {errors.visaSuccessRate}
            </p>
          )}
        </div>

        <div className="text-center">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            Partner Universities
          </label>
          <input
            type="number"
            name="partnerUniversities"
            value={formData.partnerUniversities}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-24 mx-auto text-2xl font-black text-sky-600 bg-transparent border-0 focus:ring-2 focus:ring-sky-500 p-0 ${errors.partnerUniversities ? "text-red-600" : ""}`}
            min="0"
          />
          {errors.partnerUniversities && (
            <p className="text-red-600 text-xs mt-1">
              {errors.partnerUniversities}
            </p>
          )}
        </div>

        <div className="text-center">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            Scholarships Secured
          </label>
          <input
            type="number"
            name="scholarshipsSecured"
            value={formData.scholarshipsSecured}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-24 mx-auto text-2xl font-black text-sky-600 bg-transparent border-0 focus:ring-2 focus:ring-sky-500 p-0 ${errors.scholarshipsSecured ? "text-red-600" : ""}`}
            min="0"
          />
          {errors.scholarshipsSecured && (
            <p className="text-red-600 text-xs mt-1">
              {errors.scholarshipsSecured}
            </p>
          )}
        </div>
      </div>

      {/* Student Photo + Name - Hero Section */}
      {!isViewMode && (
        <StudentPhotoUpload
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          setPhotoFile={setPhotoFile}
          fileInputRef={fileInputRef}
        />
      )}

      {isViewMode && photoPreview && (
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="w-32 h-32 mx-auto mb-6">
            <img
              src={photoPreview}
              alt={formData.studentName}
              className="w-full h-full rounded-xl object-cover border-4 border-gray-200 shadow-md"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {formData.studentName}
          </h1>
          <p className="text-xl font-semibold text-gray-700">
            {formData.course} at {formData.university}
          </p>

          {/* Show title/subtitle in view mode */}
          {formData.pageTitle && (
            <p className="text-2xl font-bold text-sky-600 mt-4">
              {formData.pageTitle}
            </p>
          )}
          {formData.pageSubtitle && (
            <p className="text-lg text-gray-600 mt-1">
              {formData.pageSubtitle}
            </p>
          )}
        </div>
      )}

      {/* Rest of the form remains exactly the same... */}
      {/* Student Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-semibold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.studentName ? "border-red-300 bg-red-50" : "hover:border-gray-400"} disabled:bg-gray-50`}
            placeholder="Full Name"
          />
          {errors.studentName && (
            <p className="text-red-600 font-medium mt-2">
              {errors.studentName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Course/Program <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-semibold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.course ? "border-red-300 bg-red-50" : "hover:border-gray-400"} disabled:bg-gray-50`}
            placeholder="MSc Computer Science"
          />
          {errors.course && (
            <p className="text-red-600 font-medium mt-2">{errors.course}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            University <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-semibold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.university ? "border-red-300 bg-red-50" : "hover:border-gray-400"} disabled:bg-gray-50`}
            placeholder="University of Toronto"
          />
          {errors.university && (
            <p className="text-red-600 font-medium mt-2">{errors.university}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-semibold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.country ? "border-red-300 bg-red-50" : "hover:border-gray-400"} disabled:bg-gray-50`}
            placeholder="Canada"
          />
          {errors.country && (
            <p className="text-red-600 font-medium mt-2">{errors.country}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Visa Status
          </label>
          <select
            name="visaStatus"
            value={formData.visaStatus}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-4 py-3 text-lg rounded-lg border font-semibold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 ${currentVisaStatusStyle}`}
          >
            {visaStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Scholarship Amount
          </label>
          <input
            type="text"
            name="scholarship"
            value={formData.scholarship}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-semibold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:border-gray-400 disabled:bg-gray-50"
            placeholder="CAD 25,000 / Full Tuition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Course Duration
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-semibold shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:border-gray-400 disabled:bg-gray-50"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-4 bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
          Short Testimonial <span className="text-red-500">*</span>
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          disabled={isViewMode}
          rows={3}
          className={`w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-medium shadow-sm resize-vertical focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
            errors.excerpt
              ? "border-red-300 bg-red-50"
              : "hover:border-gray-400"
          } disabled:bg-gray-50`}
          placeholder="Write a short testimonial summary..."
        />
        {errors.excerpt && (
          <p className="text-red-600 font-medium mt-2">{errors.excerpt}</p>
        )}
      </div>

      {/* Full Success Story */}
      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-4 bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
          Complete Success Story <span className="text-red-500">*</span>
        </label>
        <textarea
          name="fullDescription"
          value={formData.fullDescription}
          onChange={handleChange}
          disabled={isViewMode}
          rows={10}
          className={`w-full px-4 py-3 text-lg rounded-lg border border-gray-300 font-medium shadow-sm resize-vertical focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.fullDescription ? "border-red-300 bg-red-50" : "hover:border-gray-400"} disabled:bg-gray-50`}
          placeholder="Tell the complete journey: How you found Khizar Overseas, challenges faced, documents prepared, interview experience, final results, and advice for future students..."
        />
        {errors.fullDescription && (
          <p className="text-red-600 font-medium text-lg mt-3 bg-red-50 p-3 rounded-lg border border-red-200">
            {errors.fullDescription}
          </p>
        )}
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          name="published"
          checked={formData.published}
          onChange={handleChange}
          disabled={isViewMode}
          className="h-6 w-6 text-sky-600 border-2 border-gray-300 rounded focus:ring-sky-500 bg-white shadow-sm"
        />
        <label className="ml-4 text-lg font-semibold text-gray-800">
          Publish on Success Stories Page
        </label>
      </div>

      {/* Action Buttons */}
      {!isViewMode && (
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-8 py-3 rounded-xl font-semibold shadow-md transition-all ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white"
            }`}
          >
            {submitting
              ? mode === "add"
                ? "Adding..."
                : "Updating..."
              : mode === "add"
                ? "Add Success Story"
                : "Update Story"}
          </button>
        </div>
      )}

      {isViewMode && (
        <div className="flex justify-end pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all shadow-sm hover:shadow-md"
          >
            ❌ Close
          </button>
        </div>
      )}
    </form>
  );
}
