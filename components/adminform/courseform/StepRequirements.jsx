// components/adminform/courseform/StepRequirements.jsx
export default function StepRequirements({
  form,
  updateRequirement,
  addRequirement,
  removeRequirement,
  isViewMode,
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Entry Requirements</h2>

      <div className="space-y-6">
        {form.entryRequirements.map((req, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-5 bg-gray-50 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirement Title
                </label>
                <input
                  type="text"
                  value={req.title}
                  onChange={(e) => updateRequirement(index, "title", e.target.value)}
                  disabled={isViewMode}
                  placeholder="e.g. Academic Qualifications"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirement Details
                </label>
                <textarea
                  value={req.description}
                  onChange={(e) => updateRequirement(index, "description", e.target.value)}
                  disabled={isViewMode}
                  rows={3}
                  placeholder="e.g. Bachelor's degree in Computer Science or related field with minimum 60% marks"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-white resize-y"
                />
              </div>
            </div>

            {!isViewMode && form.entryRequirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {!isViewMode && (
          <button
            type="button"
            onClick={addRequirement}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
          >
            + Add New Requirement
          </button>
        )}
      </div>
    </section>
  );
}