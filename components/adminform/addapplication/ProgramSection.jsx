export default function ProgramSection({ data, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Program Preferences
      </h3>

      <input
        className={input}
        placeholder="Study Level"
        value={data.studyLevel || ""}
        onChange={(e) => updateForm({ studyLevel: e.target.value })}
      />

      <input
        className={input}
        placeholder="Field"
        value={data.field || ""}
        onChange={(e) => updateForm({ field: e.target.value })}
      />

      <input
        className={input}
        placeholder="Intake"
        value={data.intake || ""}
        onChange={(e) => updateForm({ intake: e.target.value })}
      />

      <input
        className={input}
        placeholder="Budget"
        value={data.budget || ""}
        onChange={(e) => updateForm({ budget: e.target.value })}
      />
    </div>
  );
}
