"use client";

import { useEffect, useState } from "react";
import CounselorSidebar from "@/components/counselordashboard/CounselorSidebar";
import CounselorMeetings from "@/components/counselordashboard/CounselorMeetings";
import { useSelector } from "react-redux";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MeetingsPage() {
  const { user } = useSelector((s) => s.auth);
  const [leads, setLeads] = useState([]);

  // Pre-load leads so the form can link meetings to students
  useEffect(() => {
    fetch(`${BASE}/api/counselor/students?limit=200`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setLeads(d.data?.students || []))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CounselorSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
            <p className="text-slate-500 mt-1">
              Schedule and manage student counseling sessions
            </p>
          </div>
          <CounselorMeetings leads={leads} />
        </div>
      </div>
    </div>
  );
}
