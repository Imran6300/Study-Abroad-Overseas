// app/admin/logs/page.jsx — REAL DATA (no mock)
// Fetches from GET /user/activity/admin
// Supports: severity filter, search (client-side on loaded page), server-side pagination
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import { useSelector } from "react-redux";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "@/components/Animations/formanimations/animate";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const LIMIT = 20;

// Map ActivityLog severity → badge style
// Your ActivityLog model uses severity field (not "level")
// Possible values from the model: "info" | "warning" | "error" | "success"
const SEVERITY_CFG = {
  success: {
    label: "SUCCESS",
    cls: "bg-green-100 text-green-800",
    icon: <CheckCircle2 size={13} />,
  },
  info: {
    label: "INFO",
    cls: "bg-blue-100 text-blue-800",
    icon: <Info size={13} />,
  },
  warning: {
    label: "WARNING",
    cls: "bg-amber-100 text-amber-800",
    icon: <AlertCircle size={13} />,
  },
  error: {
    label: "ERROR",
    cls: "bg-red-100 text-red-800",
    icon: <XCircle size={13} />,
  },
};

function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CFG[severity?.toLowerCase()] || SEVERITY_CFG.info;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActorName(log) {
  // actor is an embedded object: { userId, name, role }
  return (
    log.actor?.name || log.counselor?.name || log.student?.name || "System"
  );
}

function getActionLabel(log) {
  // action is a string like "lead.created", "application.status_changed", etc.
  return log.action || "—";
}

function getMessageText(log) {
  return log.description || log.message || log.details || "—";
}

export default function LogsPage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;

  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters (server-side)
  const [severity, setSeverity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side search across the current page
  const [search, setSearch] = useState("");

  const fetchLogs = useCallback(
    async (page = 1, sev = "all", silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const params = new URLSearchParams({
          page,
          limit: LIMIT,
        });
        if (sev !== "all") params.set("severity", sev);

        const res = await fetch(
          `${BASE}/user/activity/admin?${params.toString()}`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } catch (err) {
        console.error("[LogsPage]", err);
        setLogs([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchLogs(1, "all");
  }, [fetchLogs]);

  const handleSeverityChange = (sev) => {
    setSeverity(sev);
    setCurrentPage(1);
    setSearch("");
    fetchLogs(1, sev);
  };

  const handlePageChange = (p) => {
    setCurrentPage(p);
    fetchLogs(p, severity, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Client-side search on the current page only
  const filtered = search.trim()
    ? logs.filter((log) => {
        const q = search.toLowerCase();
        return (
          getActionLabel(log).toLowerCase().includes(q) ||
          getMessageText(log).toLowerCase().includes(q) ||
          getActorName(log).toLowerCase().includes(q) ||
          (log.entity?.type || "").toLowerCase().includes(q)
        );
      })
    : logs;

  const startIndex = (currentPage - 1) * LIMIT + 1;
  const endIndex = Math.min(startIndex + LIMIT - 1, total);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
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
            {/* Filters row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              {/* Search (client-side on current page) */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search action, message, actor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Severity filter buttons */}
                {["all", "success", "info", "warning", "error"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => handleSeverityChange(sev)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                      severity === sev
                        ? "bg-sky-600 text-white shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {sev === "all" ? "All" : SEVERITY_CFG[sev]?.label || sev}
                  </button>
                ))}

                {/* Refresh */}
                <button
                  onClick={() => fetchLogs(currentPage, severity, true)}
                  disabled={refreshing}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                  title="Refresh logs"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </motion.div>

            {/* Summary */}
            {total > 0 && (
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-500">
                  {total.toLocaleString("en-IN")} total log
                  {total !== 1 ? "s" : ""} — showing {startIndex}–{endIndex}
                </p>
              </motion.div>
            )}

            {/* Table */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <p className="text-base font-medium">No logs found</p>
                  <p className="text-sm mt-1">
                    {search
                      ? "Try clearing the search."
                      : severity !== "all"
                        ? `No ${severity} logs on this page.`
                        : "No activity has been recorded yet."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Timestamp",
                          "Severity",
                          "Actor",
                          "Action",
                          "Details",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map((log, i) => (
                        <tr
                          key={log._id || i}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 sm:px-6 text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-4 py-3 sm:px-6">
                            <SeverityBadge severity={log.severity} />
                          </td>
                          <td className="px-4 py-3 sm:px-6">
                            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                              {getActorName(log)}
                            </p>
                            {log.actor?.role && (
                              <p className="text-xs text-gray-400 capitalize">
                                {log.actor.role}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 sm:px-6">
                            <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              {getActionLabel(log)}
                            </span>
                            {log.entity?.type && (
                              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                {log.entity.type}
                                {log.entity.name ? ` — ${log.entity.name}` : ""}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 sm:px-6 text-sm text-gray-600 max-w-xs truncate">
                            {getMessageText(log)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div className="px-4 py-3 sm:px-6 flex items-center justify-between border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {pages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || refreshing}
                      className="px-3 py-1.5 rounded-md border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pages || refreshing}
                      className="px-3 py-1.5 rounded-md border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
