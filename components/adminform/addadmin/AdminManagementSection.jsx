"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import AddAdminForm from "@/components/adminform/newadmin";
import AdminList from "./AdminList";

export default function AdminManagementSection({
  admins,
  onClose,
  onAddAdmin,
  onDeleteAdmin,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-12"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/70 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Admins
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT: ADD ADMIN FORM */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-gray-800">
              Add New Admin
            </h3>
            <AddAdminForm
              onSuccess={onAddAdmin}
              onCancel={onClose}
            />
          </div>

          {/* RIGHT: ADMIN LIST */}
          <AdminList
            admins={admins}
            onDelete={onDeleteAdmin}
          />
        </div>
      </div>
    </motion.div>
  );
}
