"use client";

import { Trash2 } from "lucide-react";
import AdminRoleBadge from "./AdminRoleBadge";

export default function AdminCardList({ admins, onDelete }) {
  return (
    <div className="space-y-4">
      {admins.map((admin) => (
        <div
          key={admin.id}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
        >
          {/* Top row: name + delete */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">
                {admin.name}
              </h4>
              <p className="text-sm text-gray-600">
                {admin.email}
              </p>
            </div>

            <button
              onClick={() => onDelete(admin.id)}
              className="text-red-600 hover:text-red-800 transition"
              title="Delete Admin"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Role badge */}
          <div className="mt-3">
            <AdminRoleBadge role={admin.role} />
          </div>
        </div>
      ))}
    </div>
  );
}
