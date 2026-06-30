"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyDeadlines } from "@/store/deadlineSlice";
import DocumentChecklist from "@/components/userdashboard/DocumentsChecklist";

export default function DocumentsPage() {
  const dispatch = useDispatch();

  const { deadlines, loading } = useSelector((state) => state.deadline);

  useEffect(() => {
    dispatch(fetchMyDeadlines());
  }, [dispatch]);

  const documents = [
    ...(deadlines?.upcoming || []),
    ...(deadlines?.overdue || []),
    ...(deadlines?.completed || []),
  ].filter((item) => item.requiresDocumentUpload);

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1
        className="text-3xl font-bold mb-6"
        style={{
          color: "var(--brand-accent)",
        }}
      >
        Documents
      </h1>

      {/* Information Banner */}
      <div
        className="rounded-xl border p-4"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <p
          className="text-sm leading-6"
          style={{ color: "var(--text-secondary)" }}
        >
          <span
            className="font-semibold"
            style={{ color: "var(--brand-accent)" }}
          >
            Note:
          </span>{" "}
          The document upload option will appear here only after your counselor
          requests the required documents. Once requested, you'll be able to
          upload them directly from this page.
        </p>
      </div>

      <DocumentChecklist documents={documents} loading={loading} />
    </div>
  );
}
