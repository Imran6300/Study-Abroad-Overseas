// components/admin/country/countryform/CountryImageUpload.jsx
"use client";

import { Upload, X } from "lucide-react";

export default function CountryImageUpload({
  photoPreview,
  setPhotoPreview,
  setPhotoFile,
  fileInputRef,
  onError,
}) {
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      onError?.("Please select a valid image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onError?.("Image size should be less than 5MB");
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
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-6 rounded-2xl border border-sky-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-5 text-gray-800 flex items-center gap-2">
        <Upload size={20} className="text-sky-600" />
        Country Image
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Preview area */}
        <div className="relative group">
          <div className="w-64 h-40 rounded-xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Country preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm font-medium text-center px-4">
                No image selected
              </span>
            )}
          </div>

          {/* Hover overlay + change button */}
          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-white bg-sky-600 hover:bg-sky-700 px-5 py-2.5 rounded-lg text-sm font-medium shadow-md"
            >
              Change Image
            </button>
          </div>

          {/* Remove button when there's a preview */}
          {photoPreview && (
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Upload instructions + trigger button */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm text-gray-600 mb-3">
            Upload a high-quality country image (max 5MB, JPG/PNG)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium shadow-md transition-all"
          >
            <Upload size={18} />
            Upload Country Image
          </button>
        </div>
      </div>
    </div>
  );
}
