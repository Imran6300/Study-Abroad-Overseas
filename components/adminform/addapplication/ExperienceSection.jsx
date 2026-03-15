export default function ExperienceSection({ data = {}, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";
  const label = "text-sm font-medium text-gray-700";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">Experience</h3>

      {/* Career Goals */}
      <div className="space-y-1">
        <label className={label}>Career Goals</label>
        <textarea
          className={input}
          value={data.careerGoals || ""}
          onChange={(e) => updateForm({ careerGoals: e.target.value })}
        />
      </div>

      {/* Activities */}
      <div className="space-y-1">
        <label className={label}>Activities</label>
        <textarea
          className={input}
          value={data.activities || ""}
          onChange={(e) => updateForm({ activities: e.target.value })}
        />
      </div>

      {/* Experience */}
      <div className="space-y-1">
        <label className={label}>Work / Internship Experience</label>
        <textarea
          className={input}
          value={data.experience || ""}
          onChange={(e) => updateForm({ experience: e.target.value })}
        />
      </div>
    </div>
  );
}
