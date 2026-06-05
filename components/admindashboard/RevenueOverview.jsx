"use client";

import { useEffect, useState } from "react";

function formatINR(val) {
  if (val == null || isNaN(val)) return "—";
  if (val >= 10_00_000) return `₹${(val / 10_00_000).toFixed(2)} Lakh`;
  if (val >= 1_000) return `₹${(val / 1_000).toFixed(1)}K`;
  return `₹${val}`;
}

export default function RevenueOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats/revenue`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setData(d.data || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const skeleton = (
    <div className="w-32 h-8 bg-gray-100 rounded animate-pulse" />
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Revenue Overview
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600">Premium Plans (Active)</p>
          {loading ? (
            skeleton
          ) : (
            <p className="text-2xl font-bold text-green-700 mt-1">
              {data?.activePremiumCount ?? "—"}{" "}
              <span className="text-sm font-normal text-gray-500">
                counselors
              </span>
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Enrollments</p>
          {loading ? (
            skeleton
          ) : (
            <p className="text-2xl font-bold text-indigo-700 mt-1">
              {data?.totalEnrollments ?? "—"}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600">Applications This Month</p>
          {loading ? (
            skeleton
          ) : (
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {data?.applicationsThisMonth ?? "—"}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600">Conversion Rate</p>
          {loading ? (
            skeleton
          ) : (
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {data?.conversionRate != null ? `${data.conversionRate}%` : "—"}
            </p>
          )}
        </div>
      </div>
      {!loading && !data && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          Revenue stats unavailable
        </p>
      )}
    </div>
  );
}
