// components/dashboard/DashboardHeader.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Info, AlertTriangle, X } from "lucide-react";
import { useSelector } from "react-redux";

export default function DashboardHeader({
  title = "Dashboard",
  counselorName = "Admin",
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
  const notificationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sample notifications — replace with your real data (from context, redux, api, etc.)
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
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="
        bg-white/80 backdrop-blur-xl
        border-b border-gray-200/60
        shadow-sm sticky top-0 z-30
        transition-all duration-300
      "
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3 min-w-0"
          >
            <h1
              className="
                text-xl sm:text-2xl lg:text-3xl 
                font-extrabold 
                bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 
                bg-clip-text text-transparent
                tracking-tight
              "
            >
              {title}
            </h1>
          </motion.div>

          {/* Right side */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Notification bell with dropdown */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setShowNotifications((prev) => !prev)}
                className="
                  relative p-2.5 text-gray-600 
                  hover:text-sky-600 
                  rounded-full 
                  hover:bg-sky-50/60 
                  transition-all duration-200
                "
                aria-label="Notifications"
              >
                <Bell size={22} strokeWidth={1.8} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  </>
                )}
              </motion.button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="
                      absolute right-0 mt-3 w-80 sm:w-96 
                      bg-white rounded-xl shadow-2xl 
                      border border-gray-200/80 
                      overflow-hidden z-50
                    "
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-indigo-50">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[420px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`
                              px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50/80 transition-colors
                              ${!notif.read ? "bg-sky-50/40" : ""}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                {notif.type === "success" && (
                                  <Check
                                    size={18}
                                    className="text-emerald-600"
                                  />
                                )}
                                {notif.type === "info" && (
                                  <Info size={18} className="text-sky-600" />
                                )}
                                {notif.type === "warning" && (
                                  <AlertTriangle
                                    size={18}
                                    className="text-amber-600"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">
                                  {notif.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1.5">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar + name (unchanged) */}
            <div className="flex items-center gap-3 group">
              <motion.div whileHover={{ scale: 1.08 }} className="relative">
                <div
                  className="
                    w-9 h-9 sm:w-11 sm:h-11 
                    rounded-full 
                    bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700
                    flex items-center justify-center 
                    text-white font-bold 
                    text-base sm:text-lg 
                    shadow-lg ring-2 ring-white/40
                    transition-all duration-300
                    group-hover:ring-sky-400/60
                  "
                >
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
              </motion.div>

              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {counselorName}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Welcome back
                </span>
              </div>
            </div>

            {/* Primary Action Button (unchanged) */}

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onButtonClick}
              className="
                  group relative overflow-hidden
                  flex items-center gap-2
                  bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700
                  hover:from-sky-700 hover:via-sky-800 hover:to-indigo-800
                  text-white
                  px-5 sm:px-6 py-2.5 sm:py-3
                  rounded-xl
                  font-semibold text-sm sm:text-base
                  shadow-lg hover:shadow-xl
                  transition-all duration-300
                "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative z-10">{btnName}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
