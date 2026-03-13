export default function ExperienceSection({ data, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Experience</h3>

      <textarea
        className={input}
        placeholder="Career Goals"
        value={data.careerGoals || ""}
        onChange={(e) => updateForm({ careerGoals: e.target.value })}
      />

      <textarea
        className={input}
        placeholder="Activities"
        value={data.activities || ""}
        onChange={(e) => updateForm({ activities: e.target.value })}
      />

      <textarea
        className={input}
        placeholder="Experience"
        value={data.experience || ""}
        onChange={(e) => updateForm({ experience: e.target.value })}
      />
    </div>
  );
}
