"use client";

// ─────────────────────────────────────────────────────────────────
// FILE:  app/dashboard/user/recommendations/page.jsx
//
// BUG FIXED:
//   const universities = [];   ← hardcoded empty array, no API call
//   RecommendedUniversities always rendered "no data" UI.
//
// FIX:
//   Fetch from GET /api/universities/featured which returns the
//   featured/recommended universities the admin has marked.
//   The component already accepts a `universities` prop and
//   renders logos, names and links — we just needed to supply data.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import RecommendedUniversities from "@/components/userdashboard/RecommendedUniversities";

export default function RecommendationsPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/featured`,
          { credentials: "include", cache: "no-store" },
        );

        if (!res.ok) throw new Error("Failed to load recommendations");

        const data = await res.json();

        // Backend returns: { success: true, universities: [...] }
        setUniversities(
          Array.isArray(data.universities) ? data.universities : [],
        );
      } catch (err) {
        console.error("[RecommendationsPage] fetch error:", err.message);
        setError("Could not load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 pt-16 sm:pt-5">
        <h1 className="text-3xl font-bold text-white mb-6">
          Recommended Universities
        </h1>
        <div className="text-gray-400 text-center py-20">
          Loading recommendations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-10 pt-16 sm:pt-5">
        <h1 className="text-3xl font-bold text-white mb-6">
          Recommended Universities
        </h1>
        <div className="text-red-400 text-center py-20">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1 className="text-3xl font-bold text-white mb-6">
        Recommended Universities
      </h1>

      {universities.length === 0 ? (
        <div className="text-gray-400 text-center py-20">
          No recommendations available yet. Complete your profile to get
          personalized suggestions.
        </div>
      ) : (
        <RecommendedUniversities universities={universities} />
      )}
    </div>
  );
}
