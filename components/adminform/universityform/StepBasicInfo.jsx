// components/adminform/universityform/StepBasicInfo.jsx
export default function StepBasicInfo({ form, onChange, isViewMode }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            disabled={isViewMode}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={onChange}
            disabled={isViewMode}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={onChange}
            disabled={isViewMode}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="e.g. mit.edu"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>
      </div>

      <div className="flex gap-8 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={onChange}
            disabled={isViewMode}
            className="h-4 w-4 text-sky-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="partnered"
            checked={form.partnered}
            onChange={onChange}
            disabled={isViewMode}
            className="h-4 w-4 text-sky-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Partnered University</span>
        </label>
      </div>
    </section>
  );
}