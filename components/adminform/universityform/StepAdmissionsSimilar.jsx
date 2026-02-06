// components/adminform/universityform/StepAdmissionsSimilar.jsx
export default function StepAdmissionsSimilar({ form, onChange, isViewMode }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Admissions & Similar Universities</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Intakes / Sessions</label>
        <input
          type="text"
          name="intakes"
          value={form.intakes}
          onChange={onChange}
          disabled={isViewMode}
          placeholder="Fall (Sep), Winter (Jan), Summer (May)"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Admission Requirements</label>
        <textarea
          name="admissionRequirements"
          value={form.admissionRequirements}
          onChange={onChange}
          disabled={isViewMode}
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
          placeholder="High school diploma / equivalent, Minimum GPA 3.8+, SAT/ACT (optional), TOEFL/IELTS 7.0+, Essays, Letters of Recommendation, ..."
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Similar / Comparable Universities (up to 3)</label>
        {[0, 1, 2].map((idx) => (
          <input
            key={idx}
            type="text"
            name={`similarUniversities-${idx}`}
            value={form.similarUniversities[idx] || ""}
            onChange={onChange}
            disabled={isViewMode}
            placeholder={`e.g. Stanford University`}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        ))}
      </div>
    </section>
  );
}