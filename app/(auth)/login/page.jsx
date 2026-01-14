"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authStart, authSuccess, authFail } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    dispatch(authStart());

    try {
      const res = await fetch(
        "https://overseas-backend-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.errors?.[0] || "Invalid email or password";
        dispatch(authFail(msg));
        setErrorMsg(msg);
        return;
      }

      dispatch(authSuccess(data.user));
      router.push("/");
    } catch {
      dispatch(authFail("Server error"));
      setErrorMsg("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 flex items-center justify-center relative bg-[#F7F9FC] overflow-hidden">
      {/* BACKGROUND BLOBS */}
      <div className="absolute w-56 h-56 bg-[#4A6BFF]/20 blur-3xl rounded-full top-0 left-0 -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute w-56 h-56 bg-[#22C55E]/20 blur-3xl rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-md">
            <FaGraduationCap className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Khizar Overseas</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-600 mb-6">
          Continue your study abroad journey
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

        {/* FORM */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="john@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
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
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3 rounded-xl font-semibold shadow-lg transition-all
              ${
                loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white hover:opacity-95"
              }
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#4A6BFF] font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
