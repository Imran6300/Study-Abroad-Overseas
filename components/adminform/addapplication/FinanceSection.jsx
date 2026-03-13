export default function FinanceSection({ data, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Finance</h3>

      <select
        className={input}
        value={data.sponsor || ""}
        onChange={(e) => updateForm({ sponsor: e.target.value })}
      >
        <option value="">Sponsor</option>
        <option>Self</option>
        <option>Parents</option>
        <option>Relative</option>
        <option>Other</option>
      </select>

      <input
        className={input}
        placeholder="Sponsor Income"
        value={data.sponsorIncome || ""}
        onChange={(e) => updateForm({ sponsorIncome: e.target.value })}
      />

      <input
        className={input}
        placeholder="Funds Available"
        value={data.funds || ""}
        onChange={(e) => updateForm({ funds: e.target.value })}
      />
    </div>
  );
}
