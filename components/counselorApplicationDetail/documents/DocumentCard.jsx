"use client";

import { useState } from "react";
import { FileText, Download, Eye, Calendar, Loader2 } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Fetches a fresh signed URL from the backend, then opens it in a new tab.
 * Uses the admin route since DocumentCard is rendered in counselor/admin views.
 */
async function openSignedUrl(deadlineId, setLoading) {
  setLoading(true);
  try {
    const res = await fetch(
      `${BASE}/user/admin/deadline/${deadlineId}/document-url`,
      { credentials: "include" },
    );
    const data = await res.json();
    if (data.success && data.url) {
      window.open(data.url, "_blank", "noopener,noreferrer");
    } else {
      alert("Could not load document. Please try again.");
    }
  } catch (err) {
    console.error("Failed to get signed URL:", err);
    alert("Could not load document. Please try again.");
  } finally {
    setLoading(false);
  }
}

export default function DocumentCard({ doc }) {
  const [loading, setLoading] = useState(false);

  // doc.id is the deadline._id (set in page.jsx transformDeadlineDocs)
  const deadlineId = doc.id;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
          <FileText size={18} className="text-indigo-500" />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-700">{doc.name}</h4>

          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span>{doc.size}</span>

            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{doc.uploadedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* View — fetches a fresh signed URL */}
        <button
          onClick={() => openSignedUrl(deadlineId, setLoading)}
          disabled={loading}
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-50"
          title="View document"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin text-slate-400" />
          ) : (
            <Eye size={16} className="text-slate-500" />
          )}
        </button>

        {/* Download — also fetches a fresh signed URL */}
        <button
          onClick={() => openSignedUrl(deadlineId, setLoading)}
          disabled={loading}
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-50"
          title="Download document"
        >
          <Download size={16} className="text-slate-500" />
        </button>
      </div>
    </div>
  );
}
