export default function VisaFormActions({ isView, isAdd, onCancel }) {
  return (
    <div className="flex justify-end gap-4 pt-8 border-t">
      <button type="button" onClick={onCancel} className="px-8 py-3 border rounded-xl">
        {isView ? "Close" : "Cancel"}
      </button>

      {!isView && (
        <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl">
          {isAdd ? "Add Visa Case" : "Update Visa Case"}
        </button>
      )}
    </div>
  );
}
