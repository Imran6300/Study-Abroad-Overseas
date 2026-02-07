// components/admin/country/WhyStudyCard.jsx
export default function WhyStudyCard({
  index,
  card,
  onChange,
  onRemove,
  canRemove,
  errors,
  isViewMode,
}) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative">
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-lg font-medium text-gray-800">Card {index + 1}</h4>
        {!isViewMode && canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Remove Card
          </button>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Title
        </label>
        <input
          type="text"
          value={card.title}
          onChange={(e) => onChange(index, "title", e.target.value)}
          disabled={isViewMode}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          placeholder="e.g. World-Class Education & Innovation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Description / Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={card.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
          disabled={isViewMode}
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors[`whyStudyCards_${index}_description`] ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100`}
          placeholder="Detailed explanation of this benefit or feature..."
        />
        {errors[`whyStudyCards_${index}_description`] && (
          <p className="mt-1 text-sm text-red-600">
            {errors[`whyStudyCards_${index}_description`]}
          </p>
        )}
      </div>
    </div>
  );
}