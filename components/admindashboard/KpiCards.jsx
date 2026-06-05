"use client";

import { useEffect, useState } from "react";
import AdminCard from "@/components/admindashboard/AdminCard";

export default function KpiCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${API}/api/admin/stats/overview`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setStats(d.data || null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const convRate =
    stats?.totalLeads > 0
      ? `${Math.round((stats.enrolled / stats.totalLeads) * 100)}%`
      : "0%";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <AdminCard
        title="Total Leads"
        value={stats?.totalLeads ?? "—"}
        icon="👥"
        trend=""
      />
      <AdminCard
        title="Total Applications"
        value={stats?.totalApplications ?? "—"}
        icon="📄"
        trend=""
      />
      <AdminCard
        title="Conversion Rate"
        value={stats?.totalLeads != null ? convRate : "—"}
        icon="📈"
        trend=""
      />
      <AdminCard
        title="Enrollments"
        value={stats?.enrolled ?? "—"}
        icon="🎓"
        trend=""
      />
    </div>
  );
}
