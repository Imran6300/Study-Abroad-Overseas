export default function EducationSection({ data = {}, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";
  const label = "text-sm font-medium text-gray-700";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">Education</h3>

      {/* Qualification */}
      <div className="space-y-1">
        <label className={label}>Qualification</label>
        <input
          className={input}
          value={data.qualification || ""}
          onChange={(e) => updateForm({ qualification: e.target.value })}
        />
      </div>

      {/* School / University */}
      <div className="space-y-1">
        <label className={label}>School / University</label>
        <input
          className={input}
          value={data.school || ""}
          onChange={(e) => updateForm({ school: e.target.value })}
        />
      </div>

      {/* Board */}
      <div className="space-y-1">
        <label className={label}>Board</label>
        <input
          className={input}
          value={data.board || ""}
          onChange={(e) => updateForm({ board: e.target.value })}
        />
      </div>

      {/* Passing Year */}
      <div className="space-y-1">
        <label className={label}>Passing Year</label>
        <input
          className={input}
          value={data.passingYear || ""}
          onChange={(e) => updateForm({ passingYear: e.target.value })}
        />
      </div>

      {/* CGPA / Percentage */}
      <div className="space-y-1">
        <label className={label}>CGPA / Percentage</label>
        <input
          className={input}
          value={data.cgpa || ""}
          onChange={(e) => updateForm({ cgpa: e.target.value })}
        />
      </div>

      {/* Backlogs */}
      <div className="space-y-1">
        <label className={label}>Backlogs</label>
        <input
          className={input}
          value={data.backlogs || ""}
          onChange={(e) => updateForm({ backlogs: e.target.value })}
        />
      </div>

      {/* Backlogs Explanation */}
      <div className="space-y-1">
        <label className={label}>Backlogs Explanation</label>
        <textarea
          className={input}
          value={data.backlogsExplanation || ""}
          onChange={(e) => updateForm({ backlogsExplanation: e.target.value })}
        />
      </div>
    </div>
  );
}
