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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
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
            password: password,
          }),
        },
      );

      const data = await res.json();
      console.log("Signup Response:", data);

      if (res.ok && data.success) {
        router.push(`/verify-otp?email=${formData.email}`);
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

  return (
    <div
      className="
        min-h-screen w-full bg-[#F7F9FC]
    flex items-center justify-center
    px-4 pb-10
    pt-20 sm:pt-24 md:pt-[100px] lg:pt-28
      "
    >
      <div className="w-full max-w-[min(92vw,360px)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            bg-white rounded-xl shadow-md border border-gray-200/70
            p-5 sm:p-6
          "
        >
          {/* Logo + brand */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-sm">
              <FaGraduationCap className="text-white text-lg" />
            </div>
            <h1 className="text-base font-bold text-gray-800 tracking-tight">
              Khizar Overseas
            </h1>
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Create your account
          </h2>
          <p className="text-xs text-gray-600 mb-4">
            Start your journey toward global opportunities
          </p>

          {error && (
            <p className="text-xs text-red-600 mb-4 bg-red-50 p-2 rounded-md">
              {error}
            </p>
          )}

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
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
                  w-full px-3 py-2 text-sm rounded-lg border border-gray-300
                  outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30
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
                  w-full px-3 py-2 text-sm rounded-lg border border-gray-300
                  outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30
                  transition-colors
                "
                required
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
                  className="
                    w-full px-3 py-2 text-sm rounded-lg border border-gray-300
                    outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30
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
                    w-full px-3 py-2 text-sm rounded-lg border border-gray-300
                    outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30
                    transition-colors
                  "
                  required
                />
              </div>
            </div>

            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
              className="
                flex items-center justify-center gap-2
                border border-gray-300 rounded-lg py-2 text-sm font-medium
                hover:bg-gray-50 transition mt-1
              "
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
              className="
                py-2.5 rounded-lg
                bg-gradient-to-r from-[#22C55E] to-[#4A6BFF]
                text-white font-medium text-sm
                hover:brightness-105 transition-all
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              By signing up you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#4A6BFF] hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
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
