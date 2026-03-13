export default function Step7Documents({
  data,
  updateForm,
  nextStep,
  prevStep,
}) {
  const handleFile = (e, field) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File must be smaller than 10MB");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF or Image files allowed");
      return;
    }

    updateForm({ [field]: file });
  };

  const isPostgraduateOrPhD =
    data.studyLevel === "Postgraduate" || data.studyLevel === "PhD";

  const isValid =
    data.passport &&
    data.photo &&
    data.marksheet10 &&
    data.marksheet12 &&
    data.resume &&
    (!isPostgraduateOrPhD || data.bachelorDocs);

  const fileInputClasses = `
    w-full px-4 py-3 rounded-xl border border-gray-300 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
    transition-all duration-200 outline-none
    hover:border-gray-400 file:mr-4 file:py-2 file:px-4 
    file:rounded-lg file:border-0 file:text-sm file:font-semibold 
    file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100
  `;

  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

  const fileFields = [
    {
      key: "passport",
      label: "Passport Scan (front & last page)",
      accept: ".pdf",
    },
    {
      key: "photo",
      label: "Recent Passport-size Photo",
      accept: ".jpg,.jpeg,.png",
    },
    {
      key: "marksheet10",
      label: "Class 10 Marksheet & Certificate",
      accept: ".pdf",
    },
    {
      key: "marksheet12",
      label: "Class 12 / Diploma Marksheet & Certificate",
      accept: ".pdf",
    },
    { key: "resume", label: "Updated Resume / CV", accept: ".pdf" },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload Required Documents
      </h2>

      {fileFields.map((field) => (
        <div key={field.key}>
          <label className={labelClasses}>
            {field.label} <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            accept={field.accept}
            onChange={(e) => handleFile(e, field.key)}
            className={fileInputClasses}
          />
          {data[field.key] && (
            <div className="mt-2 text-sm text-green-600">
              ✓ {data[field.key].name}
              {data[field.key].type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(data[field.key])}
                  className="mt-2 w-24 h-24 object-cover rounded-lg border"
                />
              )}
            </div>
          )}
        </div>
      ))}

      {isPostgraduateOrPhD && (
        <div>
          <label className={labelClasses}>
            Bachelor's Degree Certificates / Transcripts (all semesters) *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFile(e, "bachelorDocs")}
            className={fileInputClasses}
          />
          {data.bachelorDocs && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              ✓ {data.bachelorDocs.name}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-6">
        <button
          onClick={prevStep}
          className="flex-1 py-3 px-6 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          ← Back
        </button>
        <button
          onClick={() => isValid && nextStep()}
          disabled={!isValid}
          className={`
            flex-1 py-3 px-6 rounded-xl font-semibold text-white
            transition-all duration-300 transform
            ${
              isValid
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          Continue to Review →
        </button>
      </div>
    </div>
  );
}
