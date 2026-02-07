import { Upload, X } from "lucide-react";

export default function CountryFlagUploadSection({
  flagPreview,
  setFlagPreview,
  setFlagFile,
  fileInputRef,
  isViewMode,
}) {
  const handleFlagChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Flag image must be under 2MB");
      return;
    }

    setFlagFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setFlagPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeFlag = () => {
    setFlagPreview(null);
    setFlagFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isViewMode && !flagPreview) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Country Flag
      </h3>

      <div className="flex items-center gap-6">
        {/* Flag Preview */}
        <div className="relative">
          <div className="w-32 h-20 rounded-lg overflow-hidden border bg-white flex items-center justify-center">
            {flagPreview ? (
              <img
                src={flagPreview}
                alt="Country Flag"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">No flag</span>
            )}
          </div>

          {!isViewMode && flagPreview && (
            <button
              type="button"
              onClick={removeFlag}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Upload Button */}
        {!isViewMode && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFlagChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium shadow-sm"
            >
              <Upload size={16} />
              Upload Flag
            </button>
          </>
        )}
      </div>
    </div>
  );
}
