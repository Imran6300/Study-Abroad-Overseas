"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ActivateAccountPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (!password || !confirmPassword) {
      return setErrorMsg("Please fill all fields.");
    }

    if (password.length < 8) {
      return setErrorMsg("Password must be at least 8 characters long.");
    }

    if (password !== confirmPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/activate-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || data?.errors?.[0] || "Activation failed.",
        );
      }

      setSuccessMsg("Account activated successfully. Redirecting to login...");

      setTimeout(() => {
        router.replace("/login?activated=true");
      }, 2500);
    } catch (error) {
      setErrorMsg(error.message || "Something went wrong.");
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
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-[360px] bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/60 p-5"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-md">
            <FaGraduationCap className="text-white text-xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">Khizar Overseas</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          Activate Account
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Create a password to access your counselor dashboard.
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

        {/* SUCCESS */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Create Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition-all
            ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white hover:opacity-95"
            }`}
          >
            {loading ? "Activating..." : "Activate Account"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
