// components/adminform/deadline/DeadlineForm.jsx
"use client";

import { useState, useEffect } from "react";

export default function DeadlineForm({
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
    type: "",
    deadlineDate: "",
    university: "",
    country: "",
    counselor: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        studentName: initialData.studentName || "",
        type: initialData.type || "",
        deadlineDate: initialData.deadlineDate || "",
        university: initialData.university || "",
        country: initialData.country || "",
        counselor: initialData.counselor || "",
        status: initialData.status || "Pending",
      }));
    } else if (isAdd) {
      setForm((prev) => ({ ...prev, status: "Pending" }));
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.studentName.trim()) newErrors.studentName = "Required";
    if (!form.type.trim()) newErrors.type = "Required";
    if (!form.deadlineDate) newErrors.deadlineDate = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isView) return;
    if (!validateForm()) return;

    onSuccess(form);
  };

  // Status options with colors
  const statusOptions = [
    { value: "Pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "In Progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
    { value: "Done", label: "Done", color: "bg-green-100 text-green-800" },
    { value: "Overdue", label: "Overdue", color: "bg-red-100 text-red-800" },
    { value: "Cancelled", label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  ];

  const currentStatusStyle = statusOptions.find(s => s.value === form.status)?.color || "bg-gray-100 text-gray-800";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Prominent Status Updater */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {isAdd ? "Initial Status" : isEdit ? "Update Status" : "Current Status"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isView ? "Status of this deadline" : "Change status if needed"}
            </p>
          </div>

          {isView ? (
            <span className={`px-6 py-2.5 rounded-full text-base font-medium ${currentStatusStyle}`}>
              {form.status}
            </span>
          ) : (
            <div className="w-full sm:w-80">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl text-base font-medium focus:ring-2 focus:ring-sky-500 bg-white transition-all ${currentStatusStyle}`}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Core Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
          {isView ? (
            <p className="font-medium">{form.studentName || "—"}</p>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          {isView ? (
            <p className="font-medium">{form.type || "—"}</p>
          ) : (
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-sky-500"
              required
              placeholder="e.g. University Application, Visa Biometrics"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Date *</label>
          {isView ? (
            <p className="font-medium">
              {form.deadlineDate ? new Date(form.deadlineDate).toLocaleDateString("en-IN") : "—"}
            </p>
          ) : (
            <input
              type="date"
              name="deadlineDate"
              value={form.deadlineDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
          {isView ? (
            <p className="font-medium">{form.university || "—"}</p>
          ) : (
            <input
              name="university"
              value={form.university}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-sky-500"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          {isView ? (
            <p className="font-medium">{form.country || "—"}</p>
          ) : (
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-sky-500"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Counselor</label>
          {isView ? (
            <p className="font-medium">{form.counselor || "Unassigned"}</p>
          ) : (
            <input
              name="counselor"
              value={form.counselor}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-sky-500"
            />
          )}
        </div>
      </div>

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
            {isAdd ? "Add Reminder" : "Update Deadline"}
          </button>
        )}
      </div>
    </form>
  );
}