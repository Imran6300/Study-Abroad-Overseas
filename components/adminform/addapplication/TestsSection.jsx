export default function TestsSection({ data = {}, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";
  const label = "text-sm font-medium text-gray-700";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">English Test</h3>

      {/* English Test Type */}
      <div className="space-y-1">
        <label className={label}>English Test</label>
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
      </div>

      {/* Test Date */}
      <div className="space-y-1">
        <label className={label}>Test Date</label>
        <input
          type="date"
          className={input}
          value={
            data?.testDate
              ? new Date(data.testDate).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => updateForm({ testDate: e.target.value })}
        />
      </div>

      {/* Overall Score */}
      <div className="space-y-1">
        <label className={label}>Overall Score</label>
        <input
          className={input}
          value={data.score || ""}
          onChange={(e) => updateForm({ score: e.target.value })}
        />
      </div>

      {/* Listening */}
      <div className="space-y-1">
        <label className={label}>Listening</label>
        <input
          className={input}
          value={data.listening || ""}
          onChange={(e) => updateForm({ listening: e.target.value })}
        />
      </div>

      {/* Reading */}
      <div className="space-y-1">
        <label className={label}>Reading</label>
        <input
          className={input}
          value={data.reading || ""}
          onChange={(e) => updateForm({ reading: e.target.value })}
        />
      </div>

      {/* Writing */}
      <div className="space-y-1">
        <label className={label}>Writing</label>
        <input
          className={input}
          value={data.writing || ""}
          onChange={(e) => updateForm({ writing: e.target.value })}
        />
      </div>

      {/* Speaking */}
      <div className="space-y-1">
        <label className={label}>Speaking</label>
        <input
          className={input}
          value={data.speaking || ""}
          onChange={(e) => updateForm({ speaking: e.target.value })}
        />
      </div>
    </div>
  );
}
