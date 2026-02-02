// app/admin/reports/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import { TrendingUp, Users, FileCheck, Globe, DollarSign, BarChart3 } from "lucide-react";
import Chart from "chart.js/auto";

// Animation variants (assuming this path is correct)
import { containerVariants, itemVariants } from "@/components/Animations/formanimations/animate";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);

  // Canvas refs
  const revenueChartRef = useRef(null);
  const counselorChartRef = useRef(null);
  const statusChartRef = useRef(null);
  const countryChartRef = useRef(null);

  // Chart instances (for destroy)
  const revenueChartInstance = useRef(null);
  const counselorChartInstance = useRef(null);
  const statusChartInstance = useRef(null);
  const countryChartInstance = useRef(null);

  // Mock data — moved here so it's available in render + effects
  const mockData = {
    kpis: {
      totalStudents: 487,
      totalApplications: 359,
      visaSuccessRate: "91.8%",
      totalRevenue: 1850000,
      conversionRate: "76.4%",
      avgProcessingTime: "38 days",
    },
    monthlyTrend: [
      { month: "Jan", applications: 52, revenue: 210000 },
      { month: "Feb", applications: 61, revenue: 245000 },
      { month: "Mar", applications: 58, revenue: 230000 },
      { month: "Apr", applications: 72, revenue: 290000 },
      { month: "May", applications: 89, revenue: 380000 },
      { month: "Jun", applications: 78, revenue: 340000 },
      { month: "Jul", applications: 95, revenue: 450000 },
      { month: "Aug", applications: 82, revenue: 410000 },
      { month: "Sep", applications: 108, revenue: 520000 },
      { month: "Oct", applications: 125, revenue: 620000 },
      { month: "Nov", applications: 112, revenue: 680000 },
      { month: "Dec", applications: 75, revenue: 340000 },
    ],
    topCounselors: [
      { name: "Sara Ahmed", revenue: 520000, applications: 108 },
      { name: "John Mathew", revenue: 480000, applications: 98 },
      { name: "Aisha Khan", revenue: 360000, applications: 82 },
      { name: "Rahul Singh", revenue: 280000, applications: 71 },
    ],
    statusBreakdown: [
      { status: "Enrolled", count: 235 },
      { status: "Offer Received", count: 78 },
      { status: "Visa Pending", count: 42 },
      { status: "Rejected", count: 18 },
    ],
    countries: [
      { country: "Canada", revenue: 680000 },
      { country: "Australia", revenue: 520000 },
      { country: "UK", revenue: 310000 },
      { country: "Germany", revenue: 180000 },
      { country: "USA", revenue: 160000 },
    ],
  };

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    // Revenue Chart
    if (revenueChartRef.current) {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      revenueChartInstance.current = new Chart(revenueChartRef.current, {
        type: "line",
        data: {
          labels: mockData.monthlyTrend.map(d => d.month),
          datasets: [
            {
              label: "Revenue (₹)",
              data: mockData.monthlyTrend.map(d => d.revenue),
              borderColor: "#0ea5e9",
              backgroundColor: "rgba(14, 165, 233, 0.12)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#0ea5e9",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 5,
            },
            {
              label: "Applications",
              data: mockData.monthlyTrend.map(d => d.applications),
              borderColor: "#8b5cf6",
              backgroundColor: "rgba(139, 92, 246, 0.12)",
              tension: 0.4,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "top" } },
          scales: {
            y: { beginAtZero: true, position: "left" },
            y1: { beginAtZero: true, position: "right", grid: { drawOnChartArea: false } },
          },
        },
      });
    }

    // Top Counselors Chart
    if (counselorChartRef.current) {
      if (counselorChartInstance.current) {
        counselorChartInstance.current.destroy();
      }
      counselorChartInstance.current = new Chart(counselorChartRef.current, {
        type: "bar",
        data: {
          labels: mockData.topCounselors.map(c => c.name),
          datasets: [{
            label: "Revenue",
            data: mockData.topCounselors.map(c => c.revenue),
            backgroundColor: "#0ea5e9",
            borderRadius: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }

    // Status Breakdown Chart
    if (statusChartRef.current) {
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy();
      }
      statusChartInstance.current = new Chart(statusChartRef.current, {
        type: "doughnut",
        data: {
          labels: mockData.statusBreakdown.map(s => s.status),
          datasets: [{
            data: mockData.statusBreakdown.map(s => s.count),
            backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
            borderWidth: 2,
            borderColor: "#fff",
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
          cutout: "65%",
        },
      });
    }

    // Revenue by Country Chart
    if (countryChartRef.current) {
      if (countryChartInstance.current) {
        countryChartInstance.current.destroy();
      }
      countryChartInstance.current = new Chart(countryChartRef.current, {
        type: "bar",
        data: {
          labels: mockData.countries.map(c => c.country),
          datasets: [{
            label: "Revenue",
            data: mockData.countries.map(c => c.revenue),
            backgroundColor: "#0ea5e9",
            borderRadius: 6,
          }],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true } },
        },
      });
    }

    // Cleanup function (runs on unmount + before next effect run)
    return () => {
      [
        revenueChartInstance,
        counselorChartInstance,
        statusChartInstance,
        countryChartInstance,
      ].forEach((ref) => {
        if (ref.current) {
          ref.current.destroy();
          ref.current = null;
        }
      });
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Generating reports...</p>
        </motion.div>
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Reports & Analytics" counselorName="Imran" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-7xl mx-auto">
            {/* KPI Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-sky-600" size={20} />
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockData.kpis.totalStudents}</p>
              </div>
              <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="text-emerald-600" size={20} />
                  <p className="text-sm text-gray-600">Applications</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockData.kpis.totalApplications}</p>
              </div>
              <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="text-indigo-600" size={20} />
                  <p className="text-sm text-gray-600">Visa Success</p>
                </div>
                <p className="text-2xl font-bold text-emerald-600">{mockData.kpis.visaSuccessRate}</p>
              </div>
              <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-teal-600" size={20} />
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockData.kpis.totalRevenue)}</p>
              </div>
              <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-purple-600" size={20} />
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
                <p className="text-2xl font-bold text-purple-600">{mockData.kpis.conversionRate}</p>
              </div>
              <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="text-amber-600" size={20} />
                  <p className="text-sm text-gray-600">Avg. Processing</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockData.kpis.avgProcessingTime}</p>
              </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <motion.div variants={itemVariants} className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-sky-600" /> Revenue & Applications Trend
                </h3>
                <div className="h-64 sm:h-80">
                  <canvas ref={revenueChartRef} id="revenueChart"></canvas>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-indigo-600" /> Top Counselors by Revenue
                </h3>
                <div className="h-64 sm:h-80">
                  <canvas ref={counselorChartRef} id="counselorChart"></canvas>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileCheck size={20} className="text-emerald-600" /> Application Status
                </h3>
                <div className="h-64 sm:h-80 flex items-center justify-center">
                  <canvas ref={statusChartRef} id="statusChart"></canvas>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe size={20} className="text-teal-600" /> Revenue by Country
                </h3>
                <div className="h-64 sm:h-80">
                  <canvas ref={countryChartRef} id="countryChart"></canvas>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}