"use client";

/**
 * CounselorSidebar.jsx
 *
 * BUGS FIXED vs original:
 *  1. Rules of Hooks violation — `if (!user) return null` was placed between
 *     two hook calls (useSelector → early return → useDispatch). All hooks are
 *     now declared before any conditional return.
 *
 *  2. Collapsed sidebar width mismatch — layout.jsx was using `pl-[68px]` but
 *     the sidebar animates to w-[82px] collapsed. The layout companion file
 *     uses `pl-[82px]` to match.
 *
 * MOBILE RESPONSIVENESS (new):
 *  - Desktop (≥1024px): original hover-to-expand behaviour, zero visual change.
 *  - Mobile  (<1024px):
 *      • Sidebar is completely hidden off-screen (translateX(-100%)).
 *      • A slim top mobile bar renders with: hamburger, logo, page-aware title,
 *        and the user avatar / logout shortcut.
 *      • Tapping the hamburger slides a full-width drawer in from the left via
 *        Framer Motion AnimatePresence.
 *      • A dark backdrop behind the drawer closes it on tap.
 *      • Navigating to any link also closes the drawer (via onClick on each item).
 *      • Body scroll is locked while the drawer is open.
 *
 * All desktop styling (gradient, active indicator, tooltip, hover expand) is
 * completely untouched.
 */

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { disconnectSocket } from "@/lib/socket";
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
  User,
  Menu,
  X,
} from "lucide-react";

// ─── Nav data ────────────────────────────────────────────────────────────────

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
    icon: User,
    label: "Meetings",
    href: "/dashboard/counselor-dashboard/meetings",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(item, pathname) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/** Returns the page title string for the mobile top bar */
function getMobileTitle(pathname) {
  if (pathname === "/dashboard/counselor-dashboard") return "Dashboard";
  if (pathname === "/dashboard/counselor-dashboard/students") return "Students";
  if (pathname.startsWith("/dashboard/counselor-dashboard/students/"))
    return "Student Profile";
  if (pathname === "/dashboard/counselor-dashboard/khizar-applications")
    return "Applications";
  if (
    pathname.startsWith("/dashboard/counselor-dashboard/khizar-applications/")
  )
    return "Application Details";
  if (pathname === "/dashboard/counselor-dashboard/settings") return "Settings";
  if (pathname === "/dashboard/counselor-dashboard/meetings") return "Meetings";
  return "Counselor";
}

// ─── Desktop SidebarItem (unchanged) ─────────────────────────────────────────

function SidebarItem({ icon: Icon, label, href, expanded, active, onClick }) {
  return (
    <Link href={href} onClick={onClick}>
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

        {/* Icon */}
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

        {/* Label */}
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

        {/* Tooltip (collapsed only) */}
        {!expanded && (
          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-slate-100 text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 shadow-2xl border border-slate-700">
            {label}
          </div>
        )}
      </motion.div>
    </Link>
  );
}

// ─── Mobile drawer nav item ───────────────────────────────────────────────────

