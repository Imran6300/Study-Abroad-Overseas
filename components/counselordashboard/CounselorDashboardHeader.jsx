// components/dashboard/DashboardHeader.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  X,
  Search,
  Moon,
  Sun,
} from "lucide-react";

export default function DashboardHeader({
  title = "Counselor Dashboard",
  counselorName = "Counselor",
  btnName = null,
  onButtonClick,
}) {
  const initials =
    counselorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkHeader, setDarkHeader] = useState(false);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearch(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "New student registered",
      message: "Ayan Sharma just created an account from Dubai",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Visa application update",
      message: "UK Tier 4 visa requirements changed for 2026",
      time: "1 hr ago",
      read: true,
    },
    {
      id: 3,
      type: "warning",
      title: "Payment pending",
      message: "Invoice #3921 for Maria Gonzalez is overdue",
      time: "3 hrs ago",
      read: false,
    },
    {
      id: 4,
      type: "info",
      title: "Document verified",
      message: "Hassan's IELTS certificate has been verified",
      time: "5 hrs ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const iconMap = {
    success: <Check size={16} className="text-emerald-500" />,
    info: <Info size={16} className="text-sky-500" />,
    warning: <AlertTriangle size={16} className="text-amber-500" />,
  };

  const bgMap = {
    success: "bg-emerald-50",
    info: "bg-sky-50",
    warning: "bg-amber-50",
  };

  return (
    <header className="bg-white/90 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_1px_12px_rgba(14,165,233,0.06)] sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          {/* LEFT: Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3 min-w-0"
          >
            {/* Accent bar */}
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-sky-500 to-indigo-600 hidden sm:block" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight truncate">
              {title}
            </h1>
          </motion.div>

          {/* RIGHT */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <AnimatePresence>
                {showSearch ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search students, tasks…"
                      className="w-full bg-slate-100 rounded-xl px-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setShowSearch(true)}
                    className="p-2.5 text-slate-500 hover:text-sky-600 rounded-full hover:bg-sky-50 transition-all"
                  >
                    <Search size={19} strokeWidth={1.8} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Notification bell */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setShowNotifications((p) => !p)}
                className="relative p-2.5 text-slate-500 hover:text-sky-600 rounded-full hover:bg-sky-50 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell size={20} strokeWidth={1.8} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-sm">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto">
                      {notifications.map((notif, i) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer ${!notif.read ? "bg-sky-50/30" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-7 h-7 rounded-full ${bgMap[notif.type]} flex items-center justify-center shrink-0 mt-0.5`}
                            >
                              {iconMap[notif.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-800 text-sm truncate">
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="px-5 py-3 bg-slate-50/50 text-center">
                      <button className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                        View all notifications →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-slate-200 hidden sm:block" />

            {/* Avatar */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
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
            </div>

            {/* Action Button */}
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
