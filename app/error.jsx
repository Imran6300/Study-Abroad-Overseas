"use client";

// app/error.jsx
//
// Global error boundary for the entire Next.js app.
// Catches any unhandled runtime error in any page or layout.
// Next.js requires this to be a Client Component.
//
// Place this file at: content/app/error.jsx

import { useEffect } from "react";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log to your error tracking service here (e.g. Sentry)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        {/* Logo mark */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-md mx-auto mb-5">
          <FaGraduationCap className="text-white text-2xl" />
        </div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          An unexpected error occurred. Your data is safe — please try again or
          go back to the dashboard.
        </p>

        <div className="flex flex-col gap-2">
          {/* Try again — calls Next.js reset() to re-render the segment */}
          <button
            onClick={reset}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white hover:opacity-95 transition-all shadow-sm"
          >
            Try again
          </button>

          {/* Fallback navigation */}
          <Link
            href="/dashboard/counselor-dashboard"
            className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors text-center"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Dev-only: show error message in development */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
              Error details (dev only)
            </summary>
            <pre className="mt-2 text-xs text-red-500 bg-red-50 rounded-lg p-3 overflow-auto max-h-32 whitespace-pre-wrap">
              {error?.message}
              {error?.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
