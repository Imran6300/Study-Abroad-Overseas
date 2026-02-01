"use client";

import AdminTable from "./AdminTable";
import AdminCardList from "./AdminCardList";

export default function AdminList({ admins, onDelete }) {
  // Safety check (avoids crash if admins is undefined)
  if (!admins || admins.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-5 text-gray-800">
          Existing Admins (0)
        </h3>
        <p className="text-center text-gray-500 py-8">
          No admins yet
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <h3 className="text-lg font-semibold mb-5 text-gray-800">
        Existing Admins ({admins.length})
      </h3>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <AdminTable
          admins={admins}
          onDelete={onDelete}
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        <AdminCardList
          admins={admins}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
