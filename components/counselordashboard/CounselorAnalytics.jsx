// components/counselordashboard/CounselorAnalytics.jsx
"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Globe, CheckCircle2 } from "lucide-react";
import { counselorApi } from "@/lib/counselorApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Map "6M" → 6, "3M" → 3, "1M" → 1
const TAB_MONTHS = { "6M": 6, "3M": 3, "1M": 1 };
const TABS = ["6M", "3M", "1M"];

function ChartSkeleton({ height = "h-[280px]" }) {
  return <div className={`${height} bg-slate-100 rounded-2xl animate-pulse`} />;
}

export default function CounselorAnalytics() {
  const [activeTab, setActiveTab] = useState("6M");
  const [monthlyData, setMonthlyData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [monthly, countries, overview] = await Promise.all([
        counselorApi.getMonthlyAnalytics(6), // always fetch 6M, slice in UI
        counselorApi.getCountryBreakdown(),
        counselorApi.getOverview(),
      ]);
      setMonthlyData(monthly.data || []);
      setCountryData(countries.data || []);
      setOverviewStats(overview.data?.stats || null);
    } catch (err) {
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Filter monthly data by active tab
  const monthsToShow = TAB_MONTHS[activeTab];
  const filteredMonthly = monthlyData.slice(-monthsToShow);

  const lineData = {
    labels: filteredMonthly.map((d) => `${MONTH_NAMES[d.month]} ${d.year}`),
    datasets: [
      {
        label: "New Leads",
        data: filteredMonthly.map((d) => d.newLeads || 0),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14,165,233,0.10)",
        fill: true,
        tension: 0.45,
        pointBackgroundColor: "#0ea5e9",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        label: "Enrolled",
        data: filteredMonthly.map((d) => d.enrolled || 0),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.08)",
        fill: true,
        tension: 0.45,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };

  // Doughnut from real overview stats
  const approved = overviewStats?.visaApproved || 0;
  const total = overviewStats?.totalAssigned || 0;
  const pending = Math.max(
    0,
    (overviewStats?.pendingApplications || 0) - approved,
  );
  const lost = overviewStats?.lost || 0;

  const doughnutData = {
    labels: ["Visa Approved", "Pending", "Lost"],
    datasets: [
      {
        data: [approved, pending, lost],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  // Bar chart from real country breakdown
  const barData = {
    labels: countryData.slice(0, 8).map((d) => d.country || "Unknown"),
    datasets: [
      {
        label: "Students",
        data: countryData.slice(0, 8).map((d) => d.count || 0),
        backgroundColor: [
          "rgba(14,165,233,0.85)",
          "rgba(139,92,246,0.85)",
          "rgba(16,185,129,0.85)",
          "rgba(245,158,11,0.85)",
          "rgba(239,68,68,0.85)",
          "rgba(20,184,166,0.85)",
          "rgba(99,102,241,0.85)",
          "rgba(244,63,94,0.85)",
        ],
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  // Stat mini cards from real data
  const convRate = overviewStats?.conversionRate ?? 0;
  const avgHours = overviewStats?.avgResponseHours ?? 0;
  const avgDays = avgHours > 0 ? `${Math.round(avgHours / 24)}d` : "N/A";

  const statCards = [
    {
      label: "Conversion Rate",
      value: `${convRate}%`,
      delta: convRate > 0 ? `${convRate}%` : "0%",
      color: "text-sky-500",
      bg: "bg-sky-50",
    },
    {
      label: "Avg. Response Time",
      value: avgDays,
      delta: avgHours > 0 ? `${Math.round(avgHours)}h` : "—",
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
    {
      label: "Active Students",
      value: `${overviewStats?.activeStudents ?? 0}`,
      delta: `of ${overviewStats?.totalAssigned ?? 0}`,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Stat mini cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${s.bg} rounded-2xl px-5 py-4 flex items-center justify-between border border-slate-100`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {s.label}
              </p>
              <p className={`text-3xl font-extrabold ${s.color} mt-0.5`}>
                {loading ? "..." : s.value}
              </p>
            </div>
            <span className="text-xs font-bold bg-white rounded-lg px-2 py-1 shadow-sm text-slate-600">
              {loading ? "..." : s.delta}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LINE CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-sky-500" />
                <h2 className="text-xl font-bold text-slate-800">
                  Student Trends
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Monthly new leads and enrolled students
              </p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            {loading ? (
              <ChartSkeleton height="h-[280px]" />
            ) : (
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true, position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    x: { grid: { display: false }, border: { display: false } },
                    y: {
                      grid: { color: "#f1f5f9" },
                      border: { display: false },
                      ticks: { color: "#94a3b8" },
                    },
                  },
                }}
              />
            )}
          </div>
        </motion.div>

        {/* DOUGHNUT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-800">Visa Status</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Current visa approvals breakdown
            </p>
          </div>
          <div className="h-[200px] flex items-center justify-center">
            {loading ? (
              <div className="w-40 h-40 rounded-full bg-slate-100 animate-pulse" />
            ) : (
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { padding: 16, font: { size: 12 } },
                    },
                  },
                  cutout: "72%",
                }}
              />
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              {
                label: "Approved",
                val: approved,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "Pending",
                val: pending,
                color: "text-amber-600 bg-amber-50",
              },
              { label: "Lost", val: lost, color: "text-red-600 bg-red-50" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl py-2 px-1 ${s.color}`}>
                <p className="text-lg font-extrabold">
                  {loading ? "..." : s.val}
                </p>
                <p className="text-[10px] font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BAR CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <Globe size={18} className="text-violet-500" />
            <h2 className="text-xl font-bold text-slate-800">
              Students by Country
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Top destination countries for assigned students
          </p>
          <div className="h-[260px]">
            {loading ? (
              <ChartSkeleton height="h-[260px]" />
            ) : countryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No country data yet
              </div>
            ) : (
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      border: { display: false },
                      ticks: { color: "#64748b", font: { weight: "600" } },
                    },
                    y: {
                      grid: { color: "#f1f5f9" },
                      border: { display: false },
                      ticks: { color: "#94a3b8" },
                    },
                  },
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
