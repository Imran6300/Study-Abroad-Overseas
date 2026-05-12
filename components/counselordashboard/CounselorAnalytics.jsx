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
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Globe, CheckCircle2 } from "lucide-react";

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

const TABS = ["6M", "3M", "1M"];

const dataByTab = {
  "6M": [12, 19, 15, 28, 22, 35],
  "3M": [22, 30, 35],
  "1M": [35],
};
const labelsByTab = {
  "6M": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "3M": ["Apr", "May", "Jun"],
  "1M": ["Jun"],
};

export default function CounselorAnalytics() {
  const [activeTab, setActiveTab] = useState("6M");

  const lineData = {
    labels: labelsByTab[activeTab],
    datasets: [
      {
        label: "Applications",
        data: dataByTab[activeTab],
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
    ],
  };

  const doughnutData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [18, 7, 2],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels: ["Canada", "UK", "USA", "Australia", "Germany", "NZ"],
    datasets: [
      {
        label: "Applications",
        data: [22, 18, 14, 10, 8, 5],
        backgroundColor: [
          "rgba(14,165,233,0.85)",
          "rgba(139,92,246,0.85)",
          "rgba(16,185,129,0.85)",
          "rgba(245,158,11,0.85)",
          "rgba(239,68,68,0.85)",
          "rgba(20,184,166,0.85)",
        ],
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const statCards = [
    {
      label: "Conversion Rate",
      value: "61%",
      delta: "+4%",
      color: "text-sky-500",
      bg: "bg-sky-50",
    },
    {
      label: "Avg. Processing",
      value: "18d",
      delta: "-2d",
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
    {
      label: "Active This Week",
      value: "24",
      delta: "+6",
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
                {s.value}
              </p>
            </div>
            <span className="text-xs font-bold bg-white rounded-lg px-2 py-1 shadow-sm text-slate-600">
              {s.delta}
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
                  Application Trends
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Monthly student application growth
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
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
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
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              {
                label: "Approved",
                val: 18,
                color: "text-emerald-600 bg-emerald-50",
              },
              { label: "Pending", val: 7, color: "text-amber-600 bg-amber-50" },
              { label: "Rejected", val: 2, color: "text-red-600 bg-red-50" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl py-2 px-1 ${s.color}`}>
                <p className="text-lg font-extrabold">{s.val}</p>
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
              Applications by Country
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Top destination countries this cycle
          </p>
          <div className="h-[260px]">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
