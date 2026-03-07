export default function Step4Program({ data, updateForm, nextStep, prevStep }) {
  const isValid = data.studyLevel && data.field && data.intake;

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
        Program Preferences
      </h2>

      <div>
        <label className={labelClasses}>Study Level</label>
        <select
          value={data.studyLevel}
          onChange={(e) => updateForm({ studyLevel: e.target.value })}
          className={inputClasses}
        >
          <option value="">Select Level</option>
          <option>Undergraduate</option>
          <option>Postgraduate</option>
          <option>PhD</option>
          <option>Diploma</option>
        </select>
      </div>

      <div>
        <label className={labelClasses}>Field / Major</label>
        <input
          type="text"
          placeholder="e.g., Computer Science, Business"
          value={data.field}
          onChange={(e) => updateForm({ field: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Preferred Intake</label>
        <input
          type="text"
          placeholder="e.g., Fall 2026"
          value={data.intake}
          onChange={(e) => updateForm({ intake: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Budget per Year (USD)</label>
        <input
          type="text"
          placeholder="e.g., $25,000"
          value={data.budget}
          onChange={(e) => updateForm({ budget: e.target.value })}
          className={inputClasses}
        />
      </div>

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
