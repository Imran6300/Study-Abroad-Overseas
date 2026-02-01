// components/adminform/counselorform/PersonalDetailsSection.jsx
export default function PersonalDetailsSection({ form, handleChange, disabled = false }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold mb-5 text-gray-800">Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name *
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Employee ID (optional internal reference) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Employee ID (optional)
          </label>
          <input
            name="employeeId"
            value={form.employeeId || ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder="e.g. COUN-001"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Joining Date
          </label>
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate || ""}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}