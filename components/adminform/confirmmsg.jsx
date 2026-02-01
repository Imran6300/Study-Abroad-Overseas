// components/ConfirmationModal.jsx
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.88, y: 40, transition: { duration: 0.2 } },
};

export default function ConfirmationModal({
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 text-gray-600 leading-relaxed">{message}</p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                className={`
                  px-5 py-2.5 rounded-lg font-medium text-white transition-colors
                  ${confirmVariant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-sky-600 hover:bg-sky-700"}
                `}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}