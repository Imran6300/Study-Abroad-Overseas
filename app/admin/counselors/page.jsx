"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";

import axios from "axios";
import {
  X,
  Search,
  Users,
  Clock,
  TrendingUp,
  ChevronDown,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Star,
  Menu,
  Bell,
  Filter,
  MoreVertical,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import ConfirmationModal from "@/components/adminform/confirmmsg";
import { useSelector } from "react-redux";

// ─── Animation variants ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, trend }) {
  const colorMap = {
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: "text-amber-500",
      border: "border-amber-100",
    },
    green: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      icon: "text-emerald-500",
      border: "border-emerald-100",
    },
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      icon: "text-sky-500",
      border: "border-sky-100",
    },
  };
  const c = colorMap[color];

  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white rounded-2xl border ${c.border} p-5 sm:p-6 shadow-sm flex items-center gap-4 sm:gap-5`}
    >
      <div className={`${c.bg} p-3 rounded-xl flex-shrink-0`}>
        <Icon size={22} className={c.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
        <h2
          className={`text-3xl sm:text-4xl font-bold ${c.text} mt-0.5 leading-none`}
        >
          {value}
        </h2>
        {trend && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <TrendingUp size={11} />
            {trend}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",

    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",

    rejected: "bg-red-100 text-red-700 border-red-200",

    reviewing: "bg-sky-100 text-sky-700 border-sky-200",

    onboarding: "bg-violet-100 text-violet-700 border-violet-200",

    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        map[status] ?? "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

// ─── Detail Item (modal) ───────────────────────────────────────────────────────
function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3.5 sm:p-4 border border-gray-100">
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon size={13} className="text-gray-400" />}
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

// ─── Application Row (table) ──────────────────────────────────────────────────
function ApplicationRow({
  application,
  openView,
  handleApprove,
  handleReject,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.tr
      variants={itemVariants}
      className="hover:bg-gray-50/70 transition-colors group"
    >
      {/* Agency */}
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Building2 size={14} className="text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {application.agencyName}
            </p>
            <p className="text-xs text-gray-400 truncate">{application.city}</p>
          </div>
        </div>
      </td>

      {/* Owner — hidden on small screens */}
      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
        {application.fullName}
      </td>

      {/* Country — hidden on small screens */}
      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
        {application.country}
      </td>

      {/* Students/Mo — hidden on small screens */}
      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">
        {application.studentsPerMonth}
      </td>

      {/* Status */}
      <td className="px-4 sm:px-6 py-4">
        <Badge status={application.status} />
      </td>

      {/* Actions */}
      <td className="px-4 sm:px-6 py-4">
        {/* Desktop: three separate buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => openView(application)}
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Eye size={13} /> View
          </button>
          <button
            onClick={() => handleApprove(application)}
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <CheckCircle size={13} /> Approve
          </button>
          <button
            onClick={() => handleReject(application.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <XCircle size={13} /> Reject
          </button>
        </div>

        {/* Mobile: kebab menu */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-20 min-w-[140px] py-1"
              >
                <button
                  onClick={() => {
                    openView(application);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-sky-600 hover:bg-sky-50"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => {
                    handleApprove(application);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(application.id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <XCircle size={14} /> Reject
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Counselor Row (table) ────────────────────────────────────────────────────
function CounselorRow({ counselor, openView, openDeleteConfirm }) {
  const initials = counselor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarColors = [
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
  ];
  const avatarColor = avatarColors[counselor.name.length % avatarColors.length];

  return (
    <motion.tr
      variants={itemVariants}
      className="hover:bg-gray-50/70 transition-colors group"
    >
      {/* Name + Avatar */}
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl ${avatarColor} flex items-center justify-center text-sm font-bold flex-shrink-0`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {counselor.name}
            </p>
            <p className="text-xs text-gray-400 truncate hidden sm:block">
              {counselor.email}
            </p>
          </div>
        </div>
      </td>

      {/* Agency */}
      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
        {counselor.agencyName || "—"}
      </td>

      {/* Phone — hidden on small screens */}
      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
        {counselor.phone}
      </td>

      {/* Specialization — hidden on small screens */}
      <td className="px-4 sm:px-6 py-4 hidden xl:table-cell">
        <div className="flex flex-wrap gap-1">
          {(counselor.specialization || "").split(", ").map((s) => (
            <span
              key={s}
              className="text-xs bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
      </td>

      {/* Assigned */}
      <td className="px-4 sm:px-6 py-4 text-center">
        <span className="text-sm font-semibold text-gray-800">
          {counselor.assignedStudents}
        </span>
      </td>

      {/* Success Rate */}
      <td className="px-4 sm:px-6 py-4 text-center hidden sm:table-cell">
        <div className="flex items-center justify-center gap-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-emerald-700">
            {counselor.successRate}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 sm:px-6 py-4">
        <Badge status={counselor.status} />
      </td>

      {/* Actions */}
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => openView(counselor)}
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Eye size={13} />
            <span className="hidden sm:inline">View</span>
          </button>
          <button
            onClick={() => openDeleteConfirm(counselor)}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Icon size={24} className="text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">{description}</p>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, count, countColor = "text-gray-500" }) {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
      <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
      {count !== undefined && (
        <span
          className={`text-sm font-semibold ${countColor} bg-gray-100 px-2.5 py-0.5 rounded-full`}
        >
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Application Detail Modal ─────────────────────────────────────────────────
// NEW: readOnly=true is used when this is opened from the Active Partners
// table (an already-approved counselor) — the admin can always look up the
// original submission here, but Approve/Reject no longer apply since that
// decision has already been made. readOnly defaults to false so pending
// applications keep behaving exactly as before.
function ApplicationModal({
  application,
  onClose,
  onApprove,
  onReject,
  readOnly = false,
}) {
  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="bg-white w-full sm:max-w-2xl lg:max-w-3xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {readOnly ? "Partner Details" : "Partner Application"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Submitted {application.submittedAt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-7 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <DetailItem
              label="Full Name"
              value={application.fullName}
              icon={Users}
            />
            <DetailItem
              label="Agency Name"
              value={application.agencyName}
              icon={Building2}
            />
            <DetailItem label="Email" value={application.email} icon={Mail} />
            <DetailItem label="Phone" value={application.phone} icon={Phone} />
            <DetailItem
              label="Country"
              value={application.country}
              icon={Globe}
            />
            <DetailItem label="City" value={application.city} icon={MapPin} />
            <DetailItem
              label="Students / Month"
              value={application.studentsPerMonth}
              icon={Users}
            />
            <DetailItem
              label="Agency Type"
              value={application.agencyType}
              icon={Building2}
            />
            <DetailItem
              label="Website"
              value={application.website}
              icon={Globe}
            />
            <DetailItem
              label="White-Label Portal"
              value={application.wantsBrandedPortal}
              icon={Star}
            />
            <DetailItem
              label="Branding Name"
              value={application.brandingName}
              icon={Star}
            />
            <DetailItem
              label="Submitted"
              value={application.submittedAt}
              icon={Calendar}
            />
            <div className="sm:col-span-2">
              <DetailItem
                label="Countries Served"
                value={(application.countries || []).join(", ")}
                icon={Globe}
              />
            </div>
            <div className="sm:col-span-2">
              <DetailItem
                label="Services Offered"
                value={(application.services || []).join(", ")}
                icon={Star}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 px-5 sm:px-7 py-4 sm:py-5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          {readOnly ? (
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={() => onReject(application.id)}
                className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                <XCircle size={15} /> Reject Application
              </button>
              <button
                onClick={() => onApprove(application)}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                <CheckCircle size={15} /> Approve Partner
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CounselorsAdminPage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;

  const [counselors, setCounselors] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 320);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [counselorToDelete, setCounselorToDelete] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  // Toast helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/partners`,
        {
          withCredentials: true,
        },
      );

      const partners = response.data.data || [];

      // Approved partners
      const activePartners = partners
        .filter((partner) => partner.status === "approved")
        .map((partner) => ({
          id: partner.id,

          name: partner.fullName,

          email: partner.email,

          phone: partner.phone,

          agencyName: partner.agencyName,

          specialization: partner.specializationCountries?.join(", ") || "N/A",

          assignedStudents: 0,

          successRate: "0%",

          status: "Active",

          // NEW: carry over the original application fields so the same
          // detail modal used for reviewing pending applications can also
          // be opened (read-only) from the Active Partners table — the
          // counselor's original submission should always be viewable,
          // not just during the one-time approve/reject decision.
          fullName: partner.fullName,

          country: partner.country,

          city: partner.city,

          website: partner.website,

          agencyType: partner.agencyType,

          studentsPerMonth: partner.studentsPerMonth,

          countries: partner.specializationCountries || [],

          services: partner.services || [],

          wantsBrandedPortal: partner.wantsBrandedPortal,

          brandingName: partner.brandingName,

          submittedAt: new Date(partner.createdAt).toLocaleDateString(),
        }));

      // Pending applications
      const pendingApplications = partners
        .filter((partner) => partner.status === "pending")
        .map((partner) => ({
          id: partner.id,

          fullName: partner.fullName,

          email: partner.email,

          phone: partner.phone,

          country: partner.country,

          city: partner.city,

          agencyName: partner.agencyName,

          website: partner.website,

          agencyType: partner.agencyType,

          studentsPerMonth: partner.studentsPerMonth,

          countries: partner.specializationCountries || [],

          services: partner.services || [],

          wantsBrandedPortal: partner.wantsBrandedPortal,

          brandingName: partner.brandingName,

          status: partner.status,

          submittedAt: new Date(partner.createdAt).toLocaleDateString(),
        }));

      setCounselors(activePartners);

      setApplications(pendingApplications);
    } catch (err) {
      console.error("FETCH PARTNERS ERROR:", err);

      showToast("Failed to load partners.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // ── Handlers ──
  const openDeleteConfirm = useCallback((counselor) => {
    setCounselorToDelete(counselor);
    setShowConfirmDelete(true);
  }, []);

  const handleDeleteConfirmed = useCallback(async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/partners/${counselorToDelete.id}`,
        {
          withCredentials: true,
        },
      );

      showToast(`${counselorToDelete.name} removed successfully.`, "success");

      await fetchPartners();

      setShowConfirmDelete(false);

      setCounselorToDelete(null);
    } catch (err) {
      console.error(err);

      showToast("Failed to delete partner.", "error");
    }
  }, [counselorToDelete, fetchPartners, showToast]);

  const handleApprove = useCallback(
    async (application) => {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/partners/${application.id}`,
          {
            status: "approved",
          },
          {
            withCredentials: true,
          },
        );

        showToast(`${application.fullName} approved successfully.`, "success");

        await fetchPartners();
      } catch (err) {
        console.error(err);

        showToast("Failed to approve partner.", "error");
      }
    },
    [fetchPartners, showToast],
  );

  const handleReject = useCallback(
    async (id) => {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/partners/${id}`,
          {
            status: "rejected",
          },
          {
            withCredentials: true,
          },
        );

        showToast("Application rejected.", "warning");

        await fetchPartners();
      } catch (err) {
        console.error(err);

        showToast("Failed to reject application.", "error");
      }
    },
    [fetchPartners, showToast],
  );

  // ── Filtered data ──
  const filteredCounselors = useMemo(() => {
    if (!debouncedSearch?.trim()) return counselors;
    const t = debouncedSearch.toLowerCase();
    return counselors.filter(
      (c) =>
        c.name.toLowerCase().includes(t) ||
        c.email.toLowerCase().includes(t) ||
        c.specialization.toLowerCase().includes(t) ||
        (c.agencyName && c.agencyName.toLowerCase().includes(t)),
    );
  }, [counselors, debouncedSearch]);

  const filteredApplications = useMemo(() => {
    if (!debouncedSearch?.trim()) return applications;
    const t = debouncedSearch.toLowerCase();
    return applications.filter(
      (a) =>
        a.fullName.toLowerCase().includes(t) ||
        a.email.toLowerCase().includes(t) ||
        a.agencyName.toLowerCase().includes(t),
    );
  }, [applications, debouncedSearch]);

  const totalStudents = counselors.reduce(
    (acc, c) => acc + c.assignedStudents,
    0,
  );

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center animate-pulse">
            <Users size={20} className="text-sky-500" />
          </div>
          <p className="text-sm text-gray-500 animate-pulse">
            Loading partners…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Partner Management"
          counselorName={CounselorName}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* ── Toast Notification ── */}
          <AnimatePresence>
            {toast && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium max-w-sm ${
                  toast.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : toast.type === "error"
                      ? "bg-red-50 border-red-200 text-red-800"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                {toast.type === "success" ? (
                  <CheckCircle
                    size={16}
                    className="text-emerald-500 flex-shrink-0"
                  />
                ) : toast.type === "error" ? (
                  <Trash2 size={16} className="text-red-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle
                    size={16}
                    className="text-amber-500 flex-shrink-0"
                  />
                )}
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-8"
          >
            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <StatCard
                label="Pending Applications"
                value={applications.length}
                icon={Clock}
                color="amber"
                trend="Awaiting review"
              />
              <StatCard
                label="Active Partners"
                value={counselors.length}
                icon={UserCheck}
                color="green"
                trend="Across all regions"
              />
              <StatCard
                label="Students Managed"
                value={totalStudents}
                icon={Users}
                color="sky"
                trend="Total across partners"
              />
            </div>

            {/* ── Search ── */}
            <motion.div variants={itemVariants}>
              <div className="relative max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="search"
                  placeholder="Search applications or partners…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white shadow-sm transition-all duration-200 placeholder-gray-400"
                />
              </div>
            </motion.div>

            {/* ── Applications Table ── */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
              <SectionHeader
                title="Pending Partner Applications"
                count={filteredApplications.length}
                countColor="text-amber-600"
              />

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Agency
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                        Owner
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                        Country
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">
                        Students / Mo
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredApplications.map((application) => (
                      <ApplicationRow
                        key={application.id}
                        application={application}
                        openView={(app) => setSelectedApplication(app)}
                        handleApprove={handleApprove}
                        handleReject={handleReject}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredApplications.length === 0 && (
                <EmptyState
                  icon={Clock}
                  title="No pending applications"
                  description={
                    debouncedSearch
                      ? `No applications match "${debouncedSearch}"`
                      : "All applications have been reviewed."
                  }
                />
              )}
            </motion.div>

            {/* ── Counselors Table ── */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
              <SectionHeader
                title="Active Partners"
                count={filteredCounselors.length}
                countColor="text-emerald-600"
              />

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Partner
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                        Agency
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                        Phone
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">
                        Specialization
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Students
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                        Success
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredCounselors.map((counselor) => (
                      <CounselorRow
                        key={counselor.id}
                        counselor={counselor}
                        openView={(c) => setSelectedApplication(c)}
                        openDeleteConfirm={openDeleteConfirm}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCounselors.length === 0 && (
                <EmptyState
                  icon={Users}
                  title="No partners found"
                  description={
                    debouncedSearch
                      ? `No partners match "${debouncedSearch}"`
                      : "Approve an application to add your first partner."
                  }
                />
              )}
            </motion.div>

            {/* Global no-results message */}
            {filteredCounselors.length === 0 &&
              filteredApplications.length === 0 &&
              debouncedSearch && (
                <motion.p
                  variants={itemVariants}
                  className="text-center text-gray-400 text-sm py-4"
                >
                  No results for{" "}
                  <span className="font-semibold text-gray-600">
                    "{debouncedSearch}"
                  </span>
                </motion.p>
              )}
          </motion.div>
        </main>
      </div>

      {/* ── Application Detail Modal ── */}
      <AnimatePresence>
        {selectedApplication && (
          <ApplicationModal
            key="app-modal"
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            readOnly={selectedApplication.status === "Active"}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {showConfirmDelete && (
          <ConfirmationModal
            key="del-modal"
            title="Remove Partner"
            message={`Are you sure you want to remove ${counselorToDelete?.name}? This action cannot be undone and will unassign all their students.`}
            confirmText="Remove Partner"
            confirmVariant="danger"
            onConfirm={handleDeleteConfirmed}
            onCancel={() => {
              setShowConfirmDelete(false);
              setCounselorToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
