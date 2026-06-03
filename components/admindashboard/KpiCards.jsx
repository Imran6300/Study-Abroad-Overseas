"use client";

import { useEffect, useState } from "react";
import AdminCard from "@/components/admindashboard/AdminCard";

export default function KpiCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_BACKEND_URL;
    Promise.all([
      fetch(`${API}/api/lead?page=1&limit=1`, { credentials: "include" }),
      fetch(`${API}/api/applications?page=1&limit=1`, {
        credentials: "include",
      }),
    ])
      .then(async ([leadsRes, appsRes]) => {
        const leads = await leadsRes.json().catch(() => ({}));
        const apps = await appsRes.json().catch(() => ({}));
        setStats({
          totalLeads: leads.total ?? 0,
          totalApplications: apps.total ?? 0,
        });
      })
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
      <AdminCard title="Conversion Rate" value="—" icon="📈" trend="" />
      <AdminCard title="Enrollments" value="—" icon="🎓" trend="" />
    </div>
  );
}
