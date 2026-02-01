"use client";

export default function AdminRoleBadge({ role }) {
  const roleStyles = {
    "Super Admin": "bg-purple-100 text-purple-800",
    Admin: "bg-sky-100 text-sky-800",
    Editor: "bg-amber-100 text-amber-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        roleStyles[role] || "bg-gray-100 text-gray-800"
      }`}
    >
      {role}
    </span>
  );
}
