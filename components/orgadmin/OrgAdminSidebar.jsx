"use client";

/**
 * components/orgadmin/OrgAdminSidebar.jsx
 *
 * Sidebar for the White-Label Admin (Organization) dashboard.
 * Mirrors the CounselorSidebar pattern (hover-to-expand on desktop,
 * hamburger drawer on mobile) but with org-specific nav items.
 *
 * Nav items:
 *   Overview, Counselors, Students, Applications, Settings
 */

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

// ─── Nav items ────────────────────────────────────────────────────────────────

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/dashboard/org-admin",
    exact: true,
  },
  {
    icon: Users,
    label: "Counselors",
    href: "/dashboard/org-admin/counselors",
  },
  {
    icon: GraduationCap,
    label: "Students",
    href: "/dashboard/org-admin/students",
  },
  {
    icon: FileText,
    label: "Applications",
    href: "/dashboard/org-admin/applications",
  },
];

const bottomItems = [
  {
    icon: BookOpen,
    label: "Manual",
    href: "/dashboard/org-admin/manual",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/org-admin/settings",
  },
];

function isActive(item, pathname) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function getMobileTitle(pathname) {
  if (pathname === "/dashboard/org-admin") return "Overview";
  if (pathname === "/dashboard/org-admin/counselors") return "Counselors";
  if (pathname === "/dashboard/org-admin/students") return "Students";
  if (pathname === "/dashboard/org-admin/applications") return "Applications";
  if (pathname === "/dashboard/org-admin/settings") return "Settings";
  if (pathname === "/dashboard/org-admin/manual") return "Dashboard Manual";
  return "Organization";
}

// ─── SidebarItem ─────────────────────────────────────────────────────────────

function SidebarItem({ icon: Icon, label, href, expanded, active, onClick }) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileHover={{ x: expanded ? 4 : 0 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden
          ${
            active
              ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
      >
        {active && (
          <motion.div
            layoutId="orgAdminActiveIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-r-full"
          />
        )}
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${active ? "text-emerald-400" : ""}`}
        />
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {!expanded && (
          <div className="absolute left-[70px] bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-gray-700">
            {label}
          </div>
        )}
      </motion.div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrgAdminSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3020"}/auth/logout`,
        { method: "POST", credentials: "include" },
      );
    } catch (_) {}
    dispatch(logout());
    router.replace("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  // ── Mobile top bar ────────────────────────────────────────────────────────
  const mobileBar = (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0A192F] border-b border-white/10 flex items-center px-4 gap-3">
      <button
        onClick={() => setMobileOpen(true)}
        className="text-gray-300 hover:text-white"
      >
        <Menu className="w-5 h-5" />
      </button>
      <Building2 className="w-5 h-5 text-emerald-400" />
      <span className="text-white font-semibold text-sm flex-1">
        {getMobileTitle(pathname)}
      </span>
    </div>
  );

  // ── Mobile drawer ─────────────────────────────────────────────────────────
  const mobileDrawer = (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 z-50"
            onClick={closeMobile}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#0A192F] z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-emerald-400" />
                <span className="text-white font-bold">Organization</span>
              </div>
              <button
                onClick={closeMobile}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  expanded={true}
                  active={isActive(item, pathname)}
                  onClick={closeMobile}
                />
              ))}
            </nav>

            <div className="p-3 border-t border-white/10 space-y-1">
              {bottomItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  expanded={true}
                  active={isActive(item, pathname)}
                  onClick={closeMobile}
                />
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ── Desktop sidebar ───────────────────────────────────────────────────────
  const desktopSidebar = (
    <motion.div
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      animate={{ width: expanded ? 220 : 82 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 flex-col bg-[#0A192F] border-r border-white/10 overflow-hidden"
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 h-16">
        <Building2 className="w-7 h-7 text-emerald-400 flex-shrink-0" />
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white font-bold text-sm whitespace-nowrap"
            >
              Organization
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            expanded={expanded}
            active={isActive(item, pathname)}
          />
        ))}
      </nav>

      {/* Bottom items */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            expanded={expanded}
            active={isActive(item, pathname)}
          />
        ))}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <>
      {mobileBar}
      {mobileDrawer}
      {desktopSidebar}
    </>
  );
}
