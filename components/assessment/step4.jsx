export default function Step4({
  data,
  updateForm,
  prevStep,
  submit,
  loading,
  isLoggedIn,
  authChecked,
}) {
  return (
    <div className="space-y-5">
      {/* Exam Status */}
      <select
        value={data.examStatus}
        onChange={(e) => updateForm({ examStatus: e.target.value })}
        className="input"
        required
      >
        <option value="">IELTS / TOEFL Status</option>
        <option value="Taken">Taken</option>
        <option value="Planning">Planning</option>
        <option value="Not Required">Not Required</option>
      </select>

      {/* Experience */}
      <select
        value={data.experience}
        onChange={(e) => updateForm({ experience: e.target.value })}
        className="input"
        required
      >
        <option value="">Work Experience</option>
        <option value="Fresher">Fresher</option>
        <option value="1–2 Years">1–2 Years</option>
        <option value="3+ Years">3+ Years</option>
      </select>

      {/* Actions */}
      <div className="flex justify-between gap-4 pt-2">
        <button
          onClick={prevStep}
          disabled={loading}
          className="btn-secondary w-full text-white disabled:opacity-50"
        >
          ← Back
        </button>

        {/* Auth-aware submit button */}
        {!authChecked ? (
          <button
            disabled
            className="btn-primary w-full opacity-60 cursor-not-allowed"
          >
            Checking authentication...
          </button>
        ) : !isLoggedIn ? (
          <button onClick={submit} className="btn-primary w-full">
            Login / Signup to Continue 🔐
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Get My Free Assessment 🎓"}
          </button>
        )}
      </div>

      {/* Trust message */}
      <p className="text-xs text-gray-400 text-center pt-2">
        No spam • Free consultation • Secure submission
      </p>
    </div>
  );
}
