"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFail } from "../../../store/authSlice";
import OtpForm from "@/components/auth/OtpForm";

// ────────────────────────────────────────────────
//  Signup Form Component
// ────────────────────────────────────────────────
const SignupForm = ({
  formData,
  handleChange,
  loading,
  handleSubmitSignup,
  error,
}) => (
  <form className="flex flex-col gap-3.5" onSubmit={handleSubmitSignup}>
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Full name
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="John Doe"
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30 transition-colors"
        required
        autoComplete="name"
      />
    </div>

    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="john@example.com"
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30 transition-colors"
        required
        autoComplete="email"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30 transition-colors"
          required
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Confirm
        </label>
        <input
          type="password"
          name="confirmpassword"
          value={formData.confirmpassword}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30 transition-colors"
          required
          autoComplete="new-password"
        />
      </div>
    </div>

    <a
      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
      className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition mt-1"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-4 h-4"
      />
      Continue with Google
    </a>

    <div className="flex items-center gap-2 text-xs text-gray-400 my-1.5">
      <div className="flex-1 h-px bg-gray-300"></div>
      OR
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="py-2.5 rounded-lg bg-gradient-to-r from-[#22C55E] to-[#4A6BFF] text-white font-medium text-sm hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Creating..." : "Create Account"}
    </button>

    <p className="text-center text-xs text-gray-500 mt-3">
      By signing up you agree to our{" "}
      <Link href="/privacy-policy" className="text-[#4A6BFF] hover:underline">
        Privacy Policy
      </Link>
    </p>

    {error && (
      <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-md text-center">
        {error}
      </p>
    )}
  </form>
);

// ────────────────────────────────────────────────
//  OTP Form Component with 10 min countdown
// ────────────────────────────────────────────────

// ────────────────────────────────────────────────
//  Main Signup Page
// ────────────────────────────────────────────────
export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // seconds

  const dispatch = useDispatch();

  // Start 10-minute countdown when entering OTP step
  useEffect(() => {
    if (step === 2 && timeLeft === 0) {
      setTimeLeft(10 * 60); // 600 seconds = 10 minutes
    }
  }, [step]);

  // Countdown logic
  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    setError("");

    const password = formData.password.trim();
    const confirmPassword = formData.confirmpassword.trim();

    if (!password || !confirmPassword) {
      setError("Password fields cannot be empty");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    dispatch(authStart());

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password,
            confirmpassword: confirmPassword,
          }),
        },
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setStep(2);
        setError("");
      } else {
        const msg = data.errors?.[0] || data.message || "Signup failed";
        setError(msg);
        dispatch(authFail(msg));
      }
    } catch (err) {
      setError("Server error. Please try again.");
      dispatch(authFail("Server error"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email.trim(),
            otp: otp.trim(),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        const msg = data.errors?.[0] || data.message || "Invalid OTP";
        setError(msg);
        dispatch(authFail(msg));
        return;
      }

      dispatch(authSuccess(data.user));
      window.location.href = "/";
    } catch (err) {
      setError("Server error. Please try again.");
      dispatch(authFail("Server error"));
    } finally {
      setLoading(false);
    }
  };

  // For now just go back — you can later make this call a real resend endpoint
  const handleResendOtp = () => {
    setOtp("");
    setError("");
    setStep(1);
    // Optional: you could call the signup endpoint again here
    // or a dedicated /resend-otp endpoint
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen w-full bg-[#F7F9FC] flex items-center justify-center px-4 pb-10 pt-20">
      {" "}
      <div className="w-full max-w-[min(92vw,360px)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-md border border-gray-200/70 p-5 sm:p-6"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-sm">
              <FaGraduationCap className="text-white text-lg" />
            </div>
            <h1 className="text-base font-bold text-gray-800 tracking-tight">
              Khizar Overseas
            </h1>
          </div>

          {step === 1 ? (
            <>
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Create your account
              </h2>
              <p className="text-xs text-gray-600 mb-5">
                Start your journey toward global opportunities
              </p>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Verify your email
              </h2>
              <p className="text-xs text-gray-600 mb-5">One more step...</p>
            </>
          )}

          {step === 1 ? (
            <SignupForm
              formData={formData}
              handleChange={handleChange}
              loading={loading}
              handleSubmitSignup={handleSubmitSignup}
              error={error}
            />
          ) : (
            <OtpForm
              otp={otp}
              setOtp={setOtp}
              loading={loading}
              handleVerifyOtp={handleVerifyOtp}
              email={formData.email}
              error={error}
              setStep={setStep}
              resendOtp={handleResendOtp}
              timeLeft={timeLeft}
            />
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#4A6BFF] font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
