export default function FinalSection({ data, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Final Details</h3>

      <select
        className={input}
        value={data.source || ""}
        onChange={(e) => updateForm({ source: e.target.value })}
      >
        <option value="">Source</option>
        <option>Google</option>
        <option>Instagram</option>
        <option>Friend</option>
        <option>Advertisement</option>
        <option>Other</option>
      </select>

      <textarea
        className={input}
        placeholder="Comments"
        value={data.comments || ""}
        onChange={(e) => updateForm({ comments: e.target.value })}
      />

      <select
        className={input}
        value={data.agreed || ""}
        onChange={(e) => updateForm({ agreed: e.target.value })}
      >
        <option value="">Agreement</option>
        <option>true</option>
        <option>false</option>
      </select>
    </div>
  );
}
