"use client";

import { useState } from "react";

export default function ScholarshipForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    current_level: "",
    intake: "2026",
    country: "",
    score: "",
    funding_goal: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newScholarship = {
      id: Date.now().toString(),
      ...formData,
      status: "Pending",
    };

    onSubmit(newScholarship);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        Scholarship Eligibility Form
      </h3>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="input"
        />
      </div>

      {/* Level + Intake */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          name="current_level"
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Select Level</option>
          <option value="12th">12th</option>
          <option value="bachelors">Bachelors</option>
          <option value="masters">Masters</option>
        </select>

        <select name="intake" onChange={handleChange} className="input">
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
      </div>

      {/* Country + Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          name="country"
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Preferred Country</option>
          <option value="usa">USA</option>
          <option value="uk">UK</option>
          <option value="canada">Canada</option>
        </select>

        <input
          name="score"
          placeholder="CGPA / %"
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Funding */}
      <select
        name="funding_goal"
        onChange={handleChange}
        required
        className="input"
      >
        <option value="">Funding Goal</option>
        <option value="tuition">Tuition</option>
        <option value="partial">Tuition + Living</option>
        <option value="full">Full Ride</option>
      </select>

      {/* Buttons */}
      <div className="flex gap-3 pt-3">
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
