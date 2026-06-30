"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";

import {
  uploadDeadlineDocumentAsync,
  deleteDeadlineDocumentAsync,
  fetchMyDeadlines,
} from "@/store/deadlineSlice";
import {
  HiOutlineUpload,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

/** Fetches a fresh 1-hour signed URL from the backend, then opens it. */
async function openSignedUrl(deadlineId) {
  try {
    const res = await fetch(
      `${BASE}/user/my-deadline/${deadlineId}/document-url`,
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
  }
}

export default function DocumentChecklist({ documents, loading }) {
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];

  const handleUpload = async (doc, file) => {
    if (!file) return;

    setError("");

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, JPG and PNG allowed");
      return;
    }

    try {
      await dispatch(
        uploadDeadlineDocumentAsync({
          id: doc._id,
          file,
        }),
      ).unwrap();

      dispatch(fetchMyDeadlines());
      setError("");
    } catch (err) {
      setError(err);
    }
  };

  const removeFile = async (docId) => {
    try {
      await dispatch(deleteDeadlineDocumentAsync(docId)).unwrap();

      dispatch(fetchMyDeadlines());
      setError("");
    } catch (err) {
      setError(err);
    }
  };

  const uploadedCount = documents.filter((d) => d.uploadedDocument?.url).length;
  const progress =
    documents.length > 0 ? (uploadedCount / documents.length) * 100 : 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-3xl font-bold"
          style={{
            color: "var(--brand-accent)",
          }}
        >
          Application Documents
        </h1>
        <p
          className="mt-2"
          style={{
            color: "var(--brand-text-secondary)",
          }}
        >
          Upload all required documents for your overseas university
          application.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg">
          <HiOutlineExclamationCircle />
          {error}
        </div>
      )}

      {/* Progress */}
      <div
        className="rounded-xl p-6 mb-10 border"
        style={{
          backgroundColor: "var(--brand-card-bg)",
          borderColor: "var(--brand-primary)",
        }}
      >
        <div className="flex justify-between mb-3 text-sm text-gray-300">
          <span>Application Progress</span>
          <span>
            {uploadedCount}/{documents.length} Uploaded
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--brand-primary)",
            }}
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <motion.div
            key={doc._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-2xl p-6"
            style={{
              backgroundColor: "var(--brand-card-bg)",
              borderColor: "var(--brand-primary)",
            }}
          >
            {/* Title */}
            <div className="flex justify-between items-center mb-2">
              <h3
                className="font-semibold text-sm"
                style={{
                  color: "var(--brand-accent)",
                }}
              >
                {doc.title}
              </h3>

              {doc.requiresDocumentUpload && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                  Required
                </span>
              )}
            </div>

            {/* Status */}
            <p
              className={`text-sm mb-4 ${
                doc.status === "completed"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {doc.status.replace("_", " ")}
            </p>

            {/* Upload */}
            {!doc.uploadedDocument?.url ? (
              <>
                <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition">
                  <HiOutlineUpload />
                  {loading ? "Uploading..." : "Upload File"}
                  <input
                    disabled={loading}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleUpload(doc, e.target.files[0])}
                  />
                </label>

                <p className="text-xs text-gray-400 mt-2 text-center">
                  PDF, JPG, PNG • Max 10MB
                </p>
              </>
            ) : (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-300 truncate max-w-[150px]">
                  {doc.uploadedDocument?.fileName}
                </span>

                <div className="flex gap-3">
                  <button
                    disabled={loading}
                    onClick={() => openSignedUrl(doc._id)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <HiOutlineEye size={20} />
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => removeFile(doc._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
