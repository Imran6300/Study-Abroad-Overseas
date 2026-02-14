"use client";

const CATEGORIES = ["engineering", "business", "healthcare"];
const LEVELS = ["bachelor", "master", "phd"];

export default function StepDescriptionCourses({
  form,
  setForm,
  onChange,
  isViewMode,
}) {
  // Add new program row
  const handleAddProgram = () => {
    setForm((prev) => ({
      ...prev,
      programs: [...(prev.programs || []), { category: "", level: "" }],
    }));
  };

  // Remove program row
  const handleRemoveProgram = (index) => {
    const updated = [...form.programs];
    updated.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      programs: updated,
    }));
  };

  // Update category or level
  const handleProgramChange = (index, field, value) => {
    const updated = [...form.programs];
    updated[index][field] = value;

    setForm((prev) => ({
      ...prev,
      programs: updated,
    }));
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Description & Programs
      </h2>

      {/* ================= DESCRIPTION ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          University Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          disabled={isViewMode}
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
          placeholder="Brief overview of the university..."
        />
      </div>

      {/* ================= COURSES ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Popular / Offered Courses (comma separated)
        </label>
        <textarea
          name="courses"
          value={form.courses}
          onChange={onChange}
          disabled={isViewMode}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
          placeholder="Computer Science, AI, Mechanical Engineering..."
        />
      </div>

      {/* ================= PROGRAMS ================= */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            Programs (Category + Level)
          </label>

          {!isViewMode && (
            <button
              type="button"
              onClick={handleAddProgram}
              className="px-3 py-1.5 bg-sky-600 text-white rounded-md text-sm hover:bg-sky-700"
            >
              + Add Program
            </button>
          )}
        </div>

        {form.programs?.length === 0 && (
          <p className="text-sm text-gray-400">No programs added yet.</p>
        )}

        {form.programs?.map((program, index) => (
          <div
            key={index}
            className="flex gap-3 items-center border p-3 rounded-lg bg-gray-50"
          >
            {/* Category */}
            <select
              disabled={isViewMode}
              value={program.category}
              onChange={(e) =>
                handleProgramChange(index, "category", e.target.value)
              }
              className="flex-1 px-3 py-2 border rounded-md"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Level */}
            <select
              disabled={isViewMode}
              value={program.level}
              onChange={(e) =>
                handleProgramChange(index, "level", e.target.value)
              }
              className="flex-1 px-3 py-2 border rounded-md"
            >
              <option value="">Select Level</option>
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Remove */}
            {!isViewMode && (
              <button
                type="button"
                onClick={() => handleRemoveProgram(index)}
                className="text-red-500 font-bold px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
