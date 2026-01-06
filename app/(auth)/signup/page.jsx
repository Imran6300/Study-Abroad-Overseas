"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-[#F7F9FC] flex justify-center px-4 mt-10">
      {/* Page wrapper */}
      <div className="w-full max-w-[420px] flex flex-col justify-center py-10">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white
            rounded-2xl
            shadow-lg
            border border-gray-200
            p-6 sm:p-8
          "
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center">
              <FaGraduationCap className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Khizar Overseas</h1>
          </div>

          {/* Heading */}
          <h2 className="text-lg font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="text-sm text-gray-600 mt-1 mb-6">
            Start your journey toward global opportunities
          </p>

          {/* Form */}
          <form className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="
                  w-full mt-1 px-4 py-2.5
                  rounded-lg border border-gray-300
                  text-sm outline-none
                  focus:border-[#22C55E]
                "
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="
                  w-full mt-1 px-4 py-2.5
                  rounded-lg border border-gray-300
                  text-sm outline-none
                  focus:border-[#22C55E]
                "
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="
                  w-full mt-1 px-4 py-2.5
                  rounded-lg border border-gray-300
                  text-sm outline-none
                  focus:border-[#22C55E]
                "
              />
            </div>

            <button
              type="submit"
              className="
                mt-2 py-3 rounded-lg
                bg-gradient-to-r from-[#22C55E] to-[#4A6BFF]
                text-white font-semibold
                text-sm
              "
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4A6BFF] font-semibold">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
