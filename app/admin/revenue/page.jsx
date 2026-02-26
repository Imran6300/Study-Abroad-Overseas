// app/admin/revenue/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useSelector } from "react-redux";

//animation components
import {
  containerVariants,
  itemVariants,
} from "@/components/Animations/formanimations/animate";

export default function RevenuePage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [revenueData, setRevenueData] = useState({
    total: 0,
    thisMonth: 0,
    pending: 0,
    growth: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("thisMonth");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Dummy data – you will replace this with real backend later
    const mockData = {
      total: 1245000,
      thisMonth: 285000,
      pending: 98000,
      growth: 18.4, // % vs last month
      monthlyRevenue: [
        { month: "Jan", revenue: 180000 },
        { month: "Feb", revenue: 210000 },
        { month: "Mar", revenue: 195000 },
        { month: "Apr", revenue: 240000 },
        { month: "May", revenue: 320000 },
        { month: "Jun", revenue: 285000 },
        { month: "Jul", revenue: 400000 },
        { month: "Aug", revenue: 380000 },
        { month: "Sep", revenue: 450000 },
        { month: "Oct", revenue: 520000 },
        { month: "Nov", revenue: 600000 },
        { month: "Dec", revenue: 285000 },
      ],
      transactions: [
        {
          id: "TXN-001",
          student: "Ahmed Khan",
          amount: 45000,
          type: "Visa Fee",
          counselor: "Sara Ahmed",
          date: "2026-01-28",
          status: "Completed",
        },
        {
          id: "TXN-002",
          student: "Priya Sharma",
          amount: 120000,
          type: "Application Package",
          counselor: "John Mathew",
          date: "2026-01-25",
          status: "Pending",
        },
        {
          id: "TXN-003",
          student: "Rahul Verma",
          amount: 75000,
          type: "Commission",
          counselor: "Aisha Khan",
          date: "2026-01-20",
          status: "Completed",
        },
        {
          id: "TXN-004",
          student: "Sneha Patel",
          amount: 95000,
          type: "Visa Fee",
          counselor: "Sara Ahmed",
          date: "2026-01-15",
          status: "Completed",
        },
        {
          id: "TXN-005",
          student: "Vikram Singh",
          amount: 60000,
          type: "Counseling Fee",
          counselor: "John Mathew",
          date: "2026-01-10",
          status: "Completed",
        },
      ],
    };

    setRevenueData(mockData);
    setLoading(false);

    return () => {
      // Cleanup chart on unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (loading || !chartRef.current) return;

    let chart;

    import("chart.js/auto").then((module) => {
      const Chart = module.default;

      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: revenueData.monthlyRevenue.map((item) => item.month),
          datasets: [
            {
              label: "Monthly Revenue (₹)",
              data: revenueData.monthlyRevenue.map((item) => item.revenue),
              borderColor: "#0284c7",
              backgroundColor: "rgba(2,132,199,0.15)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      chartInstance.current = chart;
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [loading, revenueData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Loading revenue data...</p>
        </motion.div>
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Revenue & Earnings"
          counselorName={CounselorName}
          btnName="+ Record Payment"
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-10 max-w-7xl mx-auto"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <DollarSign size={20} className="text-emerald-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formatCurrency(revenueData.total)}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">This Month</p>
                  <TrendingUp size={20} className="text-sky-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-sky-700">
                  {formatCurrency(revenueData.thisMonth)}
                </p>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <ArrowUpRight size={14} className="text-emerald-600" />
                  <span className="text-emerald-600 font-medium">
                    {revenueData.growth}%
                  </span>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <Clock size={20} className="text-amber-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-700">
                  {formatCurrency(revenueData.pending)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Awaiting collection
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">Avg. per Student</p>
                  <ArrowUpRight size={20} className="text-indigo-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-700">
                  {formatCurrency(Math.round(revenueData.total / 50))}{" "}
                  {/* dummy calc */}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on all applications
                </p>
              </motion.div>
            </div>

            {/* Filters */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex flex-wrap gap-2">
                {["This Month", "This Year", "All Time"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${
                        timeRange === range
                          ? "bg-sky-600 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {range}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Revenue Chart – Chart.js integrated */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Revenue Trend
                </h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="thisMonth">Monthly</option>
                  <option value="thisYear">Yearly</option>
                  <option value="allTime">All Time</option>
                </select>
              </div>

              <div className="h-64 sm:h-80">
                <canvas ref={chartRef}></canvas>
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Recent Transactions
                </h3>
                <button className="text-sky-600 hover:text-sky-800 text-sm font-medium flex items-center gap-1">
                  View All <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          ID
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Student
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                          Type
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Counselor
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {revenueData.transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">
                            {tx.id}
                          </td>
                          <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">
                            {tx.student}
                          </td>
                          <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">
                            {tx.type}
                          </td>
                          <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">
                            {tx.counselor}
                          </td>
                          <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-bold text-emerald-700">
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-gray-600">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 sm:px-6">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                tx.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
