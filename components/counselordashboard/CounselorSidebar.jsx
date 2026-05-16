"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  FileCheck,
} from "lucide-react";

export default function CounselorSidebar() {
  const user = useSelector((state) => state.auth.user);
  if (!user) return null;

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    dispatch(logout());
    router.replace("/login");
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard/counselor-dashboard",
      exact: true,
    },
    {
      icon: GraduationCap,
      label: "Students",
      href: "/dashboard/counselor-dashboard/students",
    },
    {
      icon: FileCheck,
      label: "Khizar Applications",
      href: "/dashboard/counselor-dashboard/khizar-applications",
    },
  ];

  const bottomItems = [
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/counselor-dashboard/settings",
    },
  ];

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ width: expanded ? 270 : 82 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 z-40 h-screen flex flex-col overflow-hidden will-change-[width]
        bg-gradient-to-b from-[#070d1a] via-[#0b1220] to-[#0d1530]
        border-r border-sky-900/30 shadow-[4px_0_24px_rgba(0,0,0,0.4)]"
    >
      {/* Logo */}
      <div className="px-4 py-6 shrink-0 border-b border-sky-900/20">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg shrink-0">
            OA
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="text-sky-400 font-extrabold text-sm tracking-wide leading-none">
                  OVERSEAS
                </p>
                <p className="text-slate-500 text-[10px] font-semibold tracking-widest mt-0.5">
                  COUNSELOR
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-5 space-y-2  overflow-y-auto overflow-x-hidden "
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            expanded={expanded}
            active={isActive(item)}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="px-3 mb-2">
        <div className="h-px bg-sky-900/30" />
      </div>

      {/* Bottom items */}
      <div className="px-2.5 pb-2 space-y-1">
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            expanded={expanded}
            active={isActive(item)}
          />
        ))}
      </div>

      {/* User + Logout */}
      <div className="px-2.5 pb-5 shrink-0 border-t border-sky-900/20 pt-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-950/30 transition-all duration-200 overflow-hidden"
        >
          <LogOut size={24} strokeWidth={1.8} className="shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-semibold whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}

function SidebarItem({ icon: Icon, label, href, expanded, active }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: expanded ? 4 : 0 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden
          ${
            active
              ? "bg-sky-500/15 border border-sky-500/25 text-sky-300 shadow-lg shadow-sky-500/10"
              : "text-slate-400 hover:text-sky-300 hover:bg-sky-950/30 border border-transparent"
          }`}
      >
        {/* Active indicator */}
        {active && (
          <motion.div
            layoutId="sidebarActive"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-400 rounded-full"
          />
        )}

        {/* ICON */}
        <div
          className={`
            flex items-center justify-center
            w-11 h-11 rounded-xl
            transition-all duration-200
            ${active ? "bg-sky-500/10" : "group-hover:bg-slate-800/70"}
          `}
        >
          <Icon size={24} strokeWidth={2.1} className="shrink-0" />
        </div>

        {/* TEXT */}
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-[15px] font-semibold whitespace-nowrap tracking-wide"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* TOOLTIP */}
        {!expanded && (
          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-slate-100 text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 shadow-2xl border border-slate-700">
            {label}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
