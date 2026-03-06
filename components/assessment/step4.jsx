"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Step4({
  prevStep,
  submit,
  loading,
  data,
  updateForm,
  submitStatus,
  isEdit,
}) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const isValid = data.examStatus && data.experience;

  const handleSubmit = async () => {
    if (loading) return;

    if (!isValid) {
      alert("Please select exam status and work experience");
      return;
    }

    if (!executeRecaptcha) {
      console.log("Recaptcha not ready");
      return;
    }

    const token = await executeRecaptcha("lead_submit");

    submit(token);
  };

  return (
    <div className="space-y-5">
      {/* Exam Status */}
      <select
        value={data.examStatus}
        onChange={(e) => updateForm({ examStatus: e.target.value })}
        className="input"
      >
        <option value="">Exam Status</option>
        <option>IELTS Completed</option>
        <option>Planning to Take</option>
        <option>Not Required</option>
      </select>

      {/* Work Experience */}
      <select
        value={data.experience}
        onChange={(e) => updateForm({ experience: e.target.value })}
        className="input"
      >
        <option value="">Work Experience</option>
        <option>0 Years</option>
        <option>1-2 Years</option>
        <option>3+ Years</option>
      </select>

      <div className="flex justify-between gap-4 pt-2">
        {/* Back */}
        <button
          onClick={prevStep}
          disabled={loading}
          className="btn-secondary w-full text-white disabled:opacity-50"
        >
          ← Back
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full btn-primary transition-all duration-300 disabled:opacity-70"
        >
          {loading
            ? "Updating..."
            : isEdit
              ? "Update My Assessment ✏️"
              : "Get My Free Assessment 🎓"}
        </button>
      </div>

      {/* ✅ PUT IT RIGHT HERE */}
      <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300"
        >
          Terms of Service
        </a>{" "}
        apply.
      </p>
    </div>
  );
}
