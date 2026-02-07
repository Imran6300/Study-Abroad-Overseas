// components/adminform/add-country.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import StudentPhotoUpload from "@/components/adminform/studentform/StudentPhotoUpload";

export default function AddCountryForm({
  mode = "add",           // "add" | "edit" | "view"
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const isViewMode = mode === "view";

  const [formData, setFormData] = useState({
    name: "",
    image: "", // final URL after upload
    popularCourses: "",
    careerOpportunities: "",
    scholarships: "",
    eligibilityRequirements: "",
    topUniversities: "",
    whyStudyCards: [{ title: "", description: "" }], // start with 1 card
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  // Load existing data in edit/view mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        popularCourses: initialData.popularCourses || "",
        careerOpportunities: initialData.careerOpportunities || "",
        scholarships: initialData.scholarships || "",
        eligibilityRequirements: initialData.eligibilityRequirements || "",
        topUniversities: initialData.topUniversities || "",
        whyStudyCards: initialData.whyStudyCards?.length > 0 
          ? initialData.whyStudyCards 
          : [{ title: "", description: "" }],
      });
      if (initialData.image) setPhotoPreview(initialData.image);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Dynamic card handlers
  const handleCardChange = (index, field, value) => {
    const newCards = [...formData.whyStudyCards];
    newCards[index][field] = value;
    setFormData((prev) => ({ ...prev, whyStudyCards: newCards }));

    if (errors[`whyStudyCards_${index}_${field}`]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[`whyStudyCards_${index}_${field}`];
        return updated;
      });
    }
  };

  const addCard = () => {
    setFormData((prev) => ({
      ...prev,
      whyStudyCards: [...prev.whyStudyCards, { title: "", description: "" }],
    }));
  };

  const removeCard = (index) => {
    if (formData.whyStudyCards.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      whyStudyCards: prev.whyStudyCards.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Country name is required";
    if (!formData.popularCourses.trim()) newErrors.popularCourses = "Popular courses required";
    if (!formData.careerOpportunities.trim()) newErrors.careerOpportunities = "Career opportunities required";
    if (!formData.scholarships.trim()) newErrors.scholarships = "Scholarships required";
    if (!formData.eligibilityRequirements.trim()) newErrors.eligibilityRequirements = "Eligibility required";
    if (!formData.topUniversities.trim()) newErrors.topUniversities = "Top universities required";

    // Validate each why-study card
    formData.whyStudyCards.forEach((card, index) => {
      if (!card.description.trim()) {
        newErrors[`whyStudyCards_${index}_description`] = `Description required for card ${index + 1}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;
    if (!validateForm()) return;

    // Filter out completely empty cards
    const cleanedCards = formData.whyStudyCards.filter(
      (card) => card.description.trim() !== ""
    );

    onSuccess({
      ...formData,
      whyStudyCards: cleanedCards,
      photoFile,
      photoPreview,
      existingPhotoUrl: !photoFile && photoPreview ? photoPreview : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Country Image */}
      {!isViewMode && (
        <StudentPhotoUpload
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          setPhotoFile={setPhotoFile}
          fileInputRef={fileInputRef}
        />
      )}

      {isViewMode && photoPreview && (
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-gray-700 mb-3">Country Image</p>
          <img
            src={photoPreview}
            alt={formData.name}
            className="w-64 h-40 mx-auto rounded-xl object-cover border border-gray-200 shadow-md"
          />
        </div>
      )}

      {/* Country Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isViewMode}
          className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100`}
          placeholder="e.g. United States of America"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Popular Courses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Popular Courses (comma-separated) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="popularCourses"
          value={formData.popularCourses}
          onChange={handleChange}
          disabled={isViewMode}
          className={`w-full px-4 py-3 rounded-xl border ${errors.popularCourses ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100`}
          placeholder="e.g. Computer Science, Business Administration, Engineering, Medicine"
        />
        {errors.popularCourses && <p className="mt-1 text-sm text-red-600">{errors.popularCourses}</p>}
      </div>

      {/* Career Opportunities - now single line, comma-separated */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Career Opportunities (comma-separated) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="careerOpportunities"
          value={formData.careerOpportunities}
          onChange={handleChange}
          disabled={isViewMode}
          className={`w-full px-4 py-3 rounded-xl border ${errors.careerOpportunities ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100`}
          placeholder="e.g. High-paying tech jobs, Post-study work visa up to 3 years, OPT extension, Strong finance sector"
        />
        {errors.careerOpportunities && <p className="mt-1 text-sm text-red-600">{errors.careerOpportunities}</p>}
      </div>

      {/* Scholarships - comma-separated */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scholarships (comma-separated) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="scholarships"
          value={formData.scholarships}
          onChange={handleChange}
          disabled={isViewMode}
          className={`w-full px-4 py-3 rounded-xl border ${errors.scholarships ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100`}
          placeholder="e.g. Fulbright Scholarship, University merit awards, Government grants, Need-based aid"
        />
        {errors.scholarships && <p className="mt-1 text-sm text-red-600">{errors.scholarships}</p>}
      </div>

      {/* Eligibility Requirements - comma-separated */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Eligibility Requirements (comma-separated) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="eligibilityRequirements"
          value={formData.eligibilityRequirements}
          onChange={handleChange}
          disabled={isViewMode}
          className={`w-full px-4 py-3 rounded-xl border ${errors.eligibilityRequirements ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100`}
          placeholder="e.g. Bachelor’s degree, IELTS 6.5+, GPA 3.0+, Financial proof, Valid passport"
        />
        {errors.eligibilityRequirements && <p className="mt-1 text-sm text-red-600">{errors.eligibilityRequirements}</p>}
      </div>

      {/* Why Study Cards - Dynamic */}
      <div className="space-y-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Why Study in {formData.name || "[Country]"} Cards
          </h3>
          {!isViewMode && (
            <button
              type="button"
              onClick={addCard}
              className="px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium flex items-center gap-2"
            >
              + Add New Card
            </button>
          )}
        </div>

        {formData.whyStudyCards.length > 0 ? (
          <div className="space-y-8">
            {formData.whyStudyCards.map((card, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative"
              >
                <div className="flex justify-between items-center mb-5">
                  <h4 className="text-lg font-medium text-gray-800">
                    Card {index + 1}
                  </h4>
                  {!isViewMode && formData.whyStudyCards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Remove Card
                    </button>
                  )}
                </div>

                {/* Card Title */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleCardChange(index, "title", e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
                    placeholder="e.g. World-Class Education & Innovation"
                  />
                </div>

                {/* Card Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Description / Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={card.description}
                    onChange={(e) => handleCardChange(index, "description", e.target.value)}
                    disabled={isViewMode}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border ${errors[`whyStudyCards_${index}_description`] ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100`}
                    placeholder="Detailed explanation of this benefit or feature..."
                  />
                  {errors[`whyStudyCards_${index}_description`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`whyStudyCards_${index}_description`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isViewMode && (
            <p className="text-center text-gray-500 py-8">
              No cards added yet. Click "Add New Card" to create content.
            </p>
          )
        )}
      </div>

      {/* Top Universities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Top Universities (comma-separated) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="topUniversities"
          value={formData.topUniversities}
          onChange={handleChange}
          disabled={isViewMode}
          className={`w-full px-4 py-3 rounded-xl border ${errors.topUniversities ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100`}
          placeholder="e.g. Harvard University, Stanford University, MIT, UC Berkeley"
        />
        {errors.topUniversities && <p className="mt-1 text-sm text-red-600">{errors.topUniversities}</p>}
      </div>

      {/* Buttons */}
      {!isViewMode && (
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium shadow-sm"
          >
            {mode === "add" ? "Add Country" : "Update Country"}
          </button>
        </div>
      )}

      {isViewMode && (
        <div className="flex justify-end pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      )}
    </form>
  );
}