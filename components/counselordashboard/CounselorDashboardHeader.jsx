"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/counselordashboard/CounselorDashboardHeader.jsx
//
// FULLY WIRED notification bell for the counselor dashboard.
//
// What works:
//   1. On mount  → fetches real notifications from GET /api/counselor/notifications
//   2. Socket.IO → listens for "counselor-new-notification" (push) and
//                  "counselor-notification-count" (badge update) in real time
//   3. Click     → marks individual notification read via PATCH /:id/read
//   4. "Mark all read" → PATCH /api/counselor/notifications/read-all
//   5. Delete    → DELETE /api/counselor/notifications/:id
//   6. Badge     → red dot with count + ping animation when > 0
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Info, AlertTriangle, X, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "@/lib/socket";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import { disconnectSocket } from "@/lib/socket";
import {
  fetchCounselorNotifications,
  markCounselorNotifRead,
  markAllCounselorNotifsRead,
  deleteCounselorNotif,
  addCounselorNotification,
  setCounselorUnreadCount,
} from "@/store/notificationSlice";

// ── helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_ICON = {
  student_registered: <Check size={15} className="text-emerald-500" />,
  application_update: <Info size={15} className="text-sky-500" />,
  payment: <AlertTriangle size={15} className="text-amber-500" />,
  deadline: <AlertTriangle size={15} className="text-orange-500" />,
  document: <Check size={15} className="text-emerald-500" />,
  message: <Info size={15} className="text-violet-500" />,
  system: <Info size={15} className="text-slate-500" />,
};

const TYPE_BG = {
  student_registered: "bg-emerald-50",
  application_update: "bg-sky-50",
  payment: "bg-amber-50",
  deadline: "bg-orange-50",
  document: "bg-emerald-50",
  message: "bg-violet-50",
  system: "bg-slate-50",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function CounselorDashboardHeader({
  title = "Counselor Dashboard",
  counselorName = "Counselor",
  btnName = null,
  onButtonClick,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const { counselorNotifs, counselorUnread, counselorLoading } = useSelector(
    (s) => s.notifications,
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const profileRef = useRef(null);

  const router = useRouter();

  const initials =
    counselorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CO";

  // ── 1. Fetch on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCounselorNotifications());
    }
  }, [user?._id, dispatch]);

  // ── 2. Socket.IO real-time ────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    const handleNew = (notif) => {
      dispatch(addCounselorNotification(notif));
    };
    const handleCount = (count) => {
      dispatch(setCounselorUnreadCount(count));
    };

    socket.on("counselor-new-notification", handleNew);
    socket.on("counselor-notification-count", handleCount);

    return () => {
      socket.off("counselor-new-notification", handleNew);
      socket.off("counselor-notification-count", handleCount);
    };
  }, [user?._id, dispatch]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // ── 3. Click outside ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleMarkRead = useCallback(
    (id) => dispatch(markCounselorNotifRead(id)),
    [dispatch],
  );

  const handleMarkAllRead = useCallback(() => {
    dispatch(markAllCounselorNotifsRead());
  }, [dispatch]);

  const handleDelete = useCallback(
    (e, id) => {
      e.stopPropagation();
      dispatch(deleteCounselorNotif(id));
    },
    [dispatch],
  );

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setShowProfileMenu(false);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      disconnectSocket();

      dispatch(logout());

      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_1px_12px_rgba(14,165,233,0.06)] sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          {/* ── LEFT: Title ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3 min-w-0"
          >
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-sky-500 to-indigo-600 hidden sm:block" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight truncate">
              {title}
            </h1>
          </motion.div>

          {/* ── RIGHT ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* BELL */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setShowNotifications((p) => !p)}
                className="relative p-2.5 text-slate-500 hover:text-sky-600 rounded-full hover:bg-sky-50 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell size={20} strokeWidth={1.8} />

                {counselorUnread > 0 && (
                  <>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                      {counselorUnread > 9 ? "9+" : counselorUnread}
                    </span>
                  </>
                )}
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-sm">
                          Notifications
                        </h3>
                        {counselorUnread > 0 && (
                          <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {counselorUnread} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {counselorUnread > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    {/* List */}
                    <div className="max-h-[380px] overflow-y-auto">
                      {counselorLoading && (
                        <p className="p-6 text-center text-sm text-slate-400">
                          Loading…
                        </p>
                      )}
                      {!counselorLoading && counselorNotifs.length === 0 && (
                        <p className="p-6 text-center text-sm text-slate-400">
                          No notifications yet
                        </p>
                      )}
                      {counselorNotifs.map((notif, i) => (
                        <motion.div
                          key={notif._id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() =>
                            !notif.isRead && handleMarkRead(notif._id)
                          }
                          className={`px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                            !notif.isRead ? "bg-sky-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Type icon */}
                            <div
                              className={`w-7 h-7 rounded-full ${
                                TYPE_BG[notif.type] || "bg-slate-50"
                              } flex items-center justify-center shrink-0 mt-0.5`}
                            >
                              {TYPE_ICON[notif.type] || (
                                <Bell size={14} className="text-slate-400" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-800 text-sm truncate">
                                  {notif.title}
                                </p>
                                {!notif.isRead && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                {timeAgo(notif.createdAt)}
                              </p>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={(e) => handleDelete(e, notif._id)}
                              className="shrink-0 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity text-slate-400 hover:text-red-400 p-1"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {/* Footer
                    <div className="px-5 py-3 bg-slate-50/50 text-center">
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        View all notifications →
                      </button>
                    </div>{" "} */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-slate-200 hidden sm:block" />

            {/* Avatar */}
            <div
              className="flex items-center gap-2.5 group cursor-pointer relative"
              ref={profileRef}
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                className="relative shrink-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white group-hover:ring-sky-300 transition-all duration-300">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
              </motion.div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-sm font-bold text-slate-800">
                  {counselorName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  COUNSELOR
                </span>
              </div>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="
        absolute top-full mt-2 right-0
        w-48 bg-white
        border border-slate-200
        rounded-xl
        shadow-xl
        overflow-hidden
        z-50
      "
                  >
                    <button
                      disabled={loggingOut}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="
          w-full flex items-center gap-3
          px-4 py-3
          text-red-600
          hover:bg-red-50
          transition-colors
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
                    >
                      <LogOut size={18} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action button */}
            {btnName && (
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onButtonClick}
                className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-sky-200 hover:shadow-sky-300 transition-all duration-300 hidden md:flex"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">{btnName}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
