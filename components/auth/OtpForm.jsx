"use client";

import { useEffect } from "react";

export default function OtpForm({
  otp,
  setOtp,
  loading,
  handleVerifyOtp,
  email,
  error,
  resendOtp,
  timeLeft,
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Verify your email
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        <label className="block text-xs font-medium text-gray-700 mb-1">
          Enter OTP
        </label>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setOtp(val);
          }}
          placeholder="123456"
          className="w-full px-3 py-2.5 text-center text-lg font-medium tracking-widest rounded-lg border border-gray-300 outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30 transition-colors"
          required
          autoFocus
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="py-2.5 rounded-lg bg-gradient-to-r from-[#22C55E] to-[#4A6BFF] text-white font-medium text-sm hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center text-xs text-gray-600 mt-2">
        {timeLeft > 0 ? (
          <p>
            Resend code in{" "}
            <span className="font-medium text-gray-800">{timeDisplay}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={resendOtp}
            className="text-[#4A6BFF] hover:underline font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </form>
  );
}
