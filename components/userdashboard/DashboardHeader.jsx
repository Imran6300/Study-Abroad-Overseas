"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/userdashboard/BrandedDashboardHeader.jsx
//
// Drop-in replacement for DashboardHeader.
// Takes branding prop (from Redux selectActiveBranding) and applies
// brand primary color to active indicator, avatar background etc.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { disconnectSocket } from "@/lib/socket";

import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { clearLead } from "@/store/leadSlice";
import { useRouter } from "next/navigation";

export default function BrandedDashboardHeader({ user, branding }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const primary = branding?.primaryColor || "#22c55e";
  const bgColor = branding?.secondaryColor || "#0A192F";
  const accent = branding?.accentColor || "#ffffff";

  const dispatch = useDispatch();
  const router = useRouter();

  const notifications = [];
  const unreadCount = notifications.length;

  const handleLogout = async () => {
    try {
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
      dispatch(clearLead());

      router.replace("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        {/* Left */}
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

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-xl"
            >
              🔔
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-xs text-white px-1 rounded-full"
                  style={{ background: "#ef4444" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-4 w-[90vw] sm:w-80 rounded-2xl shadow-xl overflow-hidden"
                  style={{
                    background: `color-mix(in srgb, ${bgColor} 90%, white 10%)`,
                    border: `1px solid ${primary}25`,
                  }}
                >
                  <div
                    className="p-4 flex justify-between"
                    style={{ borderBottom: `1px solid ${primary}20` }}
                  >
                    <h3 className="font-semibold" style={{ color: accent }}>
                      Notifications
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-sm font-semibold"
                      style={{ color: primary }}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 && (
                      <p
                        className="p-6 text-center text-sm"
                        style={{ color: `${accent}44` }}
                      >
                        No new notifications
                      </p>
                    )}
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b hover:opacity-80">
                        <p className="text-sm" style={{ color: accent }}>
                          {n.message}
                        </p>
                        <p className="text-xs" style={{ color: `${accent}44` }}>
                          {n.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-black text-sm"
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
