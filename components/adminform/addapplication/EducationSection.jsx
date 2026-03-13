export default function EducationSection({ data, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Education</h3>

      <input
        className={input}
        placeholder="Qualification"
        value={data.qualification || ""}
        onChange={(e) => updateForm({ qualification: e.target.value })}
      />

      <input
        className={input}
        placeholder="School / University"
        value={data.school || ""}
        onChange={(e) => updateForm({ school: e.target.value })}
      />

      <input
        className={input}
        placeholder="Board"
        value={data.board || ""}
        onChange={(e) => updateForm({ board: e.target.value })}
      />

      <input
        className={input}
        placeholder="Passing Year"
        value={data.passingYear || ""}
        onChange={(e) => updateForm({ passingYear: e.target.value })}
      />

      <input
        className={input}
        placeholder="CGPA / Percentage"
        value={data.cgpa || ""}
        onChange={(e) => updateForm({ cgpa: e.target.value })}
      />

      <input
        className={input}
        placeholder="Backlogs"
        value={data.backlogs || ""}
        onChange={(e) => updateForm({ backlogs: e.target.value })}
      />

      <textarea
        className={input}
        placeholder="Backlogs Explanation"
        value={data.backlogsExplanation || ""}
        onChange={(e) => updateForm({ backlogsExplanation: e.target.value })}
      />
    </div>
  );
}
