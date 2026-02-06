// components/adminform/courseform/StepOverviewHighlights.jsx
export default function StepOverviewHighlights({
  form,
  onChange,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  isViewMode,
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Overview & Key Highlights</h2>

      {/* Overview */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overview Section Title
          </label>
          <input
            type="text"
            name="overviewTitle"
            value={form.overviewTitle}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="Program Overview"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overview Description
          </label>
          <textarea
            name="overviewDescription"
            value={form.overviewDescription}
            onChange={onChange}
            disabled={isViewMode}
            rows={6}
            placeholder="Write a detailed overview of the course, its objectives, what students will learn, etc..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 resize-y"
          />
        </div>
      </div>

      {/* Key Highlights */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Key Highlights (bullet points)
          </label>
          {!isViewMode && (
            <button
              type="button"
              onClick={() => addArrayItem("keyHighlights")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Add Highlight
            </button>
          )}
        </div>

        {form.keyHighlights.map((highlight, index) => (
          <div key={index} className="flex gap-3 items-start">
            <input
              type="text"
              value={highlight}
              onChange={(e) => updateArrayField("keyHighlights", index, e.target.value)}
              disabled={isViewMode}
              placeholder="e.g. Hands-on labs with real-world tools"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
            />
            {!isViewMode && form.keyHighlights.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem("keyHighlights", index)}
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