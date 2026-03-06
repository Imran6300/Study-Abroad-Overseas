"use client";

import { useEffect, useState } from "react";

export default function UserProfileSection({
  userProfile,
  onSave,
  mode = "view",
  onCancel,
}) {
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    qualification: "",
    fieldOfStudy: "",
    graduationYear: "",
    gpa: "",
    preferredCountry: "",
    intendedIntake: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
  });

  useEffect(() => {
    if (userProfile) {
      setProfile((prev) => ({
        ...prev,
        ...userProfile,
        dateOfBirth: userProfile?.dateOfBirth?.slice(0, 10) || "",
        passportExpiry: userProfile?.passportExpiry?.slice(0, 10) || "",
      }));
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(profile);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // ─── View Mode ────────────────────────────────────────────────────────
  if (mode === "view") {
    const Field = ({ label, value, highlight = false }) => (
      <div>
        <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
        <dd
          className={`text-base ${highlight ? "font-semibold text-indigo-700" : "text-gray-900"}`}
        >
          {value || "—"}
        </dd>
      </div>
    );

    const InfoCard = ({ title, children }) => (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            {children}
          </dl>
        </div>
      </div>
    );

    return (
      <div className="space-y-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.fullName || "Student Profile"}
          </h1>
          {profile.nationality && (
            <p className="mt-1 text-lg text-gray-600">
              {profile.nationality} • {profile.gender || "—"}
            </p>
          )}
        </div>

        <InfoCard title="Personal Details">
          <Field label="Full Name" value={profile.fullName} highlight />
          <Field label="Phone Number" value={profile.phone} />
          <Field
            label="Date of Birth"
            value={formatDate(profile.dateOfBirth)}
          />
          <Field label="Gender" value={profile.gender} />
          <Field label="Nationality" value={profile.nationality} />
        </InfoCard>

        <InfoCard title="Academic Background">
          <Field label="Highest Qualification" value={profile.qualification} />
          <Field label="Field of Study" value={profile.fieldOfStudy} />
          <Field label="Year of Graduation" value={profile.graduationYear} />
          <Field label="GPA / Percentage" value={profile.gpa} highlight />
        </InfoCard>

        <InfoCard title="Study Preferences">
          <Field label="Preferred Country" value={profile.preferredCountry} />
          <Field label="Intended Intake" value={profile.intendedIntake} />
        </InfoCard>

        <InfoCard title="Passport & Identity">
          <Field label="Passport Number" value={profile.passportNumber} />
          <Field
            label="Passport Expiry"
            value={formatDate(profile.passportExpiry)}
          />
        </InfoCard>
      </div>
    );
  }
  if (!userProfile) {
    return <div className="p-10 text-gray-500">Loading student profile...</div>;
  }

  // ─── Edit Mode ────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-6">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-6">
          Academic Background
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Highest Qualification
            </label>
            <input
              name="qualification"
              value={profile.qualification}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="Bachelor's / Master's / ..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Field of Study
            </label>
            <input
              name="fieldOfStudy"
              value={profile.fieldOfStudy}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="Computer Science, Mechanical..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Year of Graduation
            </label>
            <input
              name="graduationYear"
              value={profile.graduationYear}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="2024"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              GPA / Percentage
            </label>
            <input
              name="gpa"
              value={profile.gpa}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="8.7 / 87%"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-6">
          Study Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Preferred Country
            </label>
            <input
              name="preferredCountry"
              value={profile.preferredCountry}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="Canada, Australia, UK..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Intended Intake
            </label>
            <input
              name="intendedIntake"
              value={profile.intendedIntake}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="Fall 2026, Spring 2027..."
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-6">
          Passport & Identity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <input
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="Male / Female / Other"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
              name="nationality"
              value={profile.nationality}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="Indian"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Passport Number
            </label>
            <input
              name="passportNumber"
              value={profile.passportNumber}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="Z1234567"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Passport Expiry
            </label>
            <input
              type="date"
              name="passportExpiry"
              value={profile.passportExpiry}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 bg-white transition-all outline-none text-gray-900"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4 pt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
}
