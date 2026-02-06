// components/adminform/universityform/StepImages.jsx
export default function StepImages({
  form,
  logoPreview,
  imagePreviews,
  onChange,
  removeImage,
  isViewMode,
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900">University Images & Logo</h2>

      {/* Logo */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">University Logo</label>
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400 text-sm text-center px-2">No logo selected</span>
            )}
          </div>

          {!isViewMode && (
            <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                name="logo"
                className="hidden"
                onChange={onChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Campus / Gallery Images</label>

        <div className="flex flex-wrap gap-4">
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="relative group">
              <img
                src={src}
                alt={`Gallery image ${idx + 1}`}
                className="w-28 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
              {!isViewMode && (
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {!isViewMode && (
            <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <span className="text-gray-500 text-sm text-center">Add Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                name="images"
                className="hidden"
                onChange={onChange}
              />
            </label>
          )}
        </div>
      </div>
    </section>
  );
}