"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data?.errors?.[0] || data?.message || "Something went wrong.",
        );
        return;
      }

      // Always show success — backend never reveals if email exists (anti-enumeration)
      setSent(true);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen pt-[76px] w-full px-4 sm:px-6 flex items-center justify-center bg-[#F7F9FC]">
      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-56 h-56 bg-[#4A6BFF]/20 blur-3xl rounded-full top-0 left-0 -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute w-56 h-56 bg-[#22C55E]/20 blur-3xl rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[360px] bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/60 p-4 sm:p-5"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-md">
            <FaGraduationCap className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Khizar Overseas</h1>
        </div>

        <AnimatePresence mode="wait">
          {/* ── SUCCESS STATE ─────────────────────────────────────────── */}
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              {/* Envelope icon */}
              <div className="w-14 h-14 rounded-full bg-[#4A6BFF]/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-[#4A6BFF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Check your inbox
              </h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                If <span className="font-medium text-gray-700">{email}</span> is
                registered, a password reset link has been sent. It expires in{" "}
                <strong>1 hour</strong>.
              </p>

              <p className="text-xs text-gray-400 mb-4">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-[#4A6BFF] hover:underline font-medium"
                >
                  try again
                </button>
                .
              </p>

              <Link
                href="/login"
                className="block w-full py-2.5 rounded-lg text-sm font-semibold text-center bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white hover:opacity-95 transition-all shadow-md"
              >
                Back to Login
              </Link>
            </motion.div>
          ) : (
            /* ── FORM STATE ─────────────────────────────────────────── */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Forgot password?
              </h2>
              <p className="text-sm text-gray-500 mb-5 mt-1 leading-relaxed">
                Enter the email you signed up with and we&apos;ll send you a
                reset link.
              </p>

              {/* ERROR */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="john@example.com"
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-1 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition-all
                    ${
                      loading
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white hover:opacity-95"
                    }
                  `}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Remember it?{" "}
                <Link
                  href="/login"
                  className="text-[#4A6BFF] font-semibold hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
