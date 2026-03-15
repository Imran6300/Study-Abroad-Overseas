export default function FinalSection({ data = {}, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";
  const label = "text-sm font-medium text-gray-700";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">Final Details</h3>

      {/* Lead Source */}
      <div className="space-y-1">
        <label className={label}>Lead Source</label>
        <select
          className={input}
          value={data.source || ""}
          onChange={(e) => updateForm({ source: e.target.value })}
        >
          <option value="">Select Source</option>
          <option>Google</option>
          <option>Instagram</option>
          <option>Friend</option>
          <option>Advertisement</option>
          <option>Other</option>
        </select>
      </div>

      {/* Comments */}
      <div className="space-y-1">
        <label className={label}>Comments</label>
        <textarea
          className={input}
          value={data.comments || ""}
          onChange={(e) => updateForm({ comments: e.target.value })}
        />
      </div>

      {/* Agreement */}
      <div className="space-y-1">
        <label className={label}>Agreement Accepted</label>
        <select
          className={input}
          value={data.agreed ?? ""}
          onChange={(e) => updateForm({ agreed: e.target.value === "true" })}
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
    </div>
  );
}
