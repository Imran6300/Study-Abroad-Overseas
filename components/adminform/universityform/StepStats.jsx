// components/adminform/universityform/StepStats.jsx
export default function StepStats({ form, onChange, isViewMode }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">University Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">QS Ranking</label>
          <input
            type="number"
            name="qsRanking"
            value={form.qsRanking}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="e.g. 1"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Rate (%)</label>
          <input
            type="text"
            name="acceptanceRate"
            value={form.acceptanceRate}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="e.g. 4%"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
          <input
            type="number"
            name="numStudents"
            value={form.numStudents}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="e.g. 11500"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fees (approx.)</label>
          <input
            type="text"
            name="tuitionFees"
            value={form.tuitionFees}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="e.g. $60,000 - $80,000 / year"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Students Placed (our record)</label>
          <input
            type="number"
            name="studentsPlaced"
            value={form.studentsPlaced}
            onChange={onChange}
            disabled={isViewMode}
            placeholder="e.g. 28"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </section>
  );
}