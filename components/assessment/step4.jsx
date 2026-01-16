export default function Step4({ data, updateForm, prevStep, submit }) {
  return (
    <div className="space-y-5">
      <select
        value={data.examStatus}
        onChange={(e) => updateForm({ examStatus: e.target.value })}
        className="input"
      >
        <option value="">IELTS / TOEFL Status</option>
        <option>Taken</option>
        <option>Planning</option>
        <option>Not Required</option>
      </select>

      <select
        value={data.experience}
        onChange={(e) => updateForm({ experience: e.target.value })}
        className="input"
      >
        <option value="">Work Experience</option>
        <option>Fresher</option>
        <option>1–2 Years</option>
        <option>3+ Years</option>
      </select>

      <div className="flex justify-between gap-4">
        <button onClick={prevStep} className="btn-secondary w-full text-white">
          ← Back
        </button>
        <button onClick={submit} className="btn-primary w-full">
          Get My Free Assessment 🎓
        </button>
      </div>
    </div>
  );
}
