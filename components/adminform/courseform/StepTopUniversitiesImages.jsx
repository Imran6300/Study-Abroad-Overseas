// components/adminform/courseform/StepTopUniversitiesImages.jsx
export default function StepTopUniversitiesImages({
  form,
  universities,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  isViewMode,
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        Top Universities Offering This Course
      </h2>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Top Universities (names only)
          </label>
          {!isViewMode && (
            <button
              type="button"
              onClick={() => addArrayItem("topUniversities")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Add University
            </button>
          )}
        </div>

        {form.topUniversities.map((uni, index) => (
          <div key={index} className="flex gap-3 items-center">
            <select
              value={uni}
              onChange={(e) =>
                updateArrayField("topUniversities", index, e.target.value)
              }
              disabled={isViewMode}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
            >
              <option value="">Select University</option>

              {universities.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            {!isViewMode && form.topUniversities.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem("topUniversities", index)}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
