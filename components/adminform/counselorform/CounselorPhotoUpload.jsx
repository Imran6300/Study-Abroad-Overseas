// components/adminform/counselorform/CounselorPhotoUpload.jsx
"use client";

import { Upload, X } from "lucide-react";

export default function CounselorPhotoUpload({
  photoPreview,
  setPhotoPreview,
  setPhotoFile,
  fileInputRef,
  disabled = false,
}) {
  const handlePhotoChange = (e) => {
    if (disabled) return;

    const file = e.target.files[0];
    if (!file) return;

    // Validation: image only, max 3MB (smaller for counselor avatars)
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Image size should be less than 3MB");
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    if (disabled) return;
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-6 rounded-2xl border border-sky-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-5 text-gray-800 flex items-center gap-2">
        <Upload size={20} className="text-sky-600" />
        Counselor Photo
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Preview Circle – slightly smaller for counselor avatar */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Counselor preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-xs font-medium text-center px-4">
                No photo selected
              </span>
            )}
          </div>

          {/* Hover overlay – only show if not disabled */}
          {!disabled && (
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-full text-sm font-medium shadow-md"
              >
                Change Photo
              </button>
            </div>
          )}

          {/* Remove button – only show if not disabled */}
          {photoPreview && !disabled && (
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Upload instructions + hidden input */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm text-gray-600 mb-3">
            Upload a professional headshot or passport-size photo (max 3MB, JPG/PNG)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => !disabled && fileInputRef.current?.click()}
            disabled={disabled}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-md transition-all ${
              disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700 text-white"
            }`}
          >
            <Upload size={18} />
            Upload Photo
          </button>
        </div>
      </div>
    </div>
  );
}