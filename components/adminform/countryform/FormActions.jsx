// components/admin/country/FormActions.jsx
export default function FormActions({ mode, onCancel }) {
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
          className="px-8 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium shadow-sm"
        >
          {mode === "add" ? "Add Country" : "Update Country"}
        </button>
      )}
    </div>
  );
}