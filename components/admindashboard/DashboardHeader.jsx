// components/dashboard/DashboardHeader.jsx
import { motion } from "framer-motion";
import { Bell} from "lucide-react"; // install: npm install lucide-react

export default function DashboardHeader({
  title = "Dashboard",
  counselorName = "Admin",
  btnName = null,
  onButtonClick,
}) {
  const initials = counselorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

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
          {/* Left: Title with gradient animation */}
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
            {/* Notification bell */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
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
              {/* Pulse effect example - remove if you don't want */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            </motion.button>

            {/* Avatar + name */}
            <div className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="relative"
              >
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

              {/* Name (hidden on mobile) */}
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {counselorName}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Welcome back
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
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
                {/* Shine effect */}
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