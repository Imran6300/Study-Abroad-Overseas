"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "@/components/adminform/confirmmsg";

export default function SettingsPanel() {
  const [showModal, setShowModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/6 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl max-w-3xl"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>

        <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-3">
            Danger Zone
          </h3>

          <p className="text-gray-400 text-sm mb-6">
            Deleting your account will permanently remove your profile, uploaded
            documents, shortlisted universities, and application progress. This
            action cannot be undone.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            Delete Account
          </button>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <ConfirmationModal
            title="Delete Account"
            message="Are you sure you want to delete your account? This will permanently remove your profile, applications, and documents. This action cannot be undone."
            confirmText="Delete Account"
            cancelText="Cancel"
            confirmVariant="danger"
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
