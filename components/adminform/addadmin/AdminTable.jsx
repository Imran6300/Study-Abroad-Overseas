"use client";

import { Trash2 } from "lucide-react";
import AdminRoleBadge from "./AdminRoleBadge";

export default function AdminTable({ admins, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        
        {/* TABLE HEADER */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Role
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody className="bg-white divide-y divide-gray-200">
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-50 transition">
              
              {/* NAME */}
              <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-900">
                {admin.name}
              </td>

              {/* EMAIL */}
              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {admin.email}
              </td>

              {/* ROLE */}
              <td className="px-5 py-4 whitespace-nowrap">
                <AdminRoleBadge role={admin.role} />
              </td>

              {/* ACTION */}
              <td className="px-5 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onDelete(admin.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete Admin"
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
