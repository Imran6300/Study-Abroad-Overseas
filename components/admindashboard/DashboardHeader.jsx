// components/dashboard/DashboardHeader.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu } from "lucide-react";

import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { disconnectSocket } from "@/lib/socket"; // adjust path
import { toggleMobileSidebar } from "@/components/admindashboard/mobileSidebarStore";

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const [loggingOut, setLoggingOut] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      disconnectSocket();

      dispatch(logout());

      router.replace("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  };

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
          {/* Left: Menu toggle (mobile only) + Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3 min-w-0"
          >
            <button
              type="button"
              onClick={toggleMobileSidebar}
              aria-label="Open menu"
              className="
                md:hidden
                -ml-1 mr-1
                w-10 h-10 shrink-0
                flex items-center justify-center
                rounded-lg text-gray-700
                hover:bg-gray-100 active:bg-gray-200
                transition-colors
              "
            >
              <Menu size={22} />
            </button>

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
            {/* Avatar + name (unchanged) */}
            <div
              className="flex items-center gap-3 group relative cursor-pointer"
              ref={profileRef}
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
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

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="
        absolute top-14 right-0
        w-48 bg-white
        border border-gray-200
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

            {/* Primary Action Button (unchanged) */}
            {btnName && (
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
