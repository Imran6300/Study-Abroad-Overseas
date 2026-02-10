"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function AddAdmin({ onSuccess, onCancel }) {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === "super_admin";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // will be set automatically
  });

  // ✅ Set default role based on logged-in user
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      role: isSuperAdmin ? "admin" : "counselor",
    }));
  }, [isSuperAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Creating user (frontend):", form);

  try {
    const res = await fetch(
      "https://overseas-backend-production-4f18.up.railway.app/host/admin-access-role",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ⚠️ very important (explained below)
          Authorization: `Bearer ${user?.role}`,
        },
        body: JSON.stringify(form),
      }
    );

    const text = await res.text(); // 👈 read RAW response
    console.log("RAW RESPONSE:", text);
    console.log("STATUS:", res.status);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Response is not JSON");
      return;
    }

    console.log("PARSED RESPONSE:", data);

    if (!res.ok) {
      alert(data.message || data.error || "Backend rejected request");
      return;
    }

    onSuccess?.();
  } catch (err) {
    console.error("Request failed:", err);
  }
};



  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          {isSuperAdmin && <option value="admin">Admin</option>}
          <option value="counselor">Counselor</option>
          <option value="editor">Editor</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700"
        >
          Create User
        </button>
      </div>
    </form>
  );
}