function DrawerItem({ icon: Icon, label, href, active, onNavigate }) {
  return (
    <Link href={href} onClick={onNavigate}>
      <div
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-150
          ${
            active
              ? "bg-sky-500/15 border border-sky-500/25 text-sky-300"
              : "text-slate-400 hover:text-sky-300 hover:bg-sky-950/40 border border-transparent"
          }`}
      >
        {/* Active pill */}
        <div
          className={`w-1 h-7 rounded-full shrink-0 transition-all ${
            active ? "bg-sky-400" : "bg-transparent"
          }`}
        />
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
            active ? "bg-sky-500/10" : ""
          }`}
        >
          <Icon size={22} strokeWidth={2.1} />
        </div>
        <span className="text-[15px] font-semibold tracking-wide">{label}</span>
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CounselorSidebar() {
  // ── All hooks declared first — no early returns before this block ──────────
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Desktop hover expand
  const [expanded, setExpanded] = useState(false);

  // Mobile drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close drawer on route change (back button, link navigation, etc.)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ── Guard after all hooks ──────────────────────────────────────────────────
  if (!user) return null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    setMobileOpen(false);
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    disconnectSocket();
    dispatch(logout());
    router.replace("/login");
  };

  const handleNavigate = () => setMobileOpen(false);

  const mobileTitle = getMobileTitle(pathname);

  // User initials for avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "KO";

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP SIDEBAR  (hidden on mobile via `hidden lg:flex`)
          Identical to original — hover expand, tooltips, active indicator.
          Only addition: `onClick={handleNavigate}` passed to each SidebarItem
          so closing the drawer also works if ever rendered on desktop.
      ══════════════════════════════════════════════════════════════════════ */}
      <motion.aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        animate={{ width: expanded ? 270 : 82 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="
          hidden lg:flex
          fixed top-0 left-0 z-40 h-screen flex-col overflow-hidden will-change-[width]
          bg-gradient-to-b from-[#070d1a] via-[#0b1220] to-[#0d1530]
          border-r border-sky-900/30 shadow-[4px_0_24px_rgba(0,0,0,0.4)]
        "
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
          className="flex-1 px-3 py-5 space-y-2 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              expanded={expanded}
              active={isActive(item, pathname)}
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
              active={isActive(item, pathname)}
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

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE TOP BAR  (visible only on <lg screens)
          Shows: hamburger | logo + page title | user avatar
      ══════════════════════════════════════════════════════════════════════ */}
      <header
        className="
          lg:hidden
          fixed top-0 left-0 right-0 z-40 h-14
          flex items-center justify-between px-4
          bg-gradient-to-r from-[#070d1a] to-[#0b1220]
          border-b border-sky-900/30
          shadow-[0_2px_16px_rgba(0,0,0,0.4)]
        "
      >
        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-sky-300 hover:bg-sky-950/40 transition-all"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={2} />
        </button>

        {/* Logo + Page title */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-[10px] shadow">
            OA
          </div>
          <span className="text-slate-200 font-bold text-[15px] tracking-tight">
            {mobileTitle}
          </span>
        </div>

        {/* User avatar — taps to open drawer too */}
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500/30 to-indigo-600/30 border border-sky-500/30 flex items-center justify-center text-sky-300 font-bold text-xs transition-all hover:border-sky-400/50"
          aria-label="Open menu"
        >
          {initials}
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE DRAWER OVERLAY
          AnimatePresence handles mount/unmount with slide animation.
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="
                lg:hidden
                fixed top-0 left-0 z-50 h-full w-[300px] max-w-[85vw]
                flex flex-col
                bg-gradient-to-b from-[#070d1a] via-[#0b1220] to-[#0d1530]
                border-r border-sky-900/30
                shadow-[8px_0_40px_rgba(0,0,0,0.6)]
                overflow-hidden
              "
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-sky-900/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                    OA
                  </div>
                  <div>
                    <p className="text-sky-400 font-extrabold text-sm tracking-wide leading-none">
                      OVERSEAS
                    </p>
                    <p className="text-slate-500 text-[10px] font-semibold tracking-widest mt-0.5">
                      COUNSELOR
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              {/* User identity strip */}
              <div className="px-5 py-4 border-b border-sky-900/15 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/30 to-indigo-600/30 border border-sky-500/30 flex items-center justify-center text-sky-300 font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-200 font-semibold text-[13px] truncate leading-tight">
                      {user?.name || "Counselor"}
                    </p>
                    <p className="text-slate-500 text-[11px] truncate mt-0.5">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav items */}
              <nav
                className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {menuItems.map((item) => (
                  <DrawerItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={isActive(item, pathname)}
                    onNavigate={handleNavigate}
                  />
                ))}
              </nav>

              {/* Divider */}
              <div className="px-5 mb-2">
                <div className="h-px bg-sky-900/25" />
              </div>

              {/* Bottom items (Settings) */}
              <div className="px-3 pb-2 space-y-1">
                {bottomItems.map((item) => (
                  <DrawerItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={isActive(item, pathname)}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>

              {/* Logout */}
              <div className="px-3 pb-8 pt-2 border-t border-sky-900/20 shrink-0">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400/80 hover:text-red-300 hover:bg-red-950/30 transition-all duration-200 border border-transparent hover:border-red-900/30"
                >
                  {/* Spacer to align with DrawerItem pill */}
                  <div className="w-1 h-7 shrink-0" />
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl">
                    <LogOut size={22} strokeWidth={1.8} />
                  </div>
                  <span className="text-[15px] font-semibold">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
