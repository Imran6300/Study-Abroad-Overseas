"use client";

import DocumentChecklist from "@/components/userdashboard/DocumentsChecklist";

export default function DocumentsPage() {
  const documents = [
    { name: "Passport", status: "Uploaded" },
    { name: "Transcripts", status: "Pending" },
  ];

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1 className="text-3xl font-bold text-white mb-6">Documents</h1>

      <DocumentChecklist documents={documents} />
    </div>
  );
}
