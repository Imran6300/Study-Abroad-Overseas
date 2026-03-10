"use client";

import ScholarshipCta from "@/components/userdashboard/ScholarshipCTA";

export default function ScholarshipsPage() {
  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1 className="text-3xl font-bold text-white mb-6">Scholarships</h1>

      <ScholarshipCta />
    </div>
  );
}
