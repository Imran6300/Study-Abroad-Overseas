"use client";

import { motion } from "framer-motion";
import SettingsPanel from "@/components/userdashboard/SettingsPanel";

export default function SettingsPage() {
  return (
    <div className="min-h-screen space-y-10 pt-16 sm:pt-5 text-white">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-10 bg-white/6 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-red-400 mb-3">Danger Zone</h2>

        <p className="text-gray-400 mb-5">
          Deleting your account will remove all your applications, documents and
          saved universities permanently.
        </p>

        <button className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-500 transition">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
