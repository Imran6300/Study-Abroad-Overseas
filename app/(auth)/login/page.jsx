"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authStart, authSuccess, authFail } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import MessageBox from "@/components/ui/MessageBox";
import { getDashboardPath } from "@/lib/roleRouting";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.auth);

  const searchParams = useSearchParams();
  const activated = searchParams.get("activated") === "true";
  const passwordReset = searchParams.get("reset") === "true";

  const [messageStatus, setMessageStatus] = useState(
    activated || passwordReset ? "success" : "",
  );
  const [message, setMessage] = useState(
    activated
      ? "Account activated successfully. Please login."
      : passwordReset
        ? "Password updated successfully. Please login with your new password."
        : "",
  );

  useEffect(() => {
    if (activated || passwordReset) {
      router.replace("/login");
    }
  }, [activated, passwordReset, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuspended, setIsSuspended] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setIsSuspended(false);
    dispatch(authStart());

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        if (data?.code === "ACCOUNT_SUSPENDED") {
          dispatch(authFail("Account suspended"));
          setIsSuspended(true);
          setErrorMsg("");
          return;
        }

        const msg =
          data?.errors?.[0] || data?.message || "Invalid email or password";
        dispatch(authFail(msg));
        setErrorMsg(msg);
        return;
      }

      dispatch(authSuccess(data.user));

      // ── CENTRALIZED role-based redirect ──────────────────────────────────
      // getDashboardPath() is the ONLY place that maps role → path.
      // Never duplicate this logic elsewhere.
      router.replace(getDashboardPath(data.user.role));
    } catch (error) {
      dispatch(authFail("Server error"));
      setErrorMsg("Server error. Please try again.");
    }
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen pt-[76px] w-full px-4 sm:px-6 flex items-center justify-center bg-[#F7F9FC]">
      <MessageBox
        status={messageStatus}
        message={message}
        onClose={() => {
          setMessageStatus("");
          setMessage("");
        }}
      />
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

        <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-600 mb-4">
          Continue your study abroad journey
        </p>

        {/* ── SUSPENDED ACCOUNT BANNER ─────────────────────────────────── */}
        <AnimatePresence>
          {isSuspended && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-orange-800">
                    Account Suspended
                  </p>
                  <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                    Your account has been suspended by your organization
                    administrator. Please contact your admin for assistance or
                    reach out to{" "}
                    <a
                      href="mailto:support@khizaroverseas.in"
                      className="font-semibold underline underline-offset-2"
                    >
                      support@khizaroverseas.in
                    </a>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GENERIC ERROR MESSAGE */}
        <AnimatePresence>
          {errorMsg && !isSuspended && (
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
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
              className="w-full mt-1 px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#4A6BFF] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#4A6BFF] outline-none text-sm"
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

          {/* GOOGLE + DIVIDER */}
          <div className="space-y-4">
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </a>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="flex-1 h-px bg-gray-300"></div>
              OR
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition-all
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
        <p className="text-center text-sm text-gray-700 mt-4">
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
