"use client";

import { useState } from "react";

export default function Step8Final({ data, updateForm, prevStep, submit }) {
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, failed
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

  const handlePaymentAndSubmit = async () => {
    if (!data.agreed) return;

    setPaymentStatus("processing");
    setErrorMsg("");

    try {
      // Step 1: Call your backend API to create Razorpay order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 2999, // Change to dynamic later if you add plan selector
          currency: "INR",
          receipt: `khizar-app-${Date.now()}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create payment order");
      }

      const { orderId, amount, currency, key } = await res.json();

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: key, // Public key from backend
        amount: amount,
        currency: currency,
        name: "Khizar Overseas",
        description: "Application Processing Fee - Basic Plan",
        order_id: orderId,
        handler: function (response) {
          // Payment success callback
          console.log("Payment successful:", response);
          setPaymentStatus("success");

          // Call your original submit function (save to DB, send email, etc.)
          submit();

          // Optional: Redirect to dashboard or show success message
          // window.location.href = "/dashboard?success=true";
        },
        prefill: {
          name: data.fullName || "",
          email: data.email || "",
          contact: data.mobile || "",
        },
        theme: {
          color: "#6366f1", // indigo/blue - matches your brand
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus("idle");
          },
        },
      };

      // Initialize Razorpay (script should be loaded in layout or page)
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMsg(err.message || "Payment failed. Please try again.");
      setPaymentStatus("failed");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Final Review & Payment
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

      {/* === PAYMENT SECTION – THIS IS THE EXACT PLACE === */}
      <div className="pt-8 border-t border-gray-200">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
            Application Processing Fee
          </h3>
          <p className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
            ₹2,999
          </p>
          <div className="flex flex-col items-center gap-2 text-sm text-gray-700 mb-4">
            <p>✓ Apply to up to 3 universities</p>
            <p>✓ Application tracking dashboard</p>
            <p>✓ Dedicated application support</p>
          </div>
          <p className="text-xs text-gray-500 text-center">
            University application fees are paid separately directly to the
            university.
          </p>
        </div>

        {/* Pay & Submit Button */}
        <button
          onClick={handlePaymentAndSubmit}
          disabled={paymentStatus === "processing" || !data.agreed}
          className={`
            w-full py-4 px-8 rounded-xl font-bold text-white text-lg shadow-xl
            transition-all duration-300 transform
            ${
              paymentStatus === "processing"
                ? "bg-gray-400 cursor-wait animate-pulse"
                : data.agreed
                  ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          {paymentStatus === "processing"
            ? "Processing Payment... Please wait"
            : "Pay ₹2,999 & Submit Application"}
        </button>

        {/* Status Messages */}
        {errorMsg && (
          <p className="text-red-600 font-medium text-center mt-4">
            {errorMsg}
          </p>
        )}

        {paymentStatus === "success" && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
            <svg
              className="w-16 h-16 text-green-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h4 className="text-xl font-bold text-green-700 mb-2">
              Payment Successful!
            </h4>
            <p className="text-gray-700">
              Your application is now being processed. You’ll receive
              confirmation soon.
              <br />
              Check your dashboard for status updates.
            </p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={prevStep}
          disabled={paymentStatus === "processing"}
          className="py-3 px-10 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          ← Back to Documents
        </button>
      </div>
    </div>
  );
}
