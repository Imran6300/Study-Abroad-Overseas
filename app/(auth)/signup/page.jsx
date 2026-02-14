"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFail } from "../../../store/authSlice";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    dispatch(authStart());

    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match");
      dispatch(authFail("Passwords do not match"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmpassword: formData.confirmpassword,
          }),
        },
      );
      const data = await res.json();

      if (res.ok && data.success && data.isLoggedIn) {
        dispatch(authSuccess(data.user));
        router.push("/");
      } else {
        const msg = data.errors?.[0] || "Signup failed";
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

  return (
    <div
      className="
    min-h-screen w-full 
    bg-[#F7F9FC]
    flex items-center justify-center 
    px-4 
    pt-8 sm:pt-10 md:pt-16 lg:pt-20        /* ← increased top padding on desktop */
    pb-8 sm:pb-10
  "
    >
      <div
        className="
      w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[380px] md:max-w-[420px]
      mx-auto
    "
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
        bg-white rounded-xl shadow-lg border border-gray-200/70
        p-5 sm:p-6 md:p-7
        max-h-[85vh] sm:max-h-[88vh] overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-300
      "
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-sm">
              <FaGraduationCap className="text-white text-base" />
            </div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Khizar Overseas
            </h1>
          </div>

          <h2 className="text-base font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="text-sm text-gray-600 mt-1 mb-5 sm:mb-6">
            Start your journey toward global opportunities
          </p>

          {error && (
            <p className="text-sm text-red-600 mb-4 bg-red-50 p-2.5 rounded-md">
              {error}
            </p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                className="
                  w-full px-4 py-2.5 rounded-lg border border-gray-300 
                  text-sm outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30
                  transition-colors
                "
                required
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
                className="
                  w-full px-4 py-2.5 rounded-lg border border-gray-300 
                  text-sm outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30
                  transition-colors
                "
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="
                    w-full px-4 py-2.5 rounded-lg border border-gray-300 
                    text-sm outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30
                    transition-colors
                  "
                  required
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
                  className="
                    w-full px-4 py-2.5 rounded-lg border border-gray-300 
                    text-sm outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30
                    transition-colors
                  "
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                mt-3 py-3 rounded-lg
                bg-gradient-to-r from-[#22C55E] to-[#4A6BFF]
                text-white font-semibold text-sm
                shadow-md hover:shadow-lg hover:brightness-105
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3 leading-relaxed">
              By signing up you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#4A6BFF] hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5 sm:mt-6">
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
