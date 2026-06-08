"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  // If no token in URL, redirect to forgot-password immediately
  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data?.errors?.[0] ||
            data?.message ||
            "Reset link is invalid or has expired. Please request a new one.",
        );
        return;
      }

      setDone(true);

      // Auto-redirect to login with success param after 2.5s
      setTimeout(() => {
        router.push("/login?reset=true");
      }, 2500);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength helper
  const strength = (() => {
    if (!password) return null;
    if (password.length < 8)
      return { label: "Too short", color: "bg-red-400", width: "w-1/4" };
    if (password.length < 10)
      return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
    if (score >= 2)
      return { label: "Strong", color: "bg-green-500", width: "w-full" };
    return { label: "Fair", color: "bg-yellow-400", width: "w-3/4" };
  })();

  if (!token) return null;

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
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-[#22C55E]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Password updated!
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Redirecting you to login...
              </p>
              <Link
                href="/login"
                className="block w-full py-2.5 rounded-lg text-sm font-semibold text-center bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white hover:opacity-95 transition-all shadow-md"
              >
                Login Now
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
                Set new password
              </h2>
              <p className="text-sm text-gray-500 mb-5 mt-1">
                Choose a strong password for your account.
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
                    {errorMsg}{" "}
                    {errorMsg.includes("expired") && (
                      <Link
                        href="/forgot-password"
                        className="underline font-medium"
                      >
                        Request a new link
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                {/* NEW PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      className="w-full mt-1 px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${strength.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: strength.width }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Strength:{" "}
                        <span
                          className={
                            strength.label === "Strong"
                              ? "text-green-600"
                              : strength.label === "Too short"
                                ? "text-red-500"
                                : "text-yellow-600"
                          }
                        >
                          {strength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      className={`w-full mt-1 px-4 py-3 pr-12 rounded-xl border outline-none text-sm transition-colors
                        ${
                          confirm && confirm !== password
                            ? "border-red-300 focus:border-red-400"
                            : confirm && confirm === password
                              ? "border-green-400 focus:border-green-500"
                              : "border-gray-200 focus:border-[#4A6BFF]"
                        }
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords don&apos;t match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (confirm && confirm !== password)}
                  className={`w-full mt-1 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition-all
                    ${
                      loading || (confirm && confirm !== password)
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white hover:opacity-95"
                    }
                  `}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
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
