// components/adminform/courseform/StepHeroBasic.jsx
export default function StepHeroBasic({
  form,
  onChange,
  bgPreview,
  isViewMode,
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        Hero / Banner Section
      </h2>

      {/* Background Image Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Background Image (for course detail page hero)
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-full sm:w-64 h-40 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
            {bgPreview ? (
              <img
                src={bgPreview}
                alt="Background preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-center px-4">
                No background image selected
              </span>
            )}
          </div>

          {!isViewMode && (
            <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Upload Background Image
              <input
                type="file"
                accept="image/*"
                name="bgImage"
                className="hidden"
                onChange={onChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Hero Text Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Top Label (e.g. Master's Program)
          </label>
          <input
            type="text"
            name="topLabel"
            value={form.topLabel}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="Master's Program"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="MSc in Cybersecurity"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            name="level"
            value={form.level}
            onChange={onChange}
            disabled={isViewMode}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          >
            <option value="">Select Level</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field
          </label>
          <input
            type="text"
            name="field"
            value={form.field}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="Computer Science & IT"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary University (for listing table)
          </label>
          <input
            type="text"
            name="primaryUniversity"
            value={form.primaryUniversity}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="University of Toronto"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={form.subtitle}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="Advanced training in protecting digital systems"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="1–2 years"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fees (approx.)
          </label>
          <input
            type="text"
            name="fees"
            value={form.fees}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="USD 25,000 – 40,000"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scholarships Info
          </label>
          <input
            type="text"
            name="scholarships"
            value={form.scholarships}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="Up to 50% merit-based scholarships"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Average Salary (post-graduation)
          </label>
          <input
            type="text"
            name="avgSalary"
            value={form.avgSalary}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="USD 90,000 – 140,000"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={onChange}
            disabled={isViewMode}
            className="h-4 w-4 text-sky-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700 font-medium">
            Mark as Featured Course
          </span>
        </label>
      </div>
    </section>
  );
}
