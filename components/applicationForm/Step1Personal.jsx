"use client";

export default function Step1Personal({ data, updateForm, nextStep }) {
  const isValid =
    data.fullName.trim() !== "" &&
    data.dob !== "" &&
    data.gender !== "" &&
    data.nationality.trim() !== "" &&
    data.passportNumber.trim() !== "" &&
    data.passportExpiry !== "" &&
    data.mobile.trim() !== "" &&
    data.email.includes("@") &&
    data.address.trim() !== "" &&
    data.emergencyName.trim() !== "" &&
    data.emergencyPhone.trim() !== "";

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border border-gray-300 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
    transition-all duration-200 outline-none
    hover:border-gray-400
  `;

  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Personal Information
      </h2>

      <div>
        <label className={labelClasses}>Full Name (as in Passport) *</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={data.fullName}
          onChange={(e) => updateForm({ fullName: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>Date of Birth *</label>
          <input
            type="date"
            value={data.dob}
            onChange={(e) => updateForm({ dob: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Passport Expiry Date *</label>
          <input
            type="date"
            value={data.passportExpiry}
            onChange={(e) => updateForm({ passportExpiry: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>Gender *</label>
          <select
            value={data.gender}
            onChange={(e) => updateForm({ gender: e.target.value })}
            className={inputClasses}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Nationality *</label>
          <input
            type="text"
            placeholder="e.g., Indian"
            value={data.nationality}
            onChange={(e) => updateForm({ nationality: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Passport Number *</label>
        <input
          type="text"
          placeholder="Enter passport number"
          value={data.passportNumber}
          onChange={(e) => updateForm({ passportNumber: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Permanent / Current Address *</label>
        <textarea
          placeholder="Full address including city, state, PIN code, country"
          value={data.address}
          onChange={(e) => updateForm({ address: e.target.value })}
          className={`${inputClasses} h-24 resize-y`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelClasses}>Mobile Number *</label>
          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={data.mobile}
            onChange={(e) => updateForm({ mobile: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>WhatsApp Number</label>
          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX (optional)"
            value={data.whatsapp}
            onChange={(e) => updateForm({ whatsapp: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Email Address *</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={data.email}
            onChange={(e) => updateForm({ email: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">
        Emergency Contact
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelClasses}>Name *</label>
          <input
            type="text"
            placeholder="Emergency contact name"
            value={data.emergencyName}
            onChange={(e) => updateForm({ emergencyName: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Relation *</label>
          <input
            type="text"
            placeholder="e.g., Father, Mother, Guardian"
            value={data.emergencyRelation}
            onChange={(e) => updateForm({ emergencyRelation: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Phone Number *</label>
          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={data.emergencyPhone}
            onChange={(e) => updateForm({ emergencyPhone: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <button
        onClick={() => isValid && nextStep()}
        disabled={!isValid}
        className={`
          w-full py-3 px-6 rounded-xl font-semibold text-white mt-6
          transition-all duration-300 transform
          ${
            isValid
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5"
              : "bg-gray-300 cursor-not-allowed"
          }
        `}
      >
        Continue →
      </button>
    </div>
  );
}
