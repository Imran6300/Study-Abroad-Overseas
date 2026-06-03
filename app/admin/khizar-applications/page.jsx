"use client";

/**
 * /app/admin/khizar-applications/page.jsx
 *
 * Admin-side management page for Khizar-managed student applications.
 *
 * Features:
 *  - Stat cards (total, offers, visa processing, enrolled)
 *  - Paginated, searchable, filterable table
 *  - Full-detail slide-over panel with student info, academic, test
 *    scores, preferences, counselor data, and documents
 *  - Status update modal (admin only) — triggers email + notifications
 *    to counselor + student via the backend controller
 *  - Soft delete with confirmation
 *  - Inline toast notifications
 *  - Matches the existing admin color palette exactly
 *    (bg-gray-50 page, bg-white cards, sky/indigo/emerald/amber/red
 *     accent system, slate text hierarchy)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  GraduationCap,
  Globe,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  Briefcase,
  DollarSign,
  StickyNote,
  History,
  Building2,
  MapPin,
  TrendingUp,
  Users,
  Loader2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import ConfirmationModal from "@/components/adminform/confirmmsg";
import {
  containerVariants,
  itemVariants,
} from "@/components/Animations/formanimations/animate";

// ─── Constants ────────────────────────────────────────────────────────────────

const KHIZAR_STATUSES = [
  "documents_reviewing",
  "applied",
  "offer_received",
  "visa_processing",
  "visa_approved",
  "enrolled",
  "rejected",
  "on_hold",
  "withdrawn",
];

const STATUS_CONFIG = {
  documents_reviewing: {
    label: "Documents Reviewing",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: FileText,
  },
  applied: {
    label: "Applied",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
    icon: CheckCircle,
  },
  offer_received: {
    label: "Offer Received",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: Award,
  },
  visa_processing: {
    label: "Visa Processing",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
    icon: Globe,
  },
  visa_approved: {
    label: "Visa Approved",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
    icon: CheckCircle,
  },
  enrolled: {
    label: "Enrolled",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    icon: GraduationCap,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: X,
  },
  on_hold: {
    label: "On Hold",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
    icon: Clock,
  },
  withdrawn: {
    label: "Withdrawn",
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
    dot: "bg-gray-400",
    icon: X,
  },
};

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Animation variants ──────────────────────────────────────────────────────

const slideOverVariants = {
  hidden: { opacity: 0, x: "100%" },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 280, damping: 32 },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const toastVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
  exit: { opacity: 0, y: 8, scale: 0.95, transition: { duration: 0.18 } },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };
  const padding = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color, loading }) {
  const colorMap = {
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: "text-amber-500",
      border: "border-amber-100",
    },
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      icon: "text-sky-500",
      border: "border-sky-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      icon: "text-emerald-500",
      border: "border-emerald-100",
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      icon: "text-violet-500",
      border: "border-violet-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      icon: "text-green-500",
      border: "border-green-100",
    },
  };
  const c = colorMap[color] || colorMap.sky;
  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white rounded-2xl border ${c.border} p-5 sm:p-6 shadow-sm flex items-center gap-4`}
    >
      <div className={`${c.bg} p-3 rounded-xl flex-shrink-0`}>
        <Icon size={20} className={c.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
        {loading ? (
          <div className="h-8 w-12 bg-gray-100 animate-pulse rounded mt-1" />
        ) : (
          <h2
            className={`text-2xl sm:text-3xl font-bold ${c.text} mt-0.5 leading-none`}
          >
            {value ?? 0}
          </h2>
        )}
      </div>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-sky-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, accent = "sky" }) {
  const accents = {
    sky: "text-sky-600 bg-sky-50",
    emerald: "text-emerald-600 bg-emerald-50",
    violet: "text-violet-600 bg-violet-50",
    amber: "text-amber-600 bg-amber-50",
    indigo: "text-indigo-600 bg-indigo-50",
    slate: "text-slate-600 bg-slate-50",
  };
  const cls = accents[accent] || accents.sky;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${cls}`}
        >
          <Icon size={14} />
        </div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function DocumentItem({ doc, applicationId, index, onView }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
          <FileText size={14} className="text-sky-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {doc.fileName || "Document"}
          </p>
          <p className="text-xs text-gray-400 capitalize">{doc.type}</p>
        </div>
      </div>
      <button
        onClick={() => onView(applicationId, index)}
        className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0 ml-3"
      >
        <Eye size={12} /> View
      </button>
    </div>
  );
}

function Toast({ toast }) {
  const typeMap = {
    success: "bg-emerald-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-sky-600 text-white",
  };
  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl font-medium text-sm ${typeMap[toast.type] || typeMap.info}`}
    >
      {toast.type === "success" && <CheckCircle size={16} />}
      {toast.type === "error" && <AlertTriangle size={16} />}
      {toast.type === "info" && <Clock size={16} />}
      {toast.message}
    </motion.div>
  );
}

// ─── Status Update Modal ──────────────────────────────────────────────────────

function StatusUpdateModal({ application, onClose, onSuccess, showToast }) {
  const [status, setStatus] = useState(application.status);
  const [note, setNote] = useState("");
  const [internalNote, setInternalNote] = useState(
    application.internalNote || "",
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === application.status && !note && !internalNote) {
      showToast("No changes to save.", "info");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(
        `${API}/api/khizar-applications/${application._id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, note, internalNote }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      showToast(
        `Status updated to "${STATUS_CONFIG[status]?.label || status}"`,
        "success",
      );
      onSuccess(data.data);
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Update Status</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {application.studentInfo?.studentName} →{" "}
                {application.universityName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Current */}
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                Current:
              </span>
              <StatusBadge status={application.status} />
            </div>

            {/* New Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                New Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                >
                  {KHIZAR_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s]?.label || s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {/* Preview badge */}
              {status !== application.status && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Preview:</span>
                  <StatusBadge status={status} />
                </div>
              )}
            </div>

            {/* Counselor Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Note to Counselor
                <span className="ml-1 text-gray-400 font-normal normal-case">
                  (visible to counselor & student)
                </span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. Offer letter received. Please check your email."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Internal Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Internal Note
                <span className="ml-1 text-gray-400 font-normal normal-case">
                  (admin only — never shown to counselor)
                </span>
              </label>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={2}
                placeholder="Internal team notes..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-amber-50/30 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle size={14} />
                )}
                {saving ? "Updating..." : "Update Status"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

// ─── Detail Slide-Over ────────────────────────────────────────────────────────

function ApplicationDetailPanel({
  application,
  onClose,
  onStatusUpdate,
  onDelete,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentApp, setCurrentApp] = useState(application);

  const tabs = [
    { key: "overview", label: "Overview", icon: User },
    { key: "academic", label: "Academic", icon: GraduationCap },
    { key: "preferences", label: "Preferences", icon: Globe },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "history", label: "History", icon: History },
  ];

  const handleViewDocument = async (appId, index) => {
    try {
      const res = await fetch(
        `${API}/api/khizar-applications/${appId}/document/${index}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (data.success && data.url) {
        window.open(data.url, "_blank");
      } else {
        showToast("Could not load document URL.", "error");
      }
    } catch {
      showToast("Failed to fetch document.", "error");
    }
  };

  const handleStatusSuccess = (updated) => {
    setCurrentApp(updated);
    setShowStatusModal(false);
    onStatusUpdate(updated);
  };

  const app = currentApp;
  const counselorInitials = initials(app.counselor?.name || "KO");
  const studentInitials = initials(
    app.studentInfo?.studentName || app.student?.name || "S",
  );

  const avatarColors = [
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
  ];
  const counselorColor =
    avatarColors[(app.counselor?.name?.length || 0) % avatarColors.length];

  return (
    <>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <motion.div
        variants={slideOverVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gray-50 z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {app.studentInfo?.studentName ||
                    app.student?.name ||
                    "Student"}
                </h2>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {app.universityName} · {app.country}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Submitted {fmt(app.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowStatusModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <TrendingUp size={12} />
                Update Status
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <>
              {/* Counselor + Student cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Counselor */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Counselor
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${counselorColor}`}
                    >
                      {counselorInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {app.counselor?.name || "—"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {app.counselor?.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Student
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {studentInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {app.studentInfo?.studentName || "—"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {app.studentInfo?.email || app.student?.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application info */}
              <SectionCard
                title="Application Details"
                icon={Building2}
                accent="sky"
              >
                <InfoRow
                  icon={Building2}
                  label="University"
                  value={app.universityName}
                />
                <InfoRow icon={Globe} label="Country" value={app.country} />
                <InfoRow icon={BookOpen} label="Course" value={app.course} />
                <InfoRow icon={Calendar} label="Intake" value={app.intake} />
                <InfoRow
                  icon={GraduationCap}
                  label="Study Level"
                  value={app.studyLevel}
                />
              </SectionCard>

              {/* Student personal info */}
              <SectionCard
                title="Student Information"
                icon={User}
                accent="indigo"
              >
                <InfoRow
                  icon={User}
                  label="Full Name"
                  value={app.studentInfo?.studentName}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={app.studentInfo?.email}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={app.studentInfo?.phone}
                />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={app.studentInfo?.dob}
                />
                <InfoRow
                  icon={User}
                  label="Gender"
                  value={app.studentInfo?.gender}
                />
                <InfoRow
                  icon={Globe}
                  label="Nationality"
                  value={app.studentInfo?.nationality}
                />
                <InfoRow
                  icon={FileText}
                  label="Passport No."
                  value={app.studentInfo?.passportNo}
                />
                <InfoRow
                  icon={MapPin}
                  label="Current City"
                  value={app.studentInfo?.currentCity}
                />
              </SectionCard>

              {/* Counselor notes */}
              {(app.counselorData?.counselorNotes ||
                app.counselorData?.remarks ||
                app.counselorNotes) && (
                <SectionCard
                  title="Counselor Notes"
                  icon={StickyNote}
                  accent="amber"
                >
                  {app.counselorNotes && (
                    <InfoRow
                      icon={StickyNote}
                      label="General Notes"
                      value={app.counselorNotes}
                    />
                  )}
                  {app.counselorData?.counselorNotes && (
                    <InfoRow
                      icon={StickyNote}
                      label="Counselor Assessment"
                      value={app.counselorData.counselorNotes}
                    />
                  )}
                  {app.counselorData?.studentWeaknesses && (
                    <InfoRow
                      icon={AlertTriangle}
                      label="Student Weaknesses"
                      value={app.counselorData.studentWeaknesses}
                    />
                  )}
                  {app.counselorData?.visaHistory && (
                    <InfoRow
                      icon={Globe}
                      label="Visa History"
                      value={app.counselorData.visaHistory}
                    />
                  )}
                  {app.counselorData?.remarks && (
                    <InfoRow
                      icon={FileText}
                      label="Remarks"
                      value={app.counselorData.remarks}
                    />
                  )}
                </SectionCard>
              )}

              {/* Internal Note (admin-only) */}
              {app.internalNote && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                      <StickyNote size={12} className="text-amber-600" />
                    </div>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                      Internal Note (Admin Only)
                    </p>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {app.internalNote}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── ACADEMIC ── */}
          {activeTab === "academic" && (
            <>
              <SectionCard
                title="Academic Background"
                icon={GraduationCap}
                accent="emerald"
              >
                <InfoRow
                  icon={Award}
                  label="Qualification"
                  value={app.academicInfo?.qualification}
                />
                <InfoRow
                  icon={Building2}
                  label="Institution"
                  value={app.academicInfo?.institution}
                />
                <InfoRow
                  icon={Calendar}
                  label="Graduation Year"
                  value={app.academicInfo?.graduationYear}
                />
                <InfoRow
                  icon={Award}
                  label="CGPA / Percentage"
                  value={app.academicInfo?.cgpa}
                />
                <InfoRow
                  icon={AlertTriangle}
                  label="Backlogs"
                  value={app.academicInfo?.backlogs}
                />
                <InfoRow
                  icon={Clock}
                  label="Education Gap"
                  value={app.academicInfo?.educationGap}
                />
              </SectionCard>

              <SectionCard title="Test Scores" icon={BookOpen} accent="violet">
                {app.testScores?.ielts && (
                  <InfoRow
                    icon={Award}
                    label="IELTS"
                    value={app.testScores.ielts}
                  />
                )}
                {app.testScores?.toefl && (
                  <InfoRow
                    icon={Award}
                    label="TOEFL"
                    value={app.testScores.toefl}
                  />
                )}
                {app.testScores?.pte && (
                  <InfoRow
                    icon={Award}
                    label="PTE"
                    value={app.testScores.pte}
                  />
                )}
                {app.testScores?.duolingo && (
                  <InfoRow
                    icon={Award}
                    label="Duolingo"
                    value={app.testScores.duolingo}
                  />
                )}
                {app.testScores?.gre && (
                  <InfoRow
                    icon={Award}
                    label="GRE"
                    value={app.testScores.gre}
                  />
                )}
                {app.testScores?.gmat && (
                  <InfoRow
                    icon={Award}
                    label="GMAT"
                    value={app.testScores.gmat}
                  />
                )}
                {Object.values(app.testScores || {}).every((v) => !v) && (
                  <p className="text-sm text-gray-400 text-center py-2">
                    No test scores provided
                  </p>
                )}
              </SectionCard>
            </>
          )}

          {/* ── PREFERENCES ── */}
          {activeTab === "preferences" && (
            <>
              <SectionCard title="Study Preferences" icon={Globe} accent="sky">
                <InfoRow
                  icon={Globe}
                  label="Preferred Country"
                  value={app.preferences?.preferredCountry}
                />
                <InfoRow
                  icon={Building2}
                  label="Preferred Universities"
                  value={app.preferences?.preferredUniversities}
                />
                <InfoRow
                  icon={BookOpen}
                  label="Preferred Course"
                  value={app.preferences?.preferredCourse}
                />
                <InfoRow
                  icon={Calendar}
                  label="Preferred Intake"
                  value={app.preferences?.preferredIntake}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Education Level"
                  value={app.preferences?.educationLevel}
                />
                <InfoRow
                  icon={DollarSign}
                  label="Budget Range"
                  value={app.preferences?.budgetRange}
                />
                <InfoRow
                  icon={Briefcase}
                  label="Loan Required"
                  value={app.preferences?.loanRequired}
                />
                <InfoRow
                  icon={Users}
                  label="Sponsor Available"
                  value={app.preferences?.sponsorAvailable}
                />
              </SectionCard>

              {(app.preferences?.serviceType || []).length > 0 && (
                <SectionCard
                  title="Service Types"
                  icon={Briefcase}
                  accent="indigo"
                >
                  <div className="flex flex-wrap gap-2 pt-1">
                    {app.preferences.serviceType.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}
            </>
          )}

          {/* ── DOCUMENTS ── */}
          {activeTab === "documents" && (
            <SectionCard
              title="Uploaded Documents"
              icon={FileText}
              accent="sky"
            >
              {(app.documents || []).length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                  No documents uploaded yet.
                </div>
              ) : (
                app.documents.map((doc, i) => (
                  <DocumentItem
                    key={i}
                    doc={doc}
                    applicationId={app._id}
                    index={i}
                    onView={handleViewDocument}
                  />
                ))
              )}
            </SectionCard>
          )}

          {/* ── HISTORY ── */}
          {activeTab === "history" && (
            <SectionCard title="Status History" icon={History} accent="slate">
              {(app.statusHistory || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No history yet.
                </p>
              ) : (
                <div className="space-y-0">
                  {[...app.statusHistory].reverse().map((entry, i) => {
                    const cfg = STATUS_CONFIG[entry.status];
                    return (
                      <div
                        key={entry._id || i}
                        className="flex gap-3 py-3 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                              i === 0
                                ? "border-sky-400 bg-sky-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${cfg?.dot || "bg-gray-400"}`}
                            />
                          </div>
                          {i < app.statusHistory.length - 1 && (
                            <div className="w-px flex-1 bg-gray-100 min-h-[16px]" />
                          )}
                        </div>
                        <div className="pb-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={entry.status} size="xs" />
                            <span className="text-xs text-gray-400">
                              {fmt(entry.updatedAt)}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-xs text-gray-600 mt-1.5 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                              {entry.note}
                            </p>
                          )}
                          <p className="text-[11px] text-gray-400 mt-1.5">
                            by{" "}
                            <span className="font-medium text-gray-500">
                              {entry.updatedBy?.name || "System"}
                            </span>{" "}
                            ({entry.updatedByRole})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-white border-t border-gray-100 px-5 py-4 flex-shrink-0 flex items-center justify-between gap-3">
          <button
            onClick={() => onDelete(app)}
            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-red-100"
          >
            <Trash2 size={13} />
            Delete Application
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center gap-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <TrendingUp size={13} />
            Update Status
          </button>
        </div>
      </motion.div>

      {/* Status modal rendered inside panel */}
      <AnimatePresence>
        {showStatusModal && (
          <StatusUpdateModal
            application={app}
            onClose={() => setShowStatusModal(false)}
            onSuccess={handleStatusSuccess}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminKhizarApplicationsPage() {
  const { user } = useSelector((state) => state.auth);
  const adminName = user?.name || "Admin";

  // ── Data state ──
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── UI state ──
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  const [selectedApp, setSelectedApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // ── Toast helper ──
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch stats ──
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetch(`${API}/api/khizar-applications/stats`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error("Stats fetch failed:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Fetch applications ──
  const fetchApplications = useCallback(
    async (currentPage = 1, searchTerm = "", status = "") => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage,
          limit: LIMIT,
        });
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (status) params.set("status", status);

        const res = await fetch(
          `${API}/api/khizar-applications?${params.toString()}`,
          { credentials: "include" },
        );
        const data = await res.json();
        if (data.success) {
          setApplications(data.data || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotal(data.pagination?.total || 0);
        }
      } catch (err) {
        console.error("Applications fetch failed:", err);
        showToast("Failed to load applications.", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  // ── Initial load ──
  useEffect(() => {
    fetchStats();
    fetchApplications(1, "", "");
  }, [fetchStats, fetchApplications]);

  // ── Debounced search ──
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchApplications(1, val, statusFilter);
    }, 350);
  };

  const handleStatusFilterChange = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    setPage(1);
    fetchApplications(1, search, val);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchApplications(newPage, search, statusFilter);
  };

  // ── Status update callback ──
  const handleStatusUpdated = useCallback(
    (updated) => {
      setApplications((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a)),
      );
      // Also update the open detail panel
      setSelectedApp((prev) => (prev?._id === updated._id ? updated : prev));
      fetchStats();
    },
    [fetchStats],
  );

  // ── Delete ──
  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(
        `${API}/api/khizar-applications/${deleteTarget._id}`,
        { method: "DELETE", credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      showToast("Application deleted successfully.", "success");
      setDeleteTarget(null);
      setSelectedApp(null);
      await Promise.all([
        fetchApplications(page, search, statusFilter),
        fetchStats(),
      ]);
    } catch (err) {
      showToast(err.message || "Failed to delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteConfirm = (app) => {
    setDeleteTarget(app);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Khizar Applications"
          counselorName={adminName}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* ── Stat Cards ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7"
          >
            <StatCard
              label="Total Applications"
              value={stats?.total}
              icon={FileText}
              color="sky"
              loading={statsLoading}
            />
            <StatCard
              label="Offers Received"
              value={stats?.offersReceived}
              icon={Award}
              color="emerald"
              loading={statsLoading}
            />
            <StatCard
              label="Visa Processing"
              value={stats?.visaProcessing}
              icon={Globe}
              color="violet"
              loading={statsLoading}
            />
            <StatCard
              label="Enrolled"
              value={stats?.enrolled}
              icon={GraduationCap}
              color="green"
              loading={statsLoading}
            />
          </motion.div>

          {/* ── Filters ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-5"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search by student, university, course, country..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <Filter
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="pl-8 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all appearance-none min-w-[180px]"
                >
                  <option value="">All Statuses</option>
                  {KHIZAR_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s]?.label || s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Refresh */}
              <button
                onClick={() => {
                  fetchApplications(page, search, statusFilter);
                  fetchStats();
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                <RefreshCw size={14} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </motion.div>

          {/* ── Table ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Table header row with count */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-800">
                  Applications
                </h2>
                {!loading && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {total}
                  </span>
                )}
              </div>
              {loading && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Loader2 size={12} className="animate-spin" />
                  Loading...
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              {loading && applications.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  <Loader2 size={24} className="animate-spin mr-3" />
                  <span className="text-sm">Loading applications...</span>
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <FileText size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600">
                    No applications found
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {search || statusFilter
                      ? "Try adjusting your search or filter."
                      : "No Khizar-managed applications yet."}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Student
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                        University
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                        Counselor
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                        Course / Intake
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                        Submitted
                      </th>
                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map((app) => {
                      const studentName =
                        app.studentInfo?.studentName ||
                        app.student?.name ||
                        "Unknown";
                      const studentEmail =
                        app.studentInfo?.email || app.student?.email || "";
                      const counselorName = app.counselor?.name || "—";
                      const ini = initials(studentName);
                      const avatarColors = [
                        "bg-sky-100 text-sky-700",
                        "bg-violet-100 text-violet-700",
                        "bg-emerald-100 text-emerald-700",
                        "bg-amber-100 text-amber-700",
                        "bg-rose-100 text-rose-700",
                      ];
                      const avatarColor =
                        avatarColors[studentName.length % avatarColors.length];

                      return (
                        <motion.tr
                          key={app._id}
                          variants={itemVariants}
                          className="hover:bg-gray-50/70 transition-colors group cursor-pointer"
                          onClick={() => setSelectedApp(app)}
                        >
                          {/* Student */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor}`}
                              >
                                {ini}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {studentName}
                                </p>
                                <p className="text-xs text-gray-400 truncate hidden sm:block">
                                  {studentEmail}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* University */}
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                              {app.universityName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {app.country}
                            </p>
                          </td>

                          {/* Counselor */}
                          <td className="px-5 py-4 hidden md:table-cell">
                            <p className="text-sm text-gray-700 truncate max-w-[140px]">
                              {counselorName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {app.counselor?.email || ""}
                            </p>
                          </td>

                          {/* Course / Intake */}
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-sm text-gray-700 truncate max-w-[150px]">
                              {app.course}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {app.intake} · {app.studyLevel}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <StatusBadge status={app.status} />
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4 hidden xl:table-cell">
                            <p className="text-xs text-gray-500 whitespace-nowrap">
                              {fmt(app.createdAt)}
                            </p>
                          </td>

                          {/* Actions */}
                          <td
                            className="px-5 py-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg transition-colors"
                              >
                                <Eye size={12} />
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() => openDeleteConfirm(app)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                              >
                                <Trash2 size={12} />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                <p className="text-xs text-gray-500">
                  Page {page} of {totalPages} · {total} results
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p;
                    if (totalPages <= 5) {
                      p = i + 1;
                    } else if (page <= 3) {
                      p = i + 1;
                    } else if (page >= totalPages - 2) {
                      p = totalPages - 4 + i;
                    } else {
                      p = page - 2 + i;
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          p === page
                            ? "bg-sky-600 text-white shadow-sm"
                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* ── Detail Slide-Over ── */}
      <AnimatePresence>
        {selectedApp && (
          <ApplicationDetailPanel
            key={selectedApp._id}
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onStatusUpdate={handleStatusUpdated}
            onDelete={openDeleteConfirm}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmationModal
            title="Delete Application"
            message={`Are you sure you want to permanently delete the application for ${
              deleteTarget.studentInfo?.studentName || "this student"
            } at ${deleteTarget.universityName}? This action cannot be undone.`}
            confirmText={deleting ? "Deleting..." : "Delete"}
            confirmVariant="danger"
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast key={toast.message} toast={toast} />}
      </AnimatePresence>
    </div>
  );
}
