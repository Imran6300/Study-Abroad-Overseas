export default function Step2Education({
  data,
  updateForm,
  nextStep,
  prevStep,
}) {
  const isValid =
    data.qualification &&
    data.school.trim() &&
    data.board.trim() &&
    data.passingYear.trim() &&
    data.cgpa.trim();

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
        Education Details
      </h2>

      <div>
        <label className={labelClasses}>Highest Qualification *</label>
        <select
          value={data.qualification}
          onChange={(e) => updateForm({ qualification: e.target.value })}
          className={inputClasses}
        >
          <option value="">Select Qualification</option>
          <option>10th</option>
          <option>12th</option>
          <option>Diploma</option>
          <option>Bachelor's</option>
          <option>Master's</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className={labelClasses}>
          School / College / University Name *
        </label>
        <input
          type="text"
          placeholder="Enter institution name"
          value={data.school}
          onChange={(e) => updateForm({ school: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Board / University Name *</label>
        <input
          type="text"
          placeholder="e.g., CBSE, Osmania University, IIT Bombay"
          value={data.board}
          onChange={(e) => updateForm({ board: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>Year of Passing / Expected *</label>
          <input
            type="text"
            placeholder="e.g., 2024 or Expected 2025"
            value={data.passingYear}
            onChange={(e) => updateForm({ passingYear: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>CGPA / Percentage *</label>
          <input
            type="text"
            placeholder="e.g., 8.5 / 10 or 85%"
            value={data.cgpa}
            onChange={(e) => updateForm({ cgpa: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          Any backlogs / academic gaps / year drops?
        </label>
        <select
          value={data.backlogs || ""}
          onChange={(e) => updateForm({ backlogs: e.target.value })}
          className={inputClasses}
        >
          <option value="">Select</option>
          <option>No</option>
          <option>Yes - cleared</option>
          <option>Yes - still have</option>
          <option>Year gap (explain below)</option>
        </select>

        {(data.backlogs === "Yes - cleared" ||
          data.backlogs === "Yes - still have" ||
          data.backlogs === "Year gap (explain below)") && (
          <textarea
            placeholder="Explain number of backlogs, when cleared, or reason for gap..."
            value={data.backlogsExplanation || ""}
            onChange={(e) =>
              updateForm({ backlogsExplanation: e.target.value })
            }
            className={`${inputClasses} h-24 mt-3 resize-y`}
          />
        )}
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
