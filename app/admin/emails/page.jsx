// app/admin/emails/page.jsx — Superadmin Email Tracking + Compose
// Fetches from GET /api/admin/emails, /api/admin/emails/stats,
// /api/admin/emails/recipients, and sends via POST /api/admin/emails/send
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import { useSelector } from "react-redux";
import {
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Mail,
  Send,
  X,
  Loader2,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const LIMIT = 20;

const STATUS_CFG = {
  sent: {
    label: "SENT",
    cls: "bg-green-100 text-green-800",
    icon: <CheckCircle2 size={13} />,
  },
  failed: {
    label: "FAILED",
    cls: "bg-red-100 text-red-800",
    icon: <XCircle size={13} />,
  },
};

const CATEGORY_LABELS = {
  otp: "OTP",
  password_reset: "Password Reset",
  counselor_activation: "Counselor Activation",
  khizar_status_update: "Application Update",
  deadline_created: "Deadline Created",
  deadline_reminder: "Deadline Reminder",
  partner_application_received: "Partner Application",
  partner_admin_notification: "Partner Admin Notice",
  partner_approved: "Partner Approved",
  partner_rejected: "Partner Rejected",
  partner_cancelled: "Partner Cancelled",
  partner_suspended: "Partner Suspended",
  partner_welcome: "Partner Welcome",
  org_counselor_suspended: "Counselor Suspended",
  org_counselor_removed: "Counselor Removed",
  manual: "Manual",
  other: "Other",
};

const RECIPIENT_TYPE_LABELS = {
  user: "User",
  counselor: "Counselor",
  org_admin: "Org Admin",
  partner: "Partner",
  admin: "Admin",
  other: "Other",
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.sent;
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

/* ─────────────────────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────────────────────── */
function StatCard({ label, value, accent }) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5"
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-1 ${accent || "text-gray-900"}`}>
        {value}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COMPOSE MODAL
───────────────────────────────────────────────────────────── */
function ComposeModal({ onClose, onSent }) {
  const [to, setTo] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientType, setRecipientType] = useState("other");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimer = useRef(null);

  const handleToChange = (val) => {
    setTo(val);
    setShowSuggestions(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      if (val.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `${BASE}/api/admin/emails/recipients?q=${encodeURIComponent(val.trim())}`,
          { credentials: "include" },
        );
        const data = await res.json();
        setSuggestions(data.recipients || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const pickSuggestion = (r) => {
    setTo(r.email);
    setRecipientName(r.name || "");
    setRecipientType(r.type || "other");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");

    if (!to.trim() || !subject.trim() || !message.trim()) {
      setError("Recipient, subject and message are all required.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/admin/emails/send`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.trim(),
          recipientName: recipientName.trim(),
          recipientType,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send email");
      }
      onSent?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Send size={18} className="text-sky-600" />
            Compose Email
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSend} className="px-6 py-5 space-y-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              To
            </label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => handleToChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search a user/partner or type an email"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                {suggestions.map((r, i) => (
                  <button
                    type="button"
                    key={`${r.email}-${i}`}
                    onClick={() => pickSuggestion(r)}
                    className="w-full text-left px-3.5 py-2 hover:bg-sky-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {r.name || r.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.email} · {RECIPIENT_TYPE_LABELS[r.type] || r.type}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Recipient name (optional)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Full name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Recipient type
              </label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
              >
                {Object.entries(RECIPIENT_TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Message
            </label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message... (paragraphs separated by a blank line)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Sent using the standard Khizar Overseas branded template.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function EmailsPage() {
  const { user } = useSelector((state) => state.auth);
  const adminName = user?.name;

  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchDebounce = useRef(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/emails/stats`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error("[EmailsPage] stats:", err);
    }
  }, []);

  const fetchLogs = useCallback(
    async (page = 1, sts = "all", cat = "all", q = "", silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const params = new URLSearchParams({ page, limit: LIMIT });
        if (sts !== "all") params.set("status", sts);
        if (cat !== "all") params.set("category", cat);
        if (q.trim()) params.set("search", q.trim());

        const res = await fetch(
          `${BASE}/api/admin/emails?${params.toString()}`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("Failed to fetch email logs");
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } catch (err) {
        console.error("[EmailsPage]", err);
        setLogs([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchLogs(1, "all", "all", "");
    fetchStats();
  }, [fetchLogs, fetchStats]);

  const handleStatusChange = (s) => {
    setStatus(s);
    setCurrentPage(1);
    fetchLogs(1, s, category, search);
  };

  const handleCategoryChange = (c) => {
    setCategory(c);
    setCurrentPage(1);
    fetchLogs(1, status, c, search);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setCurrentPage(1);
      fetchLogs(1, status, category, val);
    }, 400);
  };

  const handlePageChange = (p) => {
    setCurrentPage(p);
    fetchLogs(p, status, category, search, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    fetchLogs(currentPage, status, category, search, true);
    fetchStats();
  };

  const handleEmailSent = () => {
    handleStatusChange("all");
    fetchStats();
  };

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
          <p className="text-lg text-gray-600">Loading email records...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Email Tracking"
          counselorName={adminName}
          btnName="+ Compose Email"
          onButtonClick={() => setShowCompose(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-7xl mx-auto"
          >
            {/* KPI cards */}
            {stats && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <StatCard label="Total Emails" value={stats.total} />
                <StatCard
                  label="Sent"
                  value={stats.sent}
                  accent="text-green-600"
                />
                <StatCard
                  label="Failed"
                  value={stats.failed}
                  accent="text-red-600"
                />
                <StatCard
                  label="Last 24h"
                  value={stats.last24h}
                  accent="text-sky-600"
                />
              </motion.div>
            )}

            {/* Filters row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search recipient, name, subject..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["all", "sent", "failed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                      status === s
                        ? "bg-sky-600 text-white shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {s === "all" ? "All" : STATUS_CFG[s]?.label || s}
                  </button>
                ))}

                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">All categories</option>
                  {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                  title="Refresh"
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
                  {total.toLocaleString("en-IN")} total email
                  {total !== 1 ? "s" : ""} — showing {startIndex}–{endIndex}
                </p>
              </motion.div>
            )}

            {/* Table */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {logs.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Mail size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-base font-medium">No emails found</p>
                  <p className="text-sm mt-1">
                    {search
                      ? "Try clearing the search."
                      : status !== "all" || category !== "all"
                        ? "No emails match these filters."
                        : "No emails have been sent yet."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Sent At",
                          "Recipient",
                          "Type",
                          "Subject",
                          "Category",
                          "Status",
                          "Sent By",
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
                      {logs.map((log) => (
                        <tr
                          key={log._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 sm:px-6 text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-4 py-3 sm:px-6">
                            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                              {log.recipientName || "—"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {log.recipientEmail}
                            </p>
                          </td>
                          <td className="px-4 py-3 sm:px-6">
                            <span className="text-xs font-medium text-gray-600 capitalize">
                              {RECIPIENT_TYPE_LABELS[log.recipientType] ||
                                log.recipientType}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-6 text-sm text-gray-600 max-w-xs truncate">
                            {log.subject || "—"}
                          </td>
                          <td className="px-4 py-3 sm:px-6">
                            <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded whitespace-nowrap">
                              {CATEGORY_LABELS[log.category] || log.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-6">
                            <StatusBadge status={log.status} />
                            {log.status === "failed" && log.errorMessage && (
                              <p className="text-xs text-red-400 mt-1 max-w-[160px] truncate">
                                {log.errorMessage}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 sm:px-6 text-xs text-gray-500 whitespace-nowrap">
                            {log.sentBy?.name || "System"}
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

      <AnimatePresence>
        {showCompose && (
          <ComposeModal
            onClose={() => setShowCompose(false)}
            onSent={handleEmailSent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
