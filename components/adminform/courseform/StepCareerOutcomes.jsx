// components/adminform/courseform/StepCareerOutcomes.jsx
export default function StepCareerOutcomes({
  form,
  onChange,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  isViewMode,
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Career Prospects & Outcomes</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Career Prospects Description
          </label>
          <textarea
            name="careerProspects"
            value={form.careerProspects}
            onChange={onChange}
            disabled={isViewMode}
            rows={5}
            placeholder="Describe career opportunities, industry demand, growth prospects..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 resize-y"
          />
        </div>

        {/* Popular Job Roles */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Popular Job Roles
            </label>
            {!isViewMode && (
              <button
                type="button"
                onClick={() => addArrayItem("popularJobRoles")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                + Add Job Role
              </button>
            )}
          </div>

          {form.popularJobRoles.map((role, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={role}
                onChange={(e) => updateArrayField("popularJobRoles", index, e.target.value)}
                disabled={isViewMode}
                placeholder="e.g. Cybersecurity Analyst"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
              />
              {!isViewMode && form.popularJobRoles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("popularJobRoles", index)}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Salary Expectations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary Expectations (after graduation)
          </label>
          <input
            type="text"
            name="salaryExpectations"
            value={form.salaryExpectations}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="USD 80,000 – 150,000 per year"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          />
        </div>
      </div>
    </section>
  );
}