"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardHeader({ user }) {
  const pathname = usePathname();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = [
    {
      id: 1,
      message: "Application to Toronto under review",
      time: "2h ago",
    },
    {
      id: 2,
      message: "Scholarship opportunity available",
      time: "1 day ago",
    },
  ];

  const unreadCount = notifications.length;

  const markAllAsRead = () => {
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle = pathname
    .replace("/dashboard/user", "")
    .replace("/", "")
    .toUpperCase();

  return (
    <div className="sticky top-0 z-50 bg-[#0A192F]/90 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white capitalize truncate">
              {pageTitle || "Dashboard"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              Welcome back, {user?.name || "Student"}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search */}
          <div className="hidden md:block w-56 lg:w-72">
            <input
              placeholder="Search universities..."
              className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#32CD32]"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-xl"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-1 rounded-full">
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
                  className="absolute right-0 mt-4 w-[90vw] sm:w-80 bg-[#0F1C3A] border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10 flex justify-between">
                    <h3 className="text-white font-semibold">Notifications</h3>

                    <button
                      onClick={markAllAsRead}
                      className="text-[#32CD32] text-sm"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 border-b border-white/5 hover:bg-white/5"
                      >
                        <p className="text-sm text-white">{n.message}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/dashboard/user/notifications"
                    className="block text-center text-sm text-[#32CD32] py-3 hover:bg-white/5"
                  >
                    View all
                  </Link>
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
              <div className="w-9 h-9 bg-[#32CD32] rounded-full flex items-center justify-center font-bold text-black">
                {user?.name?.charAt(0) || "U"}
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-4 w-48 bg-[#0F1C3A] border border-white/10 rounded-xl shadow-xl"
                >
                  <Link
                    href="/dashboard/user/profile"
                    className="block px-4 py-3 text-sm text-white hover:bg-white/5"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/dashboard/user/settings"
                    className="block px-4 py-3 text-sm text-white hover:bg-white/5"
                  >
                    Settings
                  </Link>

                  <Link
                    href="/dashboard/user/applications"
                    className="block px-4 py-3 text-sm text-white hover:bg-white/5"
                  >
                    Applications
                  </Link>

                  <div className="border-t border-white/10"></div>

                  <Link
                    href="/logout"
                    className="block px-4 py-3 text-sm text-red-400 hover:bg-white/5"
                  >
                    Logout
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
