import { FileText, Star, Shield, Landmark } from "lucide-react";

import DocumentsSection from "./DocumentsSection";

export default function DocumentsTab({
  applicationDocuments = [],
  visaDocuments = [],
  financialDocuments = [],
  offerLetters = [],
}) {
  return (
    <div className="space-y-8">
      {/* APPLICATION DOCS */}
      <DocumentsSection
        title="Application Documents"
        files={applicationDocuments}
        icon={FileText}
        iconColor="text-indigo-500"
        emptyMessage="No application documents uploaded yet."
      />

      {/* VISA DOCS */}
      <DocumentsSection
        title="Visa Documents"
        files={visaDocuments}
        icon={Shield}
        iconColor="text-teal-500"
        emptyMessage="No visa documents uploaded yet."
      />

      {/* FINANCIAL DOCS */}
      <DocumentsSection
        title="Financial Documents"
        files={financialDocuments}
        icon={Landmark}
        iconColor="text-emerald-500"
        emptyMessage="No financial documents uploaded yet."
      />

      {/* OFFER LETTERS */}
      <DocumentsSection
        title="Offer Letters"
        files={offerLetters}
        icon={Star}
        iconColor="text-amber-500"
        emptyMessage="Offer letters will appear here when uploaded by Khizar team."
      />
    </div>
  );
}
