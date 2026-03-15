export default function FinanceSection({ data = {}, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";
  const label = "text-sm font-medium text-gray-700";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">Finance</h3>

      {/* Sponsor */}
      <div className="space-y-1">
        <label className={label}>Sponsor</label>
        <select
          className={input}
          value={data.sponsor || ""}
          onChange={(e) => updateForm({ sponsor: e.target.value })}
        >
          <option value="">Select Sponsor</option>
          <option>Self</option>
          <option>Parents</option>
          <option>Relative</option>
          <option>Other</option>
        </select>
      </div>

      {/* Sponsor Income */}
      <div className="space-y-1">
        <label className={label}>Sponsor Income</label>
        <input
          className={input}
          value={data.sponsorIncome || ""}
          onChange={(e) => updateForm({ sponsorIncome: e.target.value })}
        />
      </div>

      {/* Funds Available */}
      <div className="space-y-1">
        <label className={label}>Funds Available</label>
        <input
          className={input}
          value={data.funds || ""}
          onChange={(e) => updateForm({ funds: e.target.value })}
        />
      </div>
    </div>
  );
}
