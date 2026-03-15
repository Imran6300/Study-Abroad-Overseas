"use client";

export default function DocumentsSection({ data = {} }) {
  const card =
    "bg-gray-50 border border-gray-300 rounded-xl p-4 flex flex-col items-center justify-between";

  const container =
    "bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-6";

  const docs = [
    { key: "passport", label: "Passport Scan" },
    { key: "photo", label: "Passport Photo" },
    { key: "marksheet10", label: "10th Marksheet" },
    { key: "marksheet12", label: "12th Marksheet" },
    { key: "resume", label: "Resume / CV" },
    { key: "bachelorDocs", label: "Bachelor Documents" },
  ];

  const isImage = (url) => {
    return url?.match(/\.(jpg|jpeg|png|webp)$/i);
  };

  return (
    <div className={container}>
      <h3 className="text-lg font-semibold text-gray-800">Documents</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc) => {
          const file = data?.[doc.key]?.url;

          return (
            <div key={doc.key} className={card}>
              <p className="font-semibold text-gray-700 mb-3">{doc.label}</p>

              {file ? (
                <>
                  {/* Preview */}
                  <div className="w-full h-40 flex items-center justify-center bg-white border rounded-lg overflow-hidden mb-3">
                    {isImage(file) ? (
                      <img
                        src={file}
                        alt={doc.label}
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <div className="text-gray-500 text-sm text-center px-4">
                        PDF / Document Preview
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                  >
                    Download
                  </a>
                </>
              ) : (
                <div className="text-sm text-red-500">Not Uploaded</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
