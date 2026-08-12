import { FileText, Star, Shield, Landmark } from "lucide-react";

import DocumentsSection from "./DocumentsSection";
import CounselorDocumentUpload from "./CounselorDocumentUpload";

export default function DocumentsTab({
  leadId,
  isRegistered = true,
  applicationDocuments = [],
  visaDocuments = [],
  financialDocuments = [],
  offerLetters = [],
}) {
  return (
    <div className="space-y-8">
      {/* UPLOAD ON BEHALF OF STUDENT — always available, account or not */}
      {leadId && <CounselorDocumentUpload leadId={leadId} />}

      {/* REQUESTED FROM STUDENT (via deadline) */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-1">
          Requested From Student
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {isRegistered
            ? 'Documents the student uploaded themselves — either against a deadline you set, or self-submitted on their own (marked "Self-submitted", capped at 15).'
            : "Available once the student creates an account and can log in to upload documents."}
        </p>

        {/* APPLICATION DOCS */}
        <DocumentsSection
          title="Application Documents"
          files={applicationDocuments}
          icon={FileText}
          iconColor="text-indigo-500"
          emptyMessage="No application documents uploaded yet."
        />

        {/* VISA DOCS */}
        <div className="mt-6">
          <DocumentsSection
            title="Visa Documents"
            files={visaDocuments}
            icon={Shield}
            iconColor="text-teal-500"
            emptyMessage="No visa documents uploaded yet."
          />
        </div>

        {/* FINANCIAL DOCS */}
        <div className="mt-6">
          <DocumentsSection
            title="Financial Documents"
            files={financialDocuments}
            icon={Landmark}
            iconColor="text-emerald-500"
            emptyMessage="No financial documents uploaded yet."
          />
        </div>
      </div>

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
