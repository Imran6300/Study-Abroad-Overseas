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
        visaSuccessRate: initialData.visaSuccessRate || "",
        popularCourses: initialData.popularCourses || "",
        careerOpportunities: initialData.careerOpportunities || "",
        scholarships: initialData.scholarships || "",
        eligibilityRequirements: initialData.eligibilityRequirements || "",
        topUniversities: initialData.topUniversities || "",
        whyStudyCards:
          initialData.whyStudyCards?.length > 0
            ? initialData.whyStudyCards
            : [{ title: "", description: "" }],
      });
      setFlagPreview(initialData.flag || null);
      setPhotoPreview(initialData.image || null);
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Country name is required";
    if (!formData.continent.trim()) newErrors.continent = "Continent is required";
    if (!formData.capital.trim()) newErrors.capital = "Capital is required";
    if (!formData.visaSuccessRate.trim())
      newErrors.visaSuccessRate = "Visa success rate is required";

    if (!formData.popularCourses.trim())
      newErrors.popularCourses = "Popular courses required";
    if (!formData.careerOpportunities.trim())
      newErrors.careerOpportunities = "Career opportunities required";
    if (!formData.scholarships.trim())
      newErrors.scholarships = "Scholarships required";
    if (!formData.eligibilityRequirements.trim())
      newErrors.eligibilityRequirements = "Eligibility required";
    if (!formData.topUniversities.trim())
      newErrors.topUniversities = "Top universities required";

    formData.whyStudyCards.forEach((card, index) => {
      if (!card.description.trim()) {
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
      (card) => card.description.trim() !== ""
    );

    const finalFlagUrl = flagFile
      ? flagPreview
      : flagPreview || initialData?.flag || null;
    const finalPhotoUrl = photoFile
      ? photoPreview
      : photoPreview || initialData?.image || null;

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
      finalFlagUrl,
      finalPhotoUrl,
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

      <FormActions mode={mode} onCancel={onCancel} />
    </form>
  );
}