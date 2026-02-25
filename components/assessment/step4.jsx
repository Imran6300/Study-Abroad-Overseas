"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Step4({
  prevStep,
  submit,
  loading,
  data,
  updateForm,
  submitStatus,
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
        <button
          onClick={prevStep}
          disabled={loading}
          className="btn-secondary w-full text-white disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading || submitStatus === "success"}
          className={`w-full transition-all duration-300 
    ${
      submitStatus === "success"
        ? "bg-green-600"
        : submitStatus === "error"
          ? "bg-red-600"
          : "btn-primary"
    } 
    disabled:opacity-70`}
        >
          {submitStatus === "loading" && "Submitting..."}
          {submitStatus === "success" && "Submitted Successfully ✓"}
          {submitStatus === "error" && "Submission Failed — Try Again"}
          {submitStatus === "idle" && "Get My Free Assessment 🎓"}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center pt-2">
        Protected by reCAPTCHA
      </p>
    </div>
  );
}
