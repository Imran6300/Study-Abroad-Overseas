"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div
      className="
        min-h-screen w-full px-4 sm:px-6
        flex items-center justify-center
        relative bg-[#F7F9FC]
        overflow-hidden
      "
    >
      {/* BACKGROUND BLOBS (CLICK SAFE) */}
      <div
        className="
          absolute pointer-events-none
          w-56 h-56 sm:w-64 sm:h-64
          bg-[#4A6BFF]/20 blur-3xl rounded-full
          top-0 left-0 -translate-x-1/3 -translate-y-1/3
        "
      />

      <div
        className="
          absolute pointer-events-none
          w-56 h-56 sm:w-64 sm:h-64
          bg-[#22C55E]/20 blur-3xl rounded-full
          bottom-0 right-0 translate-x-1/3 translate-y-1/3
        "
      />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          relative z-20
          w-full max-w-[420px]
          max-h-[90vh] overflow-y-auto
          bg-gradient-to-br from-white/80 via-white/60 to-white/40
          backdrop-blur-2xl
          rounded-2xl
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          border border-white/50
          p-6 sm:p-8
          pointer-events-auto
        "
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="
              w-12 h-12 rounded-xl
              bg-gradient-to-br from-[#4A6BFF] to-[#22C55E]
              flex items-center justify-center
              shadow-md
            "
          >
            <FaGraduationCap className="text-white text-xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">Khizar Overseas</h1>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Continue your study abroad journey
        </p>

        {/* FORM */}
        <form className="flex flex-col gap-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="
                w-full mt-1 px-4 py-3 rounded-xl
                bg-white/70 border border-gray-200
                outline-none focus:border-[#4A6BFF]
                text-sm shadow-inner
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="
                w-full mt-1 px-4 py-3 rounded-xl
                bg-white/70 border border-gray-200
                outline-none focus:border-[#4A6BFF]
                text-sm shadow-inner
              "
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full mt-2 py-3 rounded-xl
              bg-gradient-to-r from-[#4A6BFF] to-[#22C55E]
              text-white font-semibold text-base
              shadow-lg
              transition-all hover:opacity-95
            "
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#4A6BFF] font-semibold  no-underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
