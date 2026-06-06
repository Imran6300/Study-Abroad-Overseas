"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import ExportButtons from "@/components/counselordashboard/ExportButtons";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  Users,
  FileCheck,
  Globe,
  BarChart3,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "@/components/Animations/formanimations/animate";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

function KpiCard({ icon: Icon, iconColor, label, value, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={iconColor} size={20} />
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      {loading ? (
        <div className="h-8 w-20 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
      )}
    </div>
  );
}

const STAGE_COLORS = {
  enrolled: "#10b981",
  offer_received: "#3b82f6",
  visa_process: "#8b5cf6",
  application_submitted: "#f59e0b",
  application_started: "#f97316",
  qualified: "#6366f1",
  contacted: "#94a3b8",
  lead: "#cbd5e1",
  lost: "#ef4444",
};

const STAGE_LABELS = {
  lead: "Lead",
  contacted: "Contacted",
  qualified: "Counseled",
  application_started: "App Started",
  application_submitted: "Applied",
  offer_received: "Offer Received",
  visa_process: "Visa Process",
  enrolled: "Enrolled",
  lost: "Lost",
};

export default function ReportsPage() {
  const { user } = useSelector((s) => s.auth);
  const [overview, setOverview] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [topCounselors, setTopCounselors] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  const revenueChartRef = useRef(null);
  const statusChartRef = useRef(null);
  const counselorChartRef = useRef(null);
  const revenueInstance = useRef(null);
  const statusInstance = useRef(null);
  const counselorInstance = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/admin/stats/overview`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`${BASE}/api/admin/stats/pipeline`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`${BASE}/api/admin/stats/top-counselors`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`${BASE}/api/counselor/analytics/monthly?months=6`, {
        credentials: "include",
      }).then((r) => r.json()),
    ])
      .then(([ov, pl, tc, mon]) => {
        setOverview(ov.data || null);
        setPipeline(pl.data || null);
        setTopCounselors(tc.data || []);
        setMonthly(mon.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Charts
  useEffect(() => {
    if (loading) return;

    import("chart.js/auto").then((mod) => {
      const Chart = mod.default;

      // Monthly applications trend
      if (revenueChartRef.current && monthly.length > 0) {
        revenueInstance.current?.destroy();
        revenueInstance.current = new Chart(revenueChartRef.current, {
          type: "line",
          data: {
            labels: monthly.map((m) => m.month),
            datasets: [
              {
                label: "Applications",
                data: monthly.map((m) => m.applications || m.count || 0),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }

      // Pipeline pie
      if (statusChartRef.current && pipeline) {
        statusInstance.current?.destroy();
        const stageKeys = Object.keys(pipeline).filter((k) => pipeline[k] > 0);
        statusInstance.current = new Chart(statusChartRef.current, {
          type: "doughnut",
          data: {
            labels: stageKeys.map((k) => STAGE_LABELS[k] || k),
            datasets: [
              {
                data: stageKeys.map((k) => pipeline[k]),
                backgroundColor: stageKeys.map(
                  (k) => STAGE_COLORS[k] || "#94a3b8",
                ),
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "bottom", labels: { font: { size: 11 } } },
            },
          },
        });
      }

      // Top counselors bar
      if (counselorChartRef.current && topCounselors.length > 0) {
        counselorInstance.current?.destroy();
        counselorInstance.current = new Chart(counselorChartRef.current, {
          type: "bar",
          data: {
            labels: topCounselors.slice(0, 8).map((c) => c.name),
            datasets: [
              {
                label: "Enrolled",
                data: topCounselors.slice(0, 8).map((c) => c.enrolled || 0),
                backgroundColor: "#10b981",
              },
              {
                label: "Total Leads",
                data: topCounselors
                  .slice(0, 8)
                  .map((c) => c.totalAssigned || 0),
                backgroundColor: "#e5e7eb",
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: { x: { stacked: false }, y: { beginAtZero: true } },
          },
        });
      }
    });

    return () => {
      [revenueInstance, statusInstance, counselorInstance].forEach((r) => {
        r.current?.destroy();
        r.current = null;
      });
    };
  }, [loading, monthly, pipeline, topCounselors]);

  const convRate = overview?.totalLeads
    ? `${Math.round((overview.enrolled / overview.totalLeads) * 100)}%`
    : "0%";

  const visaRate = overview?.totalLeads
    ? `${Math.round(((pipeline?.enrolled || 0) / Math.max(overview.totalLeads, 1)) * 100)}%`
    : "—";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Reports & Analytics"
          counselorName={user?.name}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-7xl mx-auto"
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Platform Overview
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Live data from your database
                </p>
              </div>
              <ExportButtons mode="admin" />
            </div>

            {/* KPI Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              <KpiCard
                icon={Users}
                iconColor="text-sky-600"
                label="Total Leads"
                value={overview?.totalLeads}
                loading={loading}
              />
              <KpiCard
                icon={FileCheck}
                iconColor="text-emerald-600"
                label="Applications"
                value={overview?.totalApplications}
                loading={loading}
              />
              <KpiCard
                icon={Globe}
                iconColor="text-indigo-600"
                label="Visa Success"
                value={visaRate}
                loading={loading}
              />
              <KpiCard
                icon={CheckCircle}
                iconColor="text-green-600"
                label="Enrolled"
                value={overview?.enrolled}
                loading={loading}
              />
              <KpiCard
                icon={TrendingUp}
                iconColor="text-purple-600"
                label="Conversion"
                value={overview && convRate}
                loading={loading}
              />
              <KpiCard
                icon={BarChart3}
                iconColor="text-amber-600"
                label="Counselors"
                value={overview?.totalCounselors}
                loading={loading}
              />
            </motion.div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly trend */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" /> Monthly
                  Applications Trend
                </h3>
                {loading ? (
                  <div className="h-64 bg-gray-50 animate-pulse rounded-xl" />
                ) : monthly.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                    No data yet
                  </div>
                ) : (
                  <div className="h-64">
                    <canvas ref={revenueChartRef} />
                  </div>
                )}
              </motion.div>

              {/* Pipeline doughnut */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileCheck size={18} className="text-emerald-600" /> Pipeline
                  Breakdown
                </h3>
                {loading ? (
                  <div className="h-64 bg-gray-50 animate-pulse rounded-xl" />
                ) : !pipeline ? (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                    No data yet
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <canvas ref={statusChartRef} />
                  </div>
                )}
              </motion.div>

              {/* Top counselors */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2"
              >
                <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-600" /> Top
                  Counselors by Enrollments
                </h3>
                {loading ? (
                  <div className="h-64 bg-gray-50 animate-pulse rounded-xl" />
                ) : topCounselors.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                    No counselors yet
                  </div>
                ) : (
                  <div className="h-72">
                    <canvas ref={counselorChartRef} />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Detailed counselor table */}
            {!loading && topCounselors.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-800">
                    Counselor Performance Table
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        {[
                          "Counselor",
                          "Total Leads",
                          "Enrolled",
                          "Offers",
                          "Visa Approved",
                          "Conversion",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topCounselors.map((c, i) => {
                        const rate =
                          c.totalAssigned > 0
                            ? Math.round((c.enrolled / c.totalAssigned) * 100)
                            : 0;
                        return (
                          <tr
                            key={c._id || i}
                            className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-gray-800">
                              {c.name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {c.totalAssigned || 0}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-green-700">
                                {c.enrolled || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {c.offersReceived || 0}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {c.visaApproved || 0}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`font-semibold ${rate >= 50 ? "text-green-700" : rate >= 25 ? "text-amber-600" : "text-gray-500"}`}
                              >
                                {rate}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
