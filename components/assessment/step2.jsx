export default function Step2({ data, updateForm, nextStep, prevStep }) {
  return (
    <div className="space-y-5">
      <select
        value={data.education}
        onChange={(e) => updateForm({ education: e.target.value })}
        className="input"
      >
        <option value="">Highest Qualification</option>
        <option>12th</option>
        <option>Diploma</option>
        <option>Bachelor's</option>
        <option>Master's</option>
      </select>

      <input
        type="text"
        placeholder="Field of Study"
        value={data.field}
        onChange={(e) => updateForm({ field: e.target.value })}
        className="input"
      />

      <input
        type="text"
        placeholder="Year of Passing"
        value={data.year}
        onChange={(e) => updateForm({ year: e.target.value })}
        className="input"
      />

      <div className="flex justify-between gap-4">
        <button onClick={prevStep} className="btn-secondary w-full text-white">
          ← Back
        </button>
        <button onClick={nextStep} className="btn-primary w-full">
          Continue →
        </button>
      </div>
    </div>
  );
}
