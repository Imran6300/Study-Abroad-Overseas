// app/admin/logs/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import { useSelector } from "react-redux";
import {
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
} from "lucide-react";

// Animation variants (consistent with your other pages)
import {
  containerVariants,
  itemVariants,
} from "@/components/Animations/formanimations/animate";

export default function LogsPage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [logTypeFilter, setLogTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

  useEffect(() => {
    // Dummy logs data — replace with real API later
    const mockLogs = Array.from({ length: 85 }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(
        Date.now() - Math.random() * 10000000000,
      ).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      level: ["INFO", "SUCCESS", "WARNING", "ERROR"][
        Math.floor(Math.random() * 4)
      ],
      user: ["Imran", "Sara", "John", "Aisha", "System"][
        Math.floor(Math.random() * 5)
      ],
      action: [
        "User login",
        "Student profile updated",
        "Application status changed to Visa Pending",
        "New university added",
        "Payment recorded",
        "Visa approved notification sent",
        "Failed login attempt",
        "Counselor assigned",
        "Document uploaded",
        "Report generated",
      ][Math.floor(Math.random() * 10)],
      message: [
        "Successful login from Hyderabad",
        "Student Priya Sharma updated passport details",
        "Application APP-042 moved to Visa Pending",
        "Added University of Alberta to database",
        "Received ₹45,000 via Razorpay",
        "Visa approval email sent to Ahmed Khan",
        "Invalid credentials from IP 192.168.1.5",
        "Assigned Sara Ahmed to student Rahul Verma",
        "Offer letter uploaded successfully",
        "Monthly revenue report exported",
      ][Math.floor(Math.random() * 10)],
    }));

    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 800);
  }, []);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      logTypeFilter === "all" ||
      log.level.toLowerCase() === logTypeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + logsPerPage,
  );

  const getLevelBadge = (level) => {
    const colors = {
      success: "bg-green-100 text-green-800",
      info: "bg-blue-100 text-blue-800",
      warning: "bg-amber-100 text-amber-800",
      error: "bg-red-100 text-red-800",
    };

    const icons = {
      success: <CheckCircle2 size={14} />,
      info: <Info size={14} />,
      warning: <AlertCircle size={14} />,
      error: <XCircle size={14} />,
    };

    const key = level.toLowerCase();

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          colors[key] || "bg-gray-100 text-gray-800"
        }`}
      >
        {icons[key] || null}
        {level}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Loading system logs...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="System Logs & Audit"
          counselorName={CounselorName}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-7xl mx-auto"
          >
            {/* Filters */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search logs by message, user or action..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Success", "Info", "Warning", "Error"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setLogTypeFilter(
                        type.toLowerCase() === "all"
                          ? "all"
                          : type.toLowerCase(),
                      );
                      setCurrentPage(1);
                    }}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${
                        logTypeFilter ===
                        (type.toLowerCase() === "all"
                          ? "all"
                          : type.toLowerCase())
                          ? "bg-sky-600 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Logs Table */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Level
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        User
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Action
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          {getLevelBadge(log.level)}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                          {log.user}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-gray-600">
                          {log.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 sm:px-6 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1}–
                    {Math.min(startIndex + logsPerPage, filteredLogs.length)} of{" "}
                    {filteredLogs.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {filteredLogs.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-center py-16 text-gray-500"
              >
                <p className="text-lg">No logs found matching your filters.</p>
                <p className="text-sm mt-2">
                  Try clearing search or changing log type filter.
                </p>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
