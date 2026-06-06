"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Loader2,
  CheckCircle,
  ExternalLink,
  X,
} from "lucide-react";
import { counselorApi } from "@/lib/counselorApi";

/** mode = "counselor" | "student" */
export default function OfferLetterUpload({ leadId, mode = "counselor" }) {
  const [state, setState] = useState(null); // { url, uploadedAt, university } | null
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [university, setUniversity] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    counselorApi
      .getOfferLetter(leadId)
      .then((d) => setState(d.data || null))
      .catch(() => setState(null))
      .finally(() => setLoading(false));
  }, [leadId]);

  const upload = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10 MB");
      return;
    }

    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    if (university) fd.append("university", university);

    try {
      const d = await counselorApi.uploadOfferLetter(leadId, file, university);

      setState(d.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!confirm("Remove offer letter?")) return;
    try {
      await counselorApi.deleteOfferLetter(leadId);
      setState(null);
    } catch (e) {
      console.error(e);
    }
  };

  const openDoc = async () => {
    // Refresh signed URL then open
    try {
      const d = await counselorApi.getOfferLetter(leadId);
      if (d?.data?.url) window.open(d.data.url, "_blank");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-center h-24">
        <Loader2 size={18} className="animate-spin text-slate-400" />
      </div>
    );

  return (
    <div
      className={`bg-white rounded-2xl border p-5 ${state ? "border-blue-200" : "border-slate-200"}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${state ? "bg-blue-100" : "bg-slate-100"}`}
        >
          <FileText
            size={16}
            className={state ? "text-blue-600" : "text-slate-500"}
          />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Offer Letter</h3>
          {state?.university && (
            <p className="text-xs text-slate-500">{state.university}</p>
          )}
        </div>
        {state && <CheckCircle size={15} className="text-green-500 ml-auto" />}
      </div>

      {error && (
        <div className="mb-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-2">
          <X size={12} className="shrink-0" />
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <X size={11} />
          </button>
        </div>
      )}

      {state ? (
        // Has offer letter
        <div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-blue-800">
                PDF uploaded
              </p>
              {state.uploadedAt && (
                <p className="text-[10px] text-blue-500 mt-0.5">
                  {new Date(state.uploadedAt).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={openDoc}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <ExternalLink size={11} /> View
              </button>
              {mode === "counselor" && (
                <button
                  onClick={remove}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
          {mode === "counselor" && (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full text-center text-xs text-slate-400 hover:text-blue-600 underline transition-colors"
            >
              Replace PDF
            </button>
          )}
        </div>
      ) : mode === "counselor" ? (
        // Upload area
        <div>
          {!uploading && (
            <div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  University Name (optional)
                </label>
                <input
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University of Toronto"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 mb-3"
                />
              </div>
              <motion.div
                onClick={() => fileRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) upload(f);
                }}
                onDragOver={(e) => e.preventDefault()}
                whileHover={{ scale: 1.01 }}
                className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
              >
                <Upload size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">
                  Upload Offer Letter PDF
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Click to browse or drag & drop · Max 10 MB
                </p>
              </motion.div>
            </div>
          )}
          {uploading && (
            <div className="py-6 text-center">
              <Loader2
                size={22}
                className="animate-spin text-blue-500 mx-auto mb-2"
              />
              <p className="text-sm text-slate-500">Uploading...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center text-slate-400 text-sm">
          No offer letter uploaded yet
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
