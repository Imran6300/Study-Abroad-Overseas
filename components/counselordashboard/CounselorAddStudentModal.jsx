"use client";

import { useState } from "react";
import axios from "axios";
import { X, UserPlus } from "lucide-react";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  targetCountry: "",
  preferredIntake: "",
};

export default function CounselorAddStudentModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        targetCountry: form.targetCountry,
        preferredIntake: form.preferredIntake,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/counselor/student`,
        payload,
        { withCredentials: true },
      );

      if (res.data.success) {
        onCreated?.(res.data.data);
        setForm(INITIAL_FORM);
        onClose();
      }
    } catch (err) {
      console.error("Add student error:", err);
      setError(
        err?.response?.data?.message || "Failed to add student. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <UserPlus className="text-cyan-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Add Student</h3>
            <p className="text-sm text-gray-400">
              Create a counselor-owned student record
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-5 leading-relaxed">
          This student will be linked to your counselor account and appear in
          your dashboard immediately.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            required
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          />

          <input
            type="text"
            name="targetCountry"
            placeholder="Target Country"
            required
            value={form.targetCountry}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          />

          <select
            name="preferredIntake"
            required
            value={form.preferredIntake}
            onChange={handleChange}
            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
          >
            <option value="" disabled>
              Preferred Intake
            </option>
            <option value="September">September</option>
            <option value="January">January</option>
            <option value="May">May</option>
            <option value="Other">Other</option>
          </select>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] py-4 rounded-xl font-bold text-base hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Saving..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
