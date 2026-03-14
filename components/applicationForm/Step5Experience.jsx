export default function Step5Experience({
  data,
  updateForm,
  nextStep,
  prevStep,
}) {
  const isValid = data.careerGoals.trim() !== "";

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border border-gray-300 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
    transition-all duration-200 outline-none
    hover:border-gray-400
  `;

  const textareaClasses = `
    w-full px-4 py-3 rounded-xl border border-gray-300 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
    transition-all duration-200 outline-none
    hover:border-gray-400 resize-none
  `;

  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Experience & Goals
      </h2>

      <div>
        <label className={labelClasses}>Career Goals (200-400 words)</label>
        <textarea
          placeholder="Describe your career aspirations and how this program will help..."
          value={data.careerGoals}
          onChange={(e) => updateForm({ careerGoals: e.target.value })}
          className={`${textareaClasses} h-32`}
        />
      </div>

      <div>
        <label className={labelClasses}>Extra curricular Activities</label>
        <textarea
          placeholder="List your hobbies, sports, clubs, volunteer work..."
          value={data.activities}
          onChange={(e) => updateForm({ activities: e.target.value })}
          className={`${textareaClasses} h-28`}
        />
      </div>

      <div>
        <label className={labelClasses}>Work / Internship Experience</label>
        <textarea
          placeholder="Describe your relevant work experience, internships, projects..."
          value={data.experience}
          onChange={(e) => updateForm({ experience: e.target.value })}
          className={`${textareaClasses} h-28`}
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
