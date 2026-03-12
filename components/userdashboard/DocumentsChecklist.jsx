"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineUpload, HiOutlineEye, HiOutlineTrash } from "react-icons/hi";

export default function DocumentsPage() {
  const initialDocs = [
    { name: "Passport", required: true, status: "Pending", file: null },
    {
      name: "Academic Transcripts",
      required: true,
      status: "Pending",
      file: null,
    },
    {
      name: "Degree Certificate",
      required: true,
      status: "Pending",
      file: null,
    },
    {
      name: "English Test (IELTS / TOEFL / PTE)",
      required: true,
      status: "Pending",
      file: null,
    },
    {
      name: "Statement of Purpose (SOP)",
      required: true,
      status: "Pending",
      file: null,
    },
    {
      name: "Letter of Recommendation (LOR)",
      required: true,
      status: "Pending",
      file: null,
    },

    // Optional but common
    { name: "Resume / CV", required: false, status: "Pending", file: null },
    { name: "Portfolio", required: false, status: "Pending", file: null },
    {
      name: "Work Experience Letter",
      required: false,
      status: "Pending",
      file: null,
    },
    {
      name: "Research Proposal (PhD)",
      required: false,
      status: "Pending",
      file: null,
    },
    {
      name: "Financial Documents / Bank Statement",
      required: false,
      status: "Pending",
      file: null,
    },
  ];

  const [documents, setDocuments] = useState(initialDocs);

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];

  const handleUpload = (index, file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPG, and PNG files are allowed.");
      return;
    }

    const updated = [...documents];
    updated[index].file = file;
    updated[index].status = "Uploaded";
    setDocuments(updated);
  };

  const removeFile = (index) => {
    const updated = [...documents];
    updated[index].file = null;
    updated[index].status = "Pending";
    setDocuments(updated);
  };

  const previewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url);
  };

  const uploadedCount = documents.filter((d) => d.file).length;
  const progress = (uploadedCount / documents.length) * 100;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Application Documents</h1>
        <p className="text-gray-400 mt-2">
          Upload all required documents for your overseas university
          application.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
        <div className="flex justify-between mb-3 text-sm text-gray-300">
          <span>Application Progress</span>
          <span>
            {uploadedCount}/{documents.length} Uploaded
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-[#4169E1] h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            {/* Title */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold text-sm">{doc.name}</h3>

              {doc.required && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                  Required
                </span>
              )}
            </div>

            {/* Status */}
            <p
              className={`text-sm mb-4 ${
                doc.status === "Uploaded" ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {doc.status}
            </p>

            {/* Upload */}
            {!doc.file ? (
              <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition">
                <HiOutlineUpload />
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleUpload(index, e.target.files[0])}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-300 truncate max-w-[150px]">
                  {doc.file.name}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => previewFile(doc.file)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <HiOutlineEye size={20} />
                  </button>

                  <button
                    onClick={() => removeFile(index)}
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

      {/* Submit */}
      <div className="mt-12 text-center">
        <button className="bg-[#4169E1] hover:bg-[#3555c8] text-white px-8 py-3 rounded-xl font-semibold transition">
          Submit Documents
        </button>
      </div>
    </div>
  );
}
