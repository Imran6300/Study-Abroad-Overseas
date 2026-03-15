export default function ProgramSection({ data = {}, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";
  const label = "text-sm font-medium text-gray-700";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">
        Program Preferences
      </h3>

      {/* Study Level */}
      <div className="space-y-1">
        <label className={label}>Study Level</label>
        <input
          className={input}
          value={data.studyLevel || ""}
          onChange={(e) => updateForm({ studyLevel: e.target.value })}
        />
      </div>

      {/* Field */}
      <div className="space-y-1">
        <label className={label}>Field of Study</label>
        <input
          className={input}
          value={data.field || ""}
          onChange={(e) => updateForm({ field: e.target.value })}
        />
      </div>

      {/* Intake */}
      <div className="space-y-1">
        <label className={label}>Preferred Intake</label>
        <input
          className={input}
          value={data.intake || ""}
          onChange={(e) => updateForm({ intake: e.target.value })}
        />
      </div>

      {/* Budget */}
      <div className="space-y-1">
        <label className={label}>Budget (Annual Tuition)</label>
        <input
          className={input}
          value={data.budget || ""}
          onChange={(e) => updateForm({ budget: e.target.value })}
        />
      </div>
    </div>
  );
}
