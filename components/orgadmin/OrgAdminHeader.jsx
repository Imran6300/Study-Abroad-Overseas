"use client";

/**
 * components/orgadmin/OrgAdminHeader.jsx
 *
 * Top header for the Org Admin dashboard.
 * Includes a fully-wired notification bell that:
 *   - Fetches notifications on mount via Redux
 *   - Listens to Socket.IO for real-time pushes
 *   - Lets admin mark one / all read, delete, and click-through to detail pages
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Building2,
  X,
  Trash2,
  CheckCheck,
  GraduationCap,
  FileText,
  ClipboardList,
  UploadCloud,
  TrendingUp,
  UserPlus,
  Activity,
  AlertCircle,
} from "lucide-react";

import { getSocket } from "@/lib/socket";
import { selectOrganization } from "@/store/orgAdminSlice";
import {
  fetchOrgAdminNotifications,
  markOrgAdminNotifRead,
  markAllOrgAdminNotifsRead,
  deleteOrgAdminNotif,
  addOrgAdminNotification,
  setOrgAdminUnreadCount,
} from "@/store/notificationSlice";

// ─── Notification type → icon & colour ───────────────────────────────────────

const TYPE_META = {
  student_added: {
    icon: <UserPlus size={13} className="text-emerald-500" />,
    bg: "bg-emerald-50",
    label: "New Student",
  },
  stage_changed: {
    icon: <TrendingUp size={13} className="text-indigo-500" />,
    bg: "bg-indigo-50",
    label: "Stage Update",
  },
  application_submitted: {
    icon: <ClipboardList size={13} className="text-sky-500" />,
    bg: "bg-sky-50",
    label: "Application",
  },
  application_created: {
    icon: <FileText size={13} className="text-violet-500" />,
    bg: "bg-violet-50",
    label: "Application",
  },
  application_status: {
    icon: <GraduationCap size={13} className="text-amber-500" />,
    bg: "bg-amber-50",
    label: "Status",
  },
  document_uploaded: {
    icon: <UploadCloud size={13} className="text-teal-500" />,
    bg: "bg-teal-50",
    label: "Document",
  },
  counselor_activity: {
    icon: <Activity size={13} className="text-slate-500" />,
    bg: "bg-slate-50",
    label: "Activity",
  },
  system: {
    icon: <AlertCircle size={13} className="text-red-500" />,
    bg: "bg-red-50",
    label: "System",
  },
};

function getTypeMeta(type) {
  return (
    TYPE_META[type] || {
      icon: <Bell size={13} className="text-slate-400" />,
      bg: "bg-slate-50",
      label: "Notification",
    }
  );
}

// ─── Relative time ────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// ─── Single notification row ──────────────────────────────────────────────────

function NotifRow({ notif, onRead, onDelete, onNavigate }) {
  const meta = getTypeMeta(notif.type);

  const handleClick = () => {
    if (!notif.isRead) onRead(notif._id);
    if (notif.actionUrl) onNavigate(notif.actionUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={handleClick}
      className={`px-4 py-3.5 border-b border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer group ${
        !notif.isRead ? "bg-emerald-500/[0.04]" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Type icon */}
        <div
          className={`w-7 h-7 rounded-full ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}
        >
          {meta.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-white/80 text-[13px] truncate">
              {notif.title}
            </p>
            {!notif.isRead && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            )}
          </div>
          <p className="text-[12px] text-white/45 leading-snug line-clamp-2">
            {notif.message}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-white/25 font-medium tabular-nums">
              {timeAgo(notif.createdAt)}
            </span>
            <span className="text-[10px] text-white/20">·</span>
            <span className="text-[10px] text-white/25">{meta.label}</span>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notif._id);
          }}
          className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-white/30 hover:text-red-400 p-1 rounded"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function OrgAdminHeader({ title, adminName }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const organization = useSelector(selectOrganization);
  const orgName =
    organization?.name || organization?.branding?.brandName || null;

  const { orgAdminNotifs, orgAdminUnread, orgAdminLoading } = useSelector(
    (s) => s.notifications,
  );

  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef(null);

  // ── 1. Fetch on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchOrgAdminNotifications());
  }, [dispatch]);

  // ── 2. Socket.IO real-time ────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();

    const handleNew = (notif) => {
      dispatch(addOrgAdminNotification(notif));
    };
    const handleCount = (count) => {
      dispatch(setOrgAdminUnreadCount(count));
    };

    socket.on("orgadmin-new-notification", handleNew);
    socket.on("orgadmin-notification-count", handleCount);

    return () => {
      socket.off("orgadmin-new-notification", handleNew);
      socket.off("orgadmin-notification-count", handleCount);
    };
  }, [dispatch]);

  // ── 3. Click-outside to close ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRead = useCallback(
    (id) => dispatch(markOrgAdminNotifRead(id)),
    [dispatch],
  );

  const handleMarkAllRead = useCallback(
    () => dispatch(markAllOrgAdminNotifsRead()),
    [dispatch],
  );

  const handleDelete = useCallback(
    (id) => dispatch(deleteOrgAdminNotif(id)),
    [dispatch],
  );

  const handleNavigate = useCallback(
    (url) => {
      setShowPanel(false);
      router.push(url);
    },
    [router],
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <header className="sticky top-14 lg:top-0 z-30 bg-[#0A192F] border-b border-white/[0.06] h-14 flex items-center px-4 lg:px-6 gap-4">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-white truncate">{title}</h1>
        {orgName && (
          <p className="text-xs text-white/30 truncate flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {orgName}
          </p>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* ── Notification Bell ──────────────────────────────────────────── */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowPanel((p) => !p)}
            className="relative p-2 text-white/40 hover:text-white/80 hover:bg-white/[0.06] rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />

            {orgAdminUnread > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {orgAdminUnread > 9 ? "9+" : orgAdminUnread}
                </span>
              </>
            )}
          </button>

          {/* ── Notification Panel ──────────────────────────────────────── */}
          <AnimatePresence>
            {showPanel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-[340px] sm:w-[380px] bg-[#0d2137] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white/80 text-sm">
                      Notifications
                    </h3>
                    {orgAdminUnread > 0 && (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {orgAdminUnread} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {orgAdminUnread > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        title="Mark all read"
                        className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <CheckCheck size={13} />
                        <span className="hidden sm:inline">Mark all read</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowPanel(false)}
                      className="text-white/25 hover:text-white/60 transition-colors p-0.5 rounded"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {orgAdminLoading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                      <p className="text-xs text-white/30">
                        Loading notifications…
                      </p>
                    </div>
                  )}

                  {!orgAdminLoading && orgAdminNotifs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="w-12 h-12 bg-white/[0.04] rounded-2xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white/15" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white/40">
                          All caught up
                        </p>
                        <p className="text-xs text-white/20 mt-0.5">
                          Updates from your counselors appear here
                        </p>
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {orgAdminNotifs.map((notif) => (
                      <NotifRow
                        key={notif._id}
                        notif={notif}
                        onRead={handleRead}
                        onDelete={handleDelete}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Panel footer */}
                {orgAdminNotifs.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-white/[0.05] bg-white/[0.01] text-center">
                    <p className="text-[11px] text-white/20">
                      Showing {orgAdminNotifs.length} most recent notifications
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Admin avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
            {adminName?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span className="hidden sm:block text-sm font-medium text-white/70 truncate max-w-[120px]">
            {adminName}
          </span>
        </div>
      </div>
    </header>
  );
}
