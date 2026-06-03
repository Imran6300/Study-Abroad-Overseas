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

      <DocumentChecklist documents={documents} loading={loading} />
    </div>
  );
}
