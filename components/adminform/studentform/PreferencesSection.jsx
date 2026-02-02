// components/adminform/studentform/PreferencesSection.jsx

export default function PreferenceSection({ form, handleChange, disabled = false }) {
  const countries = [
    "USA",
    "Canada",
    "UK",
    "Australia",
    "Germany",
    "Ireland",
    "New Zealand",
    "France",
    "Italy",
    "Singapore",
    "Dubai",
    "Malaysia",
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold mb-5 text-gray-800">Study Abroad Preferences</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Preferred Countries - Multi Checkbox */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Preferred Countries (select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
            {countries.map((country) => (
              <label key={country} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="preferredCountries"
                  value={country}
                  checked={Array.isArray(form.preferredCountries) && form.preferredCountries.includes(country)}
                  onChange={handleChange}
                  disabled={disabled}
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Intake */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Preferred Intake *
          </label>
          <select
            name="preferredIntake"
            value={form.preferredIntake || ""}
            onChange={handleChange}
            required
            disabled={disabled}
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

        {/* Level of Study */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Level of Study
          </label>
          <select
            name="studyLevel"
            value={form.studyLevel || ""}
            onChange={handleChange}
            disabled={disabled}
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

        {/* Field of Study */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Field of Study
          </label>
          <input
            name="fieldOfStudy"
            value={form.fieldOfStudy || ""}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            placeholder="e.g. Computer Science, Business Administration, Nursing"
          />
        </div>

        {/* Tuition Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tuition Budget (INR)
          </label>
          <select
            name="budgetTuition"
            value={form.budgetTuition || ""}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
          >
            <option value="">Select Range</option>
            <option value="<20L">20 Lakhs</option>
            <option value="20-40L">20 – 40 Lakhs</option>
            <option value="40-60L">40 – 60 Lakhs</option>
            <option value=">60L">Above 60 Lakhs</option>
          </select>
        </div>
      </div>
    </div>
  );
}