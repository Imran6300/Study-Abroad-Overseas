"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/userdashboard/DashboardHeader.jsx
//
// FULLY WIRED notification bell for the student dashboard.
//
// What works:
//   1. On mount  → fetches real notifications from GET /user/notifications
//   2. Socket.IO → listens for "new-notification" (push) and
//                  "notification-count" (badge update) in real time
//   3. Click     → marks individual notification read via PATCH /:id/read
//   4. "Mark all read" → PATCH /user/notifications/read-all
//   5. Delete    → DELETE /user/notifications/:id
//   6. Badge     → red dot with count, animates when > 0
//   7. On logout → disconnects socket
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { disconnectSocket, getSocket } from "@/lib/socket";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { clearLead } from "@/store/leadSlice";
import { useRouter } from "next/navigation";
import {
  fetchStudentNotifications,
  markStudentNotifRead,
  markAllStudentNotifsRead,
  deleteStudentNotif,
  addStudentNotification,
  setStudentUnreadCount,
} from "@/store/notificationSlice";

// ── tiny helper: pretty relative time ────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── type → icon map ───────────────────────────────────────────────────────────
const TYPE_ICON = {
  application: "📋",
  shortlist: "🏫",
  deadline: "⏰",
  visa: "🛂",
  message: "💬",
  system: "🔔",
};

export default function BrandedDashboardHeader({ user, branding }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const primary = branding?.primaryColor || "#22c55e";
  const bgColor = branding?.secondaryColor || "#0A192F";
  const accent = branding?.accentColor || "#ffffff";

  // ── notification state from Redux ─────────────────────────────────────────
  const { studentNotifs, studentUnread, studentLoading } = useSelector(
    (s) => s.notifications,
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // ── 1. Fetch on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchStudentNotifications());
    }
  }, [user?._id, dispatch]);

  // ── 2. Socket.IO real-time ────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    // Backend: sendNotification() emits "new-notification" to the user's room
    const handleNew = (notif) => {
      dispatch(addStudentNotification(notif));
    };

    // Backend: sendNotification() emits "notification-count" with int
    const handleCount = (count) => {
      dispatch(setStudentUnreadCount(count));
    };

    socket.on("new-notification", handleNew);
    socket.on("notification-count", handleCount);

    return () => {
      socket.off("new-notification", handleNew);
      socket.off("notification-count", handleCount);
    };
  }, [user?._id, dispatch]);

  // ── 3. Click-outside closes dropdowns ─────────────────────────────────────
  useEffect(() => {
    const handle = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleMarkRead = useCallback(
    (id) => dispatch(markStudentNotifRead(id)),
    [dispatch],
  );

  const handleMarkAllRead = useCallback(() => {
    dispatch(markAllStudentNotifsRead());
  }, [dispatch]);

  const handleDelete = useCallback(
    (e, id) => {
      e.stopPropagation();
      dispatch(deleteStudentNotif(id));
    },
    [dispatch],
  );

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Logout failed");
      disconnectSocket();
      dispatch(logout());
      dispatch(clearLead());
      router.replace("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const pageTitle = pathname
    .replace("/dashboard/user", "")
    .replace("/", "")
    .replace(/-/g, " ")
    .toUpperCase();

  return (
    <div
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        background: `${bgColor}e8`,
        borderBottom: `1px solid ${primary}20`,
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* ── Left: page title ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="min-w-0">
            <h1
              className="text-lg sm:text-xl font-bold capitalize truncate"
              style={{ color: accent }}
            >
              {pageTitle || "Dashboard"}
            </h1>
            <p
              className="text-xs sm:text-sm truncate"
              style={{ color: `${accent}66` }}
            >
              Welcome back, {user?.name || "Student"}
            </p>
          </div>
        </div>

        {/* ── Right: bell + avatar ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* BELL */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((p) => !p)}
              className="relative p-2 rounded-full transition-all"
              style={{ color: accent }}
              aria-label="Notifications"
            >
              <span className="text-xl">🔔</span>

              {/* Animated badge */}
              {studentUnread > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full animate-ping bg-red-500" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                    {studentUnread > 9 ? "9+" : studentUnread}
                  </span>
                </>
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-[90vw] sm:w-80 rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    background: `color-mix(in srgb, ${bgColor} 90%, white 10%)`,
                    border: `1px solid ${primary}30`,
                  }}
                >
                  {/* Header row */}
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: `1px solid ${primary}20` }}
                  >
                    <div className="flex items-center gap-2">
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: accent }}
                      >
                        Notifications
                      </h3>
                      {studentUnread > 0 && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: primary }}
                        >
                          {studentUnread} new
                        </span>
                      )}
                    </div>
                    {studentUnread > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold hover:opacity-70 transition-opacity"
                        style={{ color: primary }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-[340px] overflow-y-auto">
                    {studentLoading && (
                      <p
                        className="p-6 text-center text-sm"
                        style={{ color: `${accent}55` }}
                      >
                        Loading…
                      </p>
                    )}
                    {!studentLoading && studentNotifs.length === 0 && (
                      <p
                        className="p-6 text-center text-sm"
                        style={{ color: `${accent}44` }}
                      >
                        No notifications yet
                      </p>
                    )}
                    {studentNotifs.map((n, i) => (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => !n.isRead && handleMarkRead(n._id)}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-opacity hover:opacity-80 group"
                        style={{
                          borderBottom: `1px solid ${primary}10`,
                          background: !n.isRead
                            ? `${primary}10`
                            : "transparent",
                        }}
                      >
                        {/* Icon */}
                        <span className="text-lg shrink-0 mt-0.5">
                          {TYPE_ICON[n.type] || "🔔"}
                        </span>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p
                              className="text-sm font-semibold truncate"
                              style={{ color: accent }}
                            >
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: primary }}
                              />
                            )}
                          </div>
                          <p
                            className="text-xs mt-0.5 leading-relaxed line-clamp-2"
                            style={{ color: `${accent}77` }}
                          >
                            {n.message}
                          </p>
                          <p
                            className="text-[10px] mt-1"
                            style={{ color: `${accent}44` }}
                          >
                            {timeAgo(n.createdAt)}
                          </p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={(e) => handleDelete(e, n._id)}
                          className="shrink-0 text-xs opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                          style={{ color: accent }}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div
                    className="px-4 py-2.5 text-center"
                    style={{ borderTop: `1px solid ${primary}15` }}
                  >
                    <Link
                      href="/dashboard/user/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: primary }}
                    >
                      View all notifications →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AVATAR / PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile((p) => !p)}
              className="flex items-center gap-2"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-black text-sm shadow-md"
                style={{ background: primary }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-4 w-48 rounded-xl shadow-xl overflow-hidden"
                  style={{
                    background: `color-mix(in srgb, ${bgColor} 90%, white 10%)`,
                    border: `1px solid ${primary}25`,
                  }}
                >
                  {[
                    { href: "/dashboard/user/profile", label: "Profile" },
                    { href: "/dashboard/user/settings", label: "Settings" },
                    {
                      href: "/dashboard/user/applications",
                      label: "Applications",
                    },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-3 text-sm hover:opacity-80 transition-opacity"
                      style={{ color: accent }}
                    >
                      {label}
                    </Link>
                  ))}
                  <div style={{ borderTop: `1px solid ${primary}20` }} />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:opacity-80"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
