"use client";

import { useState, useEffect, useRef } from "react";

import CountryFlagUploadSection from "./countryform/CountryFlagUploadSection";
import CountryImageUpload from "./countryform/CountryImageUpload";
import CountryBasicInfo from "./countryform/CountryBasicInfo";
import WhyStudyCardsSection from "./countryform/WhyStudyCardsSection";
import FormActions from "./countryform/FormActions";

export default function AddCountryForm({
  mode = "add",
  initialData = null,
  onSuccess,
  onCancel,
  setMessageModal,
  submitting,
}) {
  const isViewMode = mode === "view";

  const [formData, setFormData] = useState({
    name: "",
    continent: "",
    capital: "",
    visaSuccessRate: "",
    popularCourses: "",
    careerOpportunities: "",
    scholarships: "",
    eligibilityRequirements: "",
    topUniversities: "",
    whyStudyCards: [{ title: "", description: "" }],
  });

  const [flagPreview, setFlagPreview] = useState(null);
  const [flagFile, setFlagFile] = useState(null);
  const flagInputRef = useRef(null);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        continent: initialData.continent || "",
        capital: initialData.capital || "",
        visaSuccessRate:
          initialData.visaSuccessRate !== undefined
            ? String(initialData.visaSuccessRate)
            : "",

        popularCourses: Array.isArray(initialData.popularCourses)
          ? initialData.popularCourses.join(", ")
          : "",

        careerOpportunities: Array.isArray(initialData.careerOpportunities)
          ? initialData.careerOpportunities.join(", ")
          : "",

        scholarships: Array.isArray(initialData.scholarships)
          ? initialData.scholarships.join(", ")
          : "",

        eligibilityRequirements: Array.isArray(
          initialData.eligibilityRequirements,
        )
          ? initialData.eligibilityRequirements.join(", ")
          : "",

        topUniversities: Array.isArray(initialData.topUniversities)
          ? initialData.topUniversities.join(", ")
          : "",

        whyStudyCards:
          initialData.whyStudyCards?.length > 0
            ? initialData.whyStudyCards
            : [{ title: "", description: "" }],
      });

      // FIX: Only set the preview URL for display purposes.
      // flagFile and photoFile remain null until the user actually picks a new file.
      // The backend handles the case where no new file is sent (keeps existing image).
      setFlagPreview(initialData.flagImage?.url || null);
      setPhotoPreview(initialData.heroImage?.url || null);

      // Reset file states when switching to a different country
      setFlagFile(null);
      setPhotoFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...formData.whyStudyCards];
    newCards[index][field] = value;
    setFormData((prev) => ({ ...prev, whyStudyCards: newCards }));

    const errorKey = `whyStudyCards_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[errorKey];
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
    if (formData.whyStudyCards.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      whyStudyCards: prev.whyStudyCards.filter((_, i) => i !== index),
    }));
  };

  const isEmpty = (value) =>
    value === undefined || value === null || String(value).trim() === "";

  const validateForm = () => {
    const newErrors = {};

    if (isEmpty(formData.name)) newErrors.name = "Country name is required";

    if (isEmpty(formData.continent))
      newErrors.continent = "Continent is required";

    if (isEmpty(formData.capital)) newErrors.capital = "Capital is required";

    if (
      formData.visaSuccessRate === "" ||
      isNaN(Number(formData.visaSuccessRate))
    ) {
      newErrors.visaSuccessRate = "Valid visa success rate is required";
    }

    if (isEmpty(formData.popularCourses))
      newErrors.popularCourses = "Popular courses required";

    if (isEmpty(formData.careerOpportunities))
      newErrors.careerOpportunities = "Career opportunities required";

    if (isEmpty(formData.scholarships))
      newErrors.scholarships = "Scholarships required";

    if (isEmpty(formData.eligibilityRequirements))
      newErrors.eligibilityRequirements = "Eligibility required";

    if (isEmpty(formData.topUniversities))
      newErrors.topUniversities = "Top universities required";

    // FIX: In "add" mode, both images are mandatory.
    // In "edit" mode, they are optional (keeping existing if not changed).
    if (mode === "add") {
      if (!flagFile) newErrors.flagImage = "Flag image is required";
      if (!photoFile) newErrors.heroImage = "Country hero image is required";
    }

    formData.whyStudyCards.forEach((card, index) => {
      if (!card.description || card.description.trim() === "") {
        newErrors[`whyStudyCards_${index}_description`] =
          `Description required for card ${index + 1}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;
    if (!validateForm()) return;

    const cleanedCards = formData.whyStudyCards.filter(
      (card) => card.description.trim() !== "",
    );

    // FIX: Pass the actual File objects (flagFile / photoFile) to the parent.
    // If the user didn't pick a new file (null), the parent will simply not
    // append them to FormData and the backend will keep the existing images.
    // NEVER pass the preview URL string — multer ignores plain strings and
    // the backend will see an empty req.files, causing upload failures.
    onSuccess({
      name: formData.name,
      continent: formData.continent,
      capital: formData.capital,
      visaSuccessRate: formData.visaSuccessRate,
      popularCourses: formData.popularCourses,
      careerOpportunities: formData.careerOpportunities,
      scholarships: formData.scholarships,
      eligibilityRequirements: formData.eligibilityRequirements,
      topUniversities: formData.topUniversities,
      whyStudyCards: cleanedCards,
      flagImage: flagFile || null, // File object or null — never a URL string
      heroImage: photoFile || null, // File object or null — never a URL string
    });
  };

  const onError = (msg) => {
    setMessageModal({
      open: true,
      type: "error",
      message: msg,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <CountryFlagUploadSection
        flagPreview={flagPreview}
        setFlagPreview={setFlagPreview}
        setFlagFile={setFlagFile}
        fileInputRef={flagInputRef}
        isViewMode={isViewMode}
      />

      {!isViewMode && (
        <CountryImageUpload
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          setPhotoFile={setPhotoFile}
          fileInputRef={fileInputRef}
          onError={onError}
        />
      )}

      {isViewMode && photoPreview && (
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Country Image
          </p>
          <img
            src={photoPreview}
            alt={formData.name || "Country"}
            className="w-64 h-40 mx-auto rounded-xl object-cover border border-gray-200 shadow-md"
          />
        </div>
      )}

      <CountryBasicInfo
        formData={formData}
        onChange={handleChange}
        errors={errors}
        isViewMode={isViewMode}
      />

      <WhyStudyCardsSection
        cards={formData.whyStudyCards}
        countryName={formData.name || "[Country]"}
        onCardChange={handleCardChange}
        onAddCard={addCard}
        onRemoveCard={removeCard}
        errors={errors}
        isViewMode={isViewMode}
      />

      <FormActions mode={mode} onCancel={onCancel} submitting={submitting} />
    </form>
  );
}
