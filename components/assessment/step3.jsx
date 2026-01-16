export default function Step3({ data, updateForm, nextStep, prevStep }) {
  return (
    <div className="space-y-5">
      <select
        value={data.country}
        onChange={(e) => updateForm({ country: e.target.value })}
        className="input"
      >
        <option value="">Preferred Country</option>
        <option>USA</option>
        <option>UK</option>
        <option>Canada</option>
        <option>Australia</option>
        <option>Germany</option>
        <option>Not Sure</option>
      </select>

      <select
        value={data.intake}
        onChange={(e) => updateForm({ intake: e.target.value })}
        className="input"
      >
        <option value="">Preferred Intake</option>
        <option>Fall</option>
        <option>Spring</option>
        <option>Not Sure</option>
      </select>

      <input
        type="text"
        placeholder="Budget per Year (USD)"
        value={data.budget}
        onChange={(e) => updateForm({ budget: e.target.value })}
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
