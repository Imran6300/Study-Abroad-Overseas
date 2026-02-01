// components/adminform/counselorform/WorkInfoSection.jsx
// (or rename to ProfessionalDetailsSection.jsx if you like that name better)

export default function WorkInfoSection({ form, handleChange, disabled = false }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold mb-5 text-gray-800">
        Professional / Work Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Specialization – countries they handle */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Specialization (Countries they primarily handle) *
          </label>
          <input
            type="text"
            name="specialization"
            value={form.specialization || ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder="e.g. Canada, UK, Australia, Germany"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">
            You can enter multiple countries separated by commas
          </p>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Years of Experience in Overseas Education
          </label>
          <input
            type="number"
            name="yearsOfExperience"
            value={form.yearsOfExperience || ""}
            onChange={handleChange}
            disabled={disabled}
            min="0"
            placeholder="e.g. 5"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Languages Spoken – simple multi-select style */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Languages Spoken
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
            {[
              "English",
              "Hindi",
              "Telugu",
              "Tamil",
              "Malayalam",
              "Kannada",
              "Marathi",
              "Punjabi",
              "Bengali",
              "Arabic",
              "French",
              "German",
            ].map((lang) => (
              <label key={lang} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="languages"
                  value={lang}
                  checked={form.languages?.includes(lang) || false}
                  onChange={handleChange}
                  disabled={disabled}
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{lang}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Select all languages the counselor can communicate in
          </p>
        </div>

        {/* LinkedIn / Professional Profile */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            LinkedIn / Professional Profile URL (optional)
          </label>
          <input
            type="url"
            name="linkedIn"
            value={form.linkedIn || ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder="https://linkedin.com/in/counselor-name"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Certifications / Notable Achievements (optional) */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Certifications / Notable Achievements (optional)
          </label>
          <textarea
            name="certifications"
            value={form.certifications || ""}
            onChange={handleChange}
            disabled={disabled}
            rows={3}
            placeholder="e.g. ICEF Trained, Canada Course Graduate, 5+ years visa success..."
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}