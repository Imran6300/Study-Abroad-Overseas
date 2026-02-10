"use client";

import { Trash2 } from "lucide-react";
import AdminRoleBadge from "./AdminRoleBadge";

export default function AdminTable({ admins, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        
        <thead className="bg-gray-50">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Name
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Email
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Role
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-50 transition">
              <td className="px-5 py-4 font-medium text-gray-900">
                {admin.name}
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {admin.email}
              </td>

              <td className="px-5 py-4">
                <AdminRoleBadge role={admin.role} />
              </td>

              {/* 🔥 UI ONLY */}
              <td className="px-5 py-4 text-right">
                <button
                  onClick={() => onDelete(admin)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete Role"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
