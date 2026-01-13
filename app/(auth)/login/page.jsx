"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFail } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    dispatch(authStart());

    try {
      const res = await fetch("http://localhost:3020/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 REQUIRED for sessions
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        dispatch(authFail(data.errors?.[0] || "Login failed"));
        setErrorMsg(data.errors?.[0] || "Invalid credentials");
        return;
      }

      dispatch(authSuccess(data.user));

      // Redirect after successful login
      router.push("/");
    } catch (err) {
      dispatch(authFail("Server error"));
      setErrorMsg("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 flex items-center justify-center relative bg-[#F7F9FC] overflow-hidden">
      {/* BACKGROUND BLOBS */}
      <div className="absolute pointer-events-none w-56 h-56 bg-[#4A6BFF]/20 blur-3xl rounded-full top-0 left-0 -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute pointer-events-none w-56 h-56 bg-[#22C55E]/20 blur-3xl rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3" />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-20 w-full max-w-[420px] bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/50 p-6 sm:p-8"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-md">
            <FaGraduationCap className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Khizar Overseas</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Continue your study abroad journey
        </p>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {errorMsg}
          </p>
        )}

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
              placeholder="john@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white font-semibold shadow-lg hover:opacity-95 transition-all"
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#4A6BFF] font-semibold">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
