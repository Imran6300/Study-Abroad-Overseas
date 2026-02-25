"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Step4({ prevStep, submit, loading }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  console.log("executeRecaptcha:", executeRecaptcha);

  const handleSubmit = async () => {
    if (loading) return;

    if (!executeRecaptcha) {
      console.log("Recaptcha not ready");
      return;
    }

    const token = await executeRecaptcha("lead_submit");

    submit(token); // pass token to parent
  };

  return (
    <div className="space-y-5">
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
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Get My Free Assessment 🎓"}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center pt-2">
        Protected by reCAPTCHA
      </p>
    </div>
  );
}
