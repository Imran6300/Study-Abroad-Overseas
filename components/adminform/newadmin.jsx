"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// 🔑 normalize helper
const normalizeRole = (role = "") =>
  role.trim().toLowerCase().replace(/\s+/g, "_");

export default function AddAdmin({ onSuccess, onCancel }) {
  const [roles, setRoles] = useState([]);

  const { user } = useSelector((state) => state.auth);

  const currentRole = normalizeRole(user?.role);
  const isSuperAdmin = currentRole === "super_admin";
  useEffect(() => {
  const fetchRoles = async () => {
    const res = await fetch(
      "https://overseas-backend-production-4f18.up.railway.app/host/admin-access-role",
      { credentials: "include" }
    );

    const data = await res.json();
    if (res.ok) setRoles(data.roles);
  };

  fetchRoles();
}, []);


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // 🔥 UI error state
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Set default role based on logged-in user
  useEffect(() => {
    if (isSuperAdmin) {
      setForm((prev) => ({ ...prev, role: "admin" }));
    } else if (currentRole === "admin") {
      setForm((prev) => ({ ...prev, role: "counselor" }));
    }
  }, [isSuperAdmin, currentRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors([]); // clear errors while typing ✨
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const res = await fetch(
        "https://overseas-backend-production-4f18.up.railway.app/host/admin-access-role",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        if (Array.isArray(data.errors)) {
          setErrors(data.errors.map((e) => e.msg));
        } else if (data.message) {
          setErrors([data.message]);
        } else {
          setErrors(["Request failed. Please try again."]);
        }
        return;
      }

      onSuccess?.();
    } catch (err) {
      setErrors(["Network error. Please check your connection."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 🔴 ERROR BOX */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h4 className="text-sm font-semibold text-red-800 mb-2">
            Please fix the following:
          </h4>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

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
  {roles.map((r) => (
    <option key={r.value} value={r.value}>
      {r.label}
    </option>
  ))}
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
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}
