"use client";
// app/admin/revenue/page.jsx — REAL DATA ONLY (no mock)

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  containerVariants,
  itemVariants,
} from "@/components/Animations/formanimations/animate";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

const STATUS_CFG = {
  trial: { label: "Trial", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  active_free: {
    label: "Free (KO Enroll)",
    cls: "bg-green-50 text-green-700 border-green-200",
  },
  payment_required: {
    label: "Payment Due",
    cls: "bg-red-50 text-red-700 border-red-200",
  },
  paid: {
    label: "Paid",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  suspended: {
    label: "Suspended",
    cls: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

function StatCard({ icon: Icon, iconBg, label, value, sub, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={18} className="text-white" />
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
      )}
      {sub && !loading && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function RecordEnrollmentButton({ counselorId, onDone }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const record = async () => {
    if (!counselorId || loading || done) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/saas/admin/record-enrollment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counselorId }),
      });
      if (res.ok) {
        setDone(true);
        onDone?.();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  if (done)
    return (
      <span className="text-xs font-semibold text-green-600">Recorded</span>
    );
  return (
    <button
      onClick={record}
      disabled={loading}
      className="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "+ KO Enroll"}
    </button>
  );
}

export default function RevenuePage() {
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInst = useRef(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${BASE}/api/admin/stats/revenue`, { credentials: "include" }).then(
        (r) => r.json(),
      ),
      fetch(`${BASE}/api/saas/admin/overview?limit=200`, {
        credentials: "include",
      }).then((r) => r.json()),
    ])
      .then(([rev, saas]) => {
        setStats(rev.data || null);
        setCounselors(saas.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (loading || counselors.length === 0) return;
    import("chart.js/auto").then((mod) => {
      const Chart = mod.default;
      if (!chartRef.current) return;
      chartInst.current?.destroy();
      const counts = {};
      for (const c of counselors)
        counts[c.saasStatus] = (counts[c.saasStatus] || 0) + 1;
      chartInst.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: Object.keys(counts).map((k) => STATUS_CFG[k]?.label || k),
          datasets: [
            {
              data: Object.values(counts),
              backgroundColor: [
                "#3b82f6",
                "#10b981",
                "#ef4444",
                "#22c55e",
                "#94a3b8",
              ],
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
    });
    return () => {
      chartInst.current?.destroy();
      chartInst.current = null;
    };
  }, [loading, counselors]);

  const paid = counselors.filter((c) => c.saasStatus === "paid").length;
  const due = counselors.filter(
    (c) => c.saasStatus === "payment_required",
  ).length;
  const trial = counselors.filter((c) => c.saasStatus === "trial").length;
  const free = counselors.filter((c) => c.saasStatus === "active_free").length;
  const currentMRR = paid * 5000;
  const potentialMRR = due * 5000;
  const filtered =
    filter === "all"
      ? counselors
      : counselors.filter((c) => c.saasStatus === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Revenue" counselorName={user?.name} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-7xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              <StatCard
                icon={DollarSign}
                iconBg="bg-green-500"
                label="Current MRR"
                value={`₹${currentMRR.toLocaleString("en-IN")}`}
                sub={`${paid} paid counselors`}
                loading={loading}
              />
              <StatCard
                icon={AlertCircle}
                iconBg="bg-red-500"
                label="Payment Due"
                value={due}
                sub={`₹${potentialMRR.toLocaleString("en-IN")} potential`}
                loading={loading}
              />
              <StatCard
                icon={Clock}
                iconBg="bg-blue-500"
                label="In Trial"
                value={trial}
                sub="Active trials"
                loading={loading}
              />
              <StatCard
                icon={CheckCircle}
                iconBg="bg-emerald-500"
                label="Free (KO Enrolled)"
                value={free}
                sub="Processed KO enrollment"
                loading={loading}
              />
              <StatCard
                icon={TrendingUp}
                iconBg="bg-purple-500"
                label="Total Enrollments"
                value={stats?.totalEnrollments ?? 0}
                sub="Via KO network"
                loading={loading}
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  Counselor Breakdown
                </h3>
                {loading ? (
                  <div className="h-52 bg-gray-50 animate-pulse rounded-xl" />
                ) : counselors.length === 0 ? (
                  <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
                    No counselors yet
                  </div>
                ) : (
                  <div className="h-52 flex items-center justify-center">
                    <canvas ref={chartRef} />
                  </div>
                )}
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="font-semibold text-gray-800">
                    Revenue Summary
                  </h3>
                  <span className="text-sm bg-green-50 border border-green-200 text-green-700 rounded-xl px-3 py-1.5 font-bold">
                    ₹{currentMRR.toLocaleString("en-IN")}/mo MRR
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      l: "Paid counselors × ₹5,000",
                      v: `₹${currentMRR.toLocaleString("en-IN")}`,
                      c: "text-green-700",
                    },
                    {
                      l: "Potential (payment due × ₹5,000)",
                      v: `₹${potentialMRR.toLocaleString("en-IN")}`,
                      c: "text-amber-600",
                    },
                    {
                      l: "Total counselors in system",
                      v: counselors.length,
                      c: "text-gray-700",
                    },
                    {
                      l: "Applications this month",
                      v: stats?.applicationsThisMonth ?? "—",
                      c: "text-gray-700",
                    },
                    {
                      l: "Platform conversion rate",
                      v:
                        stats?.conversionRate != null
                          ? `${stats.conversionRate}%`
                          : "—",
                      c: "text-gray-700",
                    },
                  ].map((row) => (
                    <div
                      key={row.l}
                      className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-600">{row.l}</span>
                      <span className={`text-sm font-bold ${row.c}`}>
                        {loading ? "..." : row.v}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <h3 className="font-semibold text-gray-800">
                  All Counselors — SaaS Status
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {[
                    "all",
                    "trial",
                    "active_free",
                    "payment_required",
                    "paid",
                  ].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {f === "all" ? "All" : STATUS_CFG[f]?.label || f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No counselors found
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Counselor",
                          "Status",
                          "Trial Ends",
                          "KO Enrollments",
                          "Paid Until",
                          "Action",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c, i) => {
                        const cfg = STATUS_CFG[c.saasStatus] || {};
                        return (
                          <tr
                            key={c._id || i}
                            className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-800">
                                {c.counselor?.name || "—"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {c.counselor?.email || ""}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.cls}`}
                              >
                                {cfg.label || c.saasStatus}
                              </span>
                              {c.isInTrial && c.trialDaysLeft <= 5 && (
                                <p className="text-[10px] text-red-500 mt-0.5">
                                  {c.trialDaysLeft}d left
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {c.trialEndsAt
                                ? new Date(c.trialEndsAt).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`font-bold text-sm ${c.enrollmentCount >= 1 ? "text-green-700" : "text-gray-400"}`}
                              >
                                {c.enrollmentCount || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {c.saasPaymentValidUntil
                                ? new Date(
                                    c.saasPaymentValidUntil,
                                  ).toLocaleDateString("en-IN")
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <RecordEnrollmentButton
                                counselorId={c.counselor?._id}
                                onDone={load}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
