"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function DeadlineForm({
  mode = "add",
  initialData = null,
  onSubmit,
  onCancel,
  saving,
}) {
  const isView = mode === "view";

  const [form, setForm] = useState({
    title: "",
    description: "",

    dueDate: "",

    category: "other",

    priority: "medium",

    requiresDocumentUpload: false,

    requiredDocumentType: "",

    customDocumentType: "",
  });

  const submitForm = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      title: form.title,

      description: form.description,

      dueDate: form.dueDate,

      category: form.category,

      priority: form.priority,

      requiresDocumentUpload: form.requiresDocumentUpload,

      requiredDocumentType: form.requiresDocumentUpload
        ? form.requiredDocumentType === "other"
          ? form.customDocumentType
          : form.requiredDocumentType
        : null,
    };

    onSubmit(payload);
  };

  const [errors, setErrors] = useState({});

  // =========================
  // CATEGORY OPTIONS
  // =========================

  const categoryOptions = [
    "document",
    "application",
    "payment",
    "interview",
    "visa",
    "scholarship",
    "sop",
    "lor",
    "test",
    "financial",
    "university",
    "other",
  ];

  // =========================
  // PRIORITY OPTIONS
  // =========================

  const priorityOptions = ["low", "medium", "high", "urgent"];

  // =========================
  // DOCUMENT OPTIONS
  // =========================

  const documentTypeOptions = [
    "passport",
    "resume",
    "marksheet",
    "ielts",
    "toefl",
    "pte",
    "sop",
    "lor",
    "financial_statement",
    "visa_document",
    "other",
  ];

  // =========================
  // LOAD EDIT DATA
  // =========================

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",

        description: initialData.description || "",

        dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",

        category: initialData.category || "other",

        priority: initialData.priority || "medium",

        requiresDocumentUpload: initialData.requiresDocumentUpload || false,

        requiredDocumentType: documentTypeOptions.includes(
          initialData.requiredDocumentType,
        )
          ? initialData.requiredDocumentType
          : "other",

        customDocumentType:
          initialData.requiredDocumentType &&
          !documentTypeOptions.includes(initialData.requiredDocumentType)
            ? initialData.requiredDocumentType
            : "",
      });
    }
  }, [initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    if (isView) return;

    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (form.requiresDocumentUpload && !form.requiredDocumentType) {
      newErrors.requiredDocumentType = "Document type is required";
    }

    if (
      form.requiredDocumentType === "other" &&
      !form.customDocumentType.trim()
    ) {
      newErrors.customDocumentType = "Custom document type is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <form onSubmit={submitForm} className="space-y-8">
      {/* CORE FIELDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TITLE */}

        <div>
          <label className="block text-sm font-medium mb-1">
            Deadline Title *
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            disabled={isView}
            placeholder="e.g. Upload Passport"
            className="w-full px-4 py-3 border rounded-xl"
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* DUE DATE */}

        <div>
          <label className="block text-sm font-medium mb-1">Due Date *</label>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            disabled={isView}
            className="w-full px-4 py-3 border rounded-xl"
          />

          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
          )}
        </div>

        {/* CATEGORY */}

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            disabled={isView}
            className="w-full px-4 py-3 border rounded-xl"
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* PRIORITY */}

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            disabled={isView}
            className="w-full px-4 py-3 border rounded-xl"
          >
            {priorityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DESCRIPTION */}

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={isView}
          rows={4}
          placeholder="Add extra instructions..."
          className="w-full px-4 py-3 border rounded-xl resize-none"
        />
      </div>

      {/* DOCUMENT REQUIREMENT */}

      <div className="space-y-5 border rounded-2xl p-5">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="requiresDocumentUpload"
            checked={form.requiresDocumentUpload}
            onChange={handleChange}
            disabled={isView}
          />

          <span className="font-medium">Requires Document Upload</span>
        </label>

        {/* DOCUMENT TYPE */}

        {form.requiresDocumentUpload && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Required Document Type
            </label>

            <select
              name="requiredDocumentType"
              value={form.requiredDocumentType}
              onChange={handleChange}
              disabled={isView}
              className="w-full px-4 py-3 border rounded-xl"
            >
              <option value="">Select Document Type</option>

              {documentTypeOptions.map((doc) => (
                <option key={doc} value={doc}>
                  {doc.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            {errors.requiredDocumentType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.requiredDocumentType}
              </p>
            )}
          </div>
        )}

        {/* CUSTOM DOCUMENT TYPE */}

        {form.requiredDocumentType === "other" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Custom Document Type
            </label>

            <input
              type="text"
              name="customDocumentType"
              value={form.customDocumentType}
              onChange={handleChange}
              disabled={isView}
              placeholder="Enter custom document type"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {errors.customDocumentType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.customDocumentType}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border rounded-xl"
        >
          {isView ? "Close" : "Cancel"}
        </button>

        {!isView && (
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-sky-600 text-white rounded-xl disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : initialData
                ? "Update Deadline"
                : "Create Deadline"}
          </button>
        )}
      </div>
    </form>
  );
}
