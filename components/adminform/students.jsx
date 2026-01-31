// components/adminform/AddStudentForm.jsx
"use client";

import { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle multi-select countries
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

    // Basic required fields check
    if (!form.fullName || !form.email || !form.mobile) {
      alert("Please fill required fields: Full Name, Email, Mobile");
      return;
    }

    // TODO: Replace with real API call
    // await fetch('/api/students', { method: 'POST', body: JSON.stringify(form) });

    console.log("New student submitted:", form);

    // Send data back to parent component
    onSuccess(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* PERSONAL DETAILS */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name (as in Passport) *
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Father's Name</label>
            <input
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mother's Name</label>
            <input
              name="motherName"
              value={form.motherName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Passport Number
            </label>
            <input
              name="passportNumber"
              value={form.passportNumber}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Passport Expiry
            </label>
            <input
              type="date"
              name="passportExpiry"
              value={form.passportExpiry}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* CONTACT INFORMATION */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mobile Number *
            </label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              WhatsApp / Alternate Number
            </label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Address
            </label>
            <textarea
              name="currentAddress"
              value={form.currentAddress}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="House no, Street, Area..."
            />
          </div>
        </div>
      </div>

      {/* ACADEMIC BACKGROUND */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">Academic Background</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Highest Qualification *
            </label>
            <select
              name="currentQualification"
              value={form.currentQualification}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select</option>
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stream / Field</label>
            <input
              name="stream"
              value={form.stream}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="e.g. Science, Commerce, Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Year of Passing</label>
            <input
              type="number"
              name="passingYear"
              value={form.passingYear}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Percentage / CGPA
            </label>
            <input
              name="percentage"
              value={form.percentage}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="85.5% or 8.5 CGPA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Number of Backlogs
            </label>
            <input
              type="number"
              name="backlogs"
              value={form.backlogs}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* STUDY ABROAD PREFERENCES */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">Study Abroad Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preferred Countries (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
              {["USA", "Canada", "UK", "Australia", "Germany", "Ireland", "New Zealand", "France", "Italy", "Singapore", "Dubai", "Malaysia"].map((country) => (
                <label key={country} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="preferredCountries"
                    value={country}
                    checked={form.preferredCountries.includes(country)}
                    onChange={handleChange}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{country}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preferred Intake *
            </label>
            <select
              name="preferredIntake"
              value={form.preferredIntake}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select Intake</option>
              <option value="Fall 2026">Fall 2026</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Summer 2026">Summer 2026</option>
              <option value="Fall 2027">Fall 2027</option>
              <option value="Spring 2027">Spring 2027</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Level of Study
            </label>
            <select
              name="studyLevel"
              value={form.studyLevel}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select Level</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Diploma">Diploma</option>
              <option value="PhD">PhD</option>
              <option value="Foundation">Foundation / Pathway</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Field of Study
            </label>
            <input
              name="fieldOfStudy"
              value={form.fieldOfStudy}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="e.g. Computer Science, Business Administration, Nursing"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tuition Budget (INR)
            </label>
            <select
              name="budgetTuition"
              value={form.budgetTuition}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select Range</option>
              <option value="<20L"> 20 Lakhs</option>
              <option value="20-40L">20 – 40 Lakhs</option>
              <option value="40-60L">40 – 60 Lakhs</option>
              <option value=">60L">Above 60 Lakhs</option>
            </select>
          </div>
        </div>
      </div>

      {/* TESTS & ADMIN INFO */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">Tests & Admin Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              English Proficiency Test
            </label>
            <select
              name="englishTest"
              value={form.englishTest}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="None">None</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEFL">TOEFL</option>
              <option value="PTE">PTE</option>
              <option value="Duolingo">Duolingo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Overall Score
            </label>
            <input
              name="englishScore"
              value={form.englishScore}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="e.g. 7.0 / 100 / 65 / 120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lead Source
            </label>
            <select
              name="leadSource"
              value={form.leadSource}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select Source</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Referral">Referral</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Seminar">Seminar</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assigned Counselor
            </label>
            <select
              name="assignedCounselor"
              value={form.assignedCounselor}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select Counselor</option>
              <option value="Imran">Imran</option>
              <option value="Sara">Sara</option>
              <option value="John">John</option>
              <option value="Priya">Priya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Status
            </label>
            <select
              name="currentStatus"
              value={form.currentStatus}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="Lead">Lead</option>
              <option value="Counseling Done">Counseling Done</option>
              <option value="Shortlisted">Universities Shortlisted</option>
              <option value="Applications Submitted">Applications Submitted</option>
              <option value="Offer Received">Offer Received</option>
              <option value="Visa Applied">Visa Applied</option>
              <option value="Visa Approved">Visa Approved</option>
              <option value="Enrolled">Enrolled</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks / Notes</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="Any additional notes or comments..."
            />
          </div>
        </div>
      </div>

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