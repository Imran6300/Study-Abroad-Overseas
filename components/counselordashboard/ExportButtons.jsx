"use client";

import { useState } from "react";
import { Download, FileText, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * mode = "counselor" | "admin"
 *
 * Usage:
 *   <ExportButtons mode="counselor" />
 *   <ExportButtons mode="admin" />
 */
export default function ExportButtons({ mode = "counselor" }) {
  const [loading, setLoading] = useState(null); // "csv" | "pdf" | null
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const EXPORTS =
    mode === "counselor"
      ? [
          {
            key: "csv",
            label: "Export CSV",
            icon: FileText,
            path: "/api/export/counselor/students.csv",
            mime: "text/csv",
            ext: "csv",
          },
          {
            key: "pdf",
            label: "Export PDF",
            icon: FileText,
            path: "/api/export/counselor/students.pdf",
            mime: "application/pdf",
            ext: "pdf",
          },
        ]
      : [
          {
            key: "csv",
            label: "Report CSV",
            icon: FileText,
            path: "/api/export/admin/report.csv",
            mime: "text/csv",
            ext: "csv",
          },
          {
            key: "pdf",
            label: "Report PDF",
            icon: FileText,
            path: "/api/export/admin/report.pdf",
            mime: "application/pdf",
            ext: "pdf",
          },
        ];

  const download = async ({ key, path, ext, label }) => {
    setLoading(key);
    setError("");
    setOpen(false);
    try {
      const res = await fetch(`${BASE}${path}`, { credentials: "include" });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${label.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all"
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Download size={15} />
        )}
        Export
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {EXPORTS.map((exp) => (
              <button
                key={exp.key}
                onClick={() => download(exp)}
                disabled={!!loading}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {loading === exp.key ? (
                  <Loader2
                    size={14}
                    className="animate-spin text-blue-500 shrink-0"
                  />
                ) : (
                  <exp.icon size={14} className="text-slate-400 shrink-0" />
                )}
                {exp.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      {error && (
        <div className="absolute right-0 mt-2 w-56 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 z-50">
          {error}
        </div>
      )}
    </div>
  );
}
