import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Step4({
  data,
  updateForm,
  prevStep,
  submit,
  loading,
  isLoggedIn,
  authChecked,
}) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async () => {
    if (!executeRecaptcha) {
      console.log("Recaptcha not ready");
      return;
    }

    const token = await executeRecaptcha("lead_submit");

    submit(token); // 👈 pass token to parent submit
  };

  return (
    <div className="space-y-5">
      {/* your select inputs unchanged */}

      <div className="flex justify-between gap-4 pt-2">
        <button
          onClick={prevStep}
          disabled={loading}
          className="btn-secondary w-full text-white disabled:opacity-50"
        >
          ← Back
        </button>

        {!authChecked ? (
          <button
            disabled
            className="btn-primary w-full opacity-60 cursor-not-allowed"
          >
            Checking authentication...
          </button>
        ) : (
          <button
            onClick={handleSubmit} // 👈 use handleSubmit
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading
              ? "Submitting..."
              : isLoggedIn
                ? "Get My Free Assessment 🎓"
                : "Login / Signup to Continue 🔐"}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center pt-2">
        Protected by reCAPTCHA
      </p>
    </div>
  );
}
