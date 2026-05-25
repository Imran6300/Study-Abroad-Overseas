"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function MessageBox({ status, message, onClose }) {
  if (!status) return null;

  const isSuccess = status === "success";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-24 right-6 z-[99999] flex items-center gap-3 rounded-lg shadow-lg px-4 py-3
        ${
          isSuccess
            ? "bg-[#111827] border border-green-500"
            : "bg-[#111827] border border-red-500"
        }`}
      >
        <span
          className={`text-sm font-medium ${
            isSuccess ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </span>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-sm"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
