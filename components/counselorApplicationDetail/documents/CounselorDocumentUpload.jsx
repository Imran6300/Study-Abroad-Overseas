"use client";

import { useEffect, useState, useCallback } from "react";
import { UploadCloud, FileText, Trash2, Loader2, Download } from "lucide-react";
import { counselorApi } from "@/lib/counselorApi";

const CATEGORY_OPTIONS = [
  { value: "application", label: "Application" },
  { value: "visa", label: "Visa" },
  { value: "financial", label: "Financial" },
  { value: "other", label: "Other" },
];

function formatSize(bytes = 0) {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb >= 0.1
    ? `${mb.toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function CounselorDocumentUpload({ leadId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("other");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadDocuments = useCallback(async () => {
    if (!leadId) return;
    try {
      setLoading(true);
      const res = await counselorApi.getLeadDocuments(leadId);
      setDocuments(res.data || []);
    } catch (err) {
      console.error("[CounselorDocumentUpload] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file first.");
      return;
    }
    try {
      setUploading(true);
      setError("");
      await counselorApi.uploadLeadDocument(leadId, file, { title, category });
      setFile(null);
      setTitle("");
      setCategory("other");
      e.target.reset?.();
      await loadDocuments();
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    try {
      setDeletingId(docId);
      await counselorApi.deleteLeadDocument(leadId, docId);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
    } catch (err) {
      console.error("[CounselorDocumentUpload] delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
      <div className="flex items-center gap-2 mb-1">
        <UploadCloud size={15} className="text-indigo-500" />
        <h3 className="text-sm font-bold text-slate-700">
          Upload on Behalf of Student
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Upload documents directly for this student — works whether or not
        they've created an account yet.
      </p>

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="flex flex-col sm:flex-row sm:items-end gap-3 mb-5"
      >
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            File
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Passport copy"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold whitespace-nowrap transition-all"
        >
          {uploading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <UploadCloud size={13} />
          )}
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>

      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

      {/* List */}
      {loading ? (
        <div className="py-6 text-center text-slate-400 text-xs">
          Loading documents…
        </div>
      ) : documents.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs border-2 border-dashed border-indigo-100 rounded-xl bg-white/60">
          No documents uploaded on behalf of this student yet.
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center justify-between gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={16} className="text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {doc.title || doc.fileName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {CATEGORY_OPTIONS.find((c) => c.value === doc.category)
                      ?.label || "Other"}{" "}
                    · {formatSize(doc.size)} ·{" "}
                    {doc.uploadedAt
                      ? new Date(doc.uploadedAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    title="Download"
                  >
                    <Download size={14} />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(doc._id)}
                  disabled={deletingId === doc._id}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Remove"
                >
                  {deletingId === doc._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
