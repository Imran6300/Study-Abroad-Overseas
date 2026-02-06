// components/adminform/universityform/StepDescriptionCourses.jsx
export default function StepDescriptionCourses({ form, onChange, isViewMode }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Description & Programs</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">University Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          disabled={isViewMode}
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
          placeholder="Brief overview of the university, history, strengths, campus life, etc."
        />
      </div>

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
          placeholder="Computer Science, Artificial Intelligence, Mechanical Engineering, Business Administration, Physics, ..."
        />
      </div>
    </section>
  );
}