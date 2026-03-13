export default function TestsSection({ data, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">English Test</h3>

      <select
        className={input}
        value={data.englishTest || ""}
        onChange={(e) => updateForm({ englishTest: e.target.value })}
      >
        <option value="">Select</option>
        <option>IELTS</option>
        <option>TOEFL</option>
        <option>PTE</option>
        <option>Duolingo</option>
        <option>None / Exempt</option>
      </select>

      <input
        type="date"
        className={input}
        value={data.testDate || ""}
        onChange={(e) => updateForm({ testDate: e.target.value })}
      />

      <input
        className={input}
        placeholder="Score"
        value={data.score || ""}
        onChange={(e) => updateForm({ score: e.target.value })}
      />

      <input
        className={input}
        placeholder="Listening"
        value={data.listening || ""}
        onChange={(e) => updateForm({ listening: e.target.value })}
      />

      <input
        className={input}
        placeholder="Reading"
        value={data.reading || ""}
        onChange={(e) => updateForm({ reading: e.target.value })}
      />

      <input
        className={input}
        placeholder="Writing"
        value={data.writing || ""}
        onChange={(e) => updateForm({ writing: e.target.value })}
      />

      <input
        className={input}
        placeholder="Speaking"
        value={data.speaking || ""}
        onChange={(e) => updateForm({ speaking: e.target.value })}
      />
    </div>
  );
}
