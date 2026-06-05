"use client";

import { useEffect, useState } from "react";

export default function TopCounselors() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats/top-counselors`,
      { credentials: "include" },
    )
      .then((r) => r.json())
      .then((data) => setCounselors(data.data || []))
      .catch(() => setCounselors([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">
        Top Counselors
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : counselors.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">
          No counselor data yet
        </p>
      ) : (
        <div className="space-y-4">
          {counselors.map((counselor, i) => (
            <div
              key={counselor._id || i}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                  {(counselor.name || "?")[0].toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">
                  {counselor.name}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {counselor.enrolled ?? 0} enrolled
                </p>
                <p className="text-xs text-gray-500">
                  {counselor.totalAssigned ?? 0} leads
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
