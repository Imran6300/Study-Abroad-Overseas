// components/admin/country/FormActions.jsx
export default function FormActions({ mode, onCancel, submitting }) {
  const isViewMode = mode === "view";

  return (
    <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
      >
        {isViewMode ? "Close" : "Cancel"}
      </button>

      {!isViewMode && (
        <button
          type="submit"
          disabled={submitting}
          className={`px-8 py-3 rounded-xl font-medium shadow-sm transition-colors
    ${
      submitting
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-sky-600 text-white hover:bg-sky-700"
    }`}
        >
          {submitting
            ? mode === "add"
              ? "Adding Country..."
              : "Updating Country..."
            : mode === "add"
              ? "Add Country"
              : "Update Country"}
        </button>
      )}
    </div>
  );
}
