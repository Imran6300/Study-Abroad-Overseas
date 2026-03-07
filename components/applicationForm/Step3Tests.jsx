export default function Step3Tests({ data, updateForm, nextStep, prevStep }) {
  const isValid = data.englishTest !== "" && data.testDate !== "";

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
        English Proficiency & Other Tests
      </h2>

      <div>
        <label className={labelClasses}>English Test *</label>
        <select
          value={data.englishTest}
          onChange={(e) => updateForm({ englishTest: e.target.value })}
          className={inputClasses}
        >
          <option value="">Select Test</option>
          <option>IELTS</option>
          <option>TOEFL</option>
          <option>PTE</option>
          <option>Duolingo</option>
          <option>None / Exempt</option>
        </select>
      </div>

      {data.englishTest && data.englishTest !== "None / Exempt" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Test Date</label>
              <input
                type="date"
                value={data.testDate}
                onChange={(e) => updateForm({ testDate: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Overall Score</label>
              <input
                type="text"
                placeholder="e.g., 7.5 or 105"
                value={data.score}
                onChange={(e) => updateForm({ score: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelClasses}>Listening</label>
              <input
                type="text"
                placeholder="e.g., 8.0"
                value={data.listening || ""}
                onChange={(e) => updateForm({ listening: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Reading</label>
              <input
                type="text"
                placeholder="e.g., 7.5"
                value={data.reading || ""}
                onChange={(e) => updateForm({ reading: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Writing</label>
              <input
                type="text"
                placeholder="e.g., 7.0"
                value={data.writing || ""}
                onChange={(e) => updateForm({ writing: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Speaking</label>
              <input
                type="text"
                placeholder="e.g., 7.5"
                value={data.speaking || ""}
                onChange={(e) => updateForm({ speaking: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>
        </>
      )}

      <div className="flex gap-4 pt-4">
        <button
          onClick={prevStep}
          className="flex-1 py-3 px-6 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          ← Back
        </button>
        <button
          onClick={() => isValid && nextStep()}
          disabled={!isValid}
          className={`
            flex-1 py-3 px-6 rounded-xl font-semibold text-white
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
    </div>
  );
}
