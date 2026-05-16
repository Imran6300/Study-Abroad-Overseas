"use client";

import { useState } from "react";

export default function Step7Final({ data, updateForm, prevStep, submit }) {
  const [submitStatus, setPaymentStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border border-gray-300 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
    transition-all duration-200 outline-none
    hover:border-gray-400
  `;

  const textareaClasses = `
    w-full px-4 py-3 rounded-xl border border-gray-300 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
    transition-all duration-200 outline-none
    hover:border-gray-400 resize-none
  `;

  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

  const handleSubmit = async () => {
    if (!data.agreed) {
      setErrorMsg("Please accept the agreement.");
      return;
    }

    try {
      setPaymentStatus("processing");

      await submit();

      setPaymentStatus("success");

      setTimeout(() => {
        window.location.href = "/dashboard/user";
      }, 1500);
    } catch (err) {
      setPaymentStatus("failed");
      setErrorMsg("Failed to submit application.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Final Review & Submit
      </h2>

      {/* How did you hear about us? */}
      <div>
        <label className={labelClasses}>How did you hear about us?</label>
        <select
          className={inputClasses}
          onChange={(e) => updateForm({ source: e.target.value })}
          value={data.source}
        >
          <option value="">Select Source</option>
          <option>Google</option>
          <option>Instagram</option>
          <option>Friend</option>
          <option>Advertisement</option>
          <option>Other</option>
        </select>
      </div>

      {/* Comments */}
      <div>
        <label className={labelClasses}>Any questions or comments?</label>
        <textarea
          placeholder="Share any additional information..."
          className={`${textareaClasses} h-28`}
          value={data.comments}
          onChange={(e) => updateForm({ comments: e.target.value })}
        />
      </div>

      {/* Agreement Checkbox */}
      <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-all duration-200">
        <input
          type="checkbox"
          className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500"
          checked={data.agreed}
          onChange={(e) => updateForm({ agreed: e.target.checked })}
        />
        <span className="text-sm text-gray-700 leading-relaxed">
          I confirm that the information provided is accurate and authorize{" "}
          <strong>Khizar Overseas</strong> to assist with preparing and
          submitting my university applications on my behalf. I understand that
          admission decisions are made solely by the university.
        </span>
      </label>

      <div className="pt-8 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={submitStatus === "processing" || !data.agreed}
          className={`
      w-full py-4 px-8 rounded-xl font-bold text-white text-lg shadow-xl
      transition-all duration-300 transform
      ${
        submitStatus === "processing"
          ? "bg-gray-400 cursor-wait animate-pulse"
          : data.agreed
            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            : "bg-gray-300 cursor-not-allowed"
      }
    `}
        >
          {submitStatus === "processing"
            ? "Submitting Application..."
            : "Submit Application"}
        </button>

        {errorMsg && (
          <p className="text-red-600 font-medium text-center mt-4">
            {errorMsg}
          </p>
        )}

        {submitStatus === "success" && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
            <h4 className="text-xl font-bold text-green-700 mb-2">
              Application Submitted Successfully!
            </h4>

            <p className="text-gray-700">
              Your application has been submitted successfully.
              <br />
              Our counselors will contact you soon.
            </p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={prevStep}
          disabled={submitStatus === "processing"}
          className="py-3 px-10 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          ← Back to Finance
        </button>
      </div>
    </div>
  );
}
