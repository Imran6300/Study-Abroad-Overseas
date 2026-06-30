"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import { disconnectSocket } from "@/lib/socket";
import {
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
  X,
} from "lucide-react";

// ─── Inline confirmation modal (no external dep needed) ──────────────────────
function DeleteModal({ onConfirm, onCancel, loading }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = () => {
    if (!password.trim()) {
      setLocalError("Please enter your password to confirm.");
      return;
    }
    setLocalError("");
    onConfirm(password);
  };

  return (
    <motion.div
      key="delete-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-[#0f1a2e] border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">
                Delete Account
              </h3>
              <p className="text-red-400 text-xs font-medium mt-0.5">
                This action is permanent and cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning list */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-5">
          <p className="text-gray-300 text-sm font-medium mb-3">
            The following will be permanently deleted:
          </p>
          <ul className="space-y-1.5">
            {[
              "Your profile and personal information",
              "All university applications and drafts",
              "Uploaded documents (passport, marksheets, etc.)",
              "Saved universities and shortlists",
              "Visa progress and deadlines",
              "All activity history and notifications",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs text-gray-400"
              >
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Password confirmation */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your password to confirm
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (localError) setLocalError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
              placeholder="Your current password"
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 disabled:opacity-50 transition"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {localError && (
            <p className="text-red-400 text-xs mt-1.5">{localError}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !password.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Delete My Account
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main SettingsPanel
// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsPanel() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Wired delete handler ─────────────────────────────────────────────────
  const handleDeleteAccount = async (password) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/account`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Deletion failed. Please try again.");
        setLoading(false);
        return;
      }

      // Success — disconnect socket, clear Redux, redirect to home
      disconnectSocket();
      dispatch(logout());
      router.replace("/?accountDeleted=true");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white/6 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl max-w-3xl"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>

        {/* Danger Zone card */}
        <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-400 shrink-0" />
            <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
          </div>

          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Deleting your account will permanently remove your profile, all
            uploaded documents, shortlisted universities, applications, visa
            records, and deadlines. Your assigned counselor will be notified
            automatically.{" "}
            <span className="text-red-400 font-medium">
              This action cannot be undone.
            </span>
          </p>

          {/* Inline error (from a failed attempt before modal closed) */}
          {error && !showModal && (
            <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <AlertTriangle
                size={15}
                className="text-red-400 mt-0.5 shrink-0"
              />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={() => {
              setError("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showModal && (
          <DeleteModal
            loading={loading}
            onCancel={() => {
              if (!loading) {
                setShowModal(false);
                setError("");
              }
            }}
            onConfirm={(password) => handleDeleteAccount(password)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
