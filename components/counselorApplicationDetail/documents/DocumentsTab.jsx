import { FileText, Star, Shield } from "lucide-react";

import DocumentsSection from "./DocumentsSection";

export default function DocumentsTab({ documents, offerLetters, visaFiles }) {
  return (
    <div className="space-y-8">
      <DocumentsSection
        title="Application Documents"
        files={documents}
        icon={FileText}
        iconColor="text-indigo-500"
        emptyMessage="No documents uploaded yet."
      />

      <DocumentsSection
        title="Offer Letters"
        files={offerLetters}
        icon={Star}
        iconColor="text-amber-500"
        emptyMessage="Offer letters will appear here when uploaded by Khizar team."
      />

      <DocumentsSection
        title="Visa Documents"
        files={visaFiles}
        icon={Shield}
        iconColor="text-teal-500"
        emptyMessage="Visa documents will appear here once processing begins."
      />
    </div>
  );
}
