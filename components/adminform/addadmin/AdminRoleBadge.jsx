"use client";

const ROLE_STYLES = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-sky-100 text-sky-800",
  editor: "bg-amber-100 text-amber-800",
  counselor: "bg-emerald-100 text-emerald-800",
};

const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  counselor: "Counselor",
};

export default function AdminRoleBadge({ role }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        ROLE_STYLES[role] || "bg-gray-100 text-gray-800"
      }`}
    >
      {ROLE_LABELS[role] || role}
    </span>
  );
}
