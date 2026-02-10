"use client";

import AdminTable from "./AdminTable";
import AdminCardList from "./AdminCardList";

export default function AdminList({ admins, onDelete }) {
  if (!admins || admins.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-5 text-gray-800">
          Existing Roles (0)
        </h3>
        <p className="text-center text-gray-500 py-8">
          No roles added yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 text-gray-800">
        Existing Roles ({admins.length})
      </h3>

      {/* Desktop */}
      <div className="hidden md:block">
        <AdminTable admins={admins} onDelete={onDelete} />
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        <AdminCardList admins={admins} onDelete={onDelete} />
      </div>
    </div>
  );
}
