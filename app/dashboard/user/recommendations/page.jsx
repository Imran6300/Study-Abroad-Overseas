"use client";

import RecommendedUniversities from "@/components/userdashboard/RecommendedUniversities";

export default function RecommendationsPage() {
  const universities = [];

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1 className="text-3xl font-bold text-white mb-6">
        Recommended Universities
      </h1>

      <RecommendedUniversities universities={universities} />
    </div>
  );
}
