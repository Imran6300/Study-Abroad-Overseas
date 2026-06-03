"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { disconnectSocket } from "@/lib/socket";

export default function AdminSidebar() {
  const user = useSelector((state) => state.auth.user);
  if (!user) return null;

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const Handlelogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    disconnectSocket();

    dispatch(logout());
    router.replace("/login");
  };

  const menuItems = [
    // Visible to everyone
    {
      icon: "🏠",
      label: "Dashboard",
      href: "/dashboard/admin-dashboard",
      roles: ["admin", "super_admin"],
    },

    // Student & Case Management (counselors need these)
    {
      icon: "👨‍🎓",
      label: "Students",
      href: "/admin/students",
      roles: ["counselor", "admin", "super_admin"],
    },

    // Staff & Team Management (admin level)
    {
      icon: "🧑‍🏫",
      label: "Counselors",
      href: "/admin/counselors",
      roles: ["admin", "super_admin"],
    },

    {
      icon: "📂",
      label: "Khizar Applications",
      href: "/admin/khizar-applications",
      roles: ["admin", "super_admin"],
    },

    // Content / Master Data (editor role)
    {
      icon: "🏫",
      label: "Universities",
      href: "/admin/universities",
      roles: ["editor", "admin", "super_admin"],
    },
    {
      icon: "📚",
      label: "Courses",
      href: "/admin/courses",
      roles: ["editor", "admin", "super_admin"],
    },
    {
      icon: "✨",
      label: "Success Stories",
      href: "/admin/success-stories",
      roles: ["editor", "admin", "super_admin"],
    },
    {
      icon: "🌍",
      label: "Countries",
      href: "/admin/countries",
      roles: ["editor", "admin", "super_admin"],
    },
    {
      icon: "📰",
      label: "Blog",
      href: "/admin/blog",
      roles: ["editor", "admin", "super_admin"],
    },

    // Analytics & Admin-only
    {
      icon: "💰",
      label: "Revenue",
      href: "/admin/revenue",
      roles: ["admin", "super_admin"],
    },
    {
      icon: "📊",
      label: "Reports",
      href: "/admin/reports",
      roles: ["admin", "super_admin"],
    },
    {
      icon: "📋",
      label: "Logs",
      href: "/admin/logs",
      roles: ["admin", "super_admin"],
    },
  ];

  const filteredMenu = menuItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

  return (
    <>
      <motion.aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        animate={{ width: expanded ? 260 : 68 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 28,
        }}
        className={`
          fixed top-0 left-0 z-40
          h-screen
          bg-gradient-to-b from-[#0b1220] to-[#0f1a36]
          border-r border-sky-600/20
          text-slate-300
          flex flex-col
          shadow-2xl shadow-black/40
          overflow-hidden           // keep this - prevents sidebar itself from scrolling weirdly
        `}
      >
        {/* Header / Logo - fixed at top */}
        <div className="px-4 pt-7 pb-10 shrink-0">
          <motion.h2
            initial={false}
            animate={{ opacity: expanded ? 1 : 0.9 }}
            className={`
              text-xl font-bold tracking-wider
              ${expanded ? "text-sky-400" : "text-sky-500"}
              whitespace-nowrap
            `}
          >
            {expanded ? "OVERSEAS ADMIN" : "OA"}
          </motion.h2>
        </div>

        <nav
          className={`
    flex-1 px-3 space-y-1.5
    ${expanded ? "overflow-y-auto scrollbar-thin ..." : "overflow-hidden"}
  `}
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge legacy
          }}
        >
          {filteredMenu.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              expanded={expanded}
              isActive={
                pathname === item.href || pathname.startsWith(item.href + "/")
              }
            />
          ))}
        </nav>

        {/* Logout - fixed at bottom */}
        <div className="px-3 pb-6 mt-auto shrink-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={Handlelogout}
            className={`
              w-full flex items-center gap-3
              px-3 py-3 rounded-xl
              text-red-400 hover:text-red-300
              hover:bg-red-950/40
              transition-colors duration-200
              text-sm font-medium
            `}
          >
            <span className="text-xl min-w-[24px]">⏻</span>
            {expanded && <span>Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Spacer */}
      <div
        className={`
          hidden md:block
          transition-all duration-300
          ${expanded ? "w-[260px]" : "w-[68px]"}
        `}
      />
    </>
  );
}

function SidebarItem({ icon, label, href, expanded, isActive = false }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.03, x: expanded ? 4 : 0 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center gap-3
          px-3 py-3 rounded-xl cursor-pointer
          text-sm font-medium
          whitespace-nowrap overflow-hidden
          transition-all duration-200
          ${
            isActive
              ? "bg-sky-900/40 text-sky-300"
              : "text-slate-300 hover:text-sky-400 hover:bg-sky-950/30 active:bg-sky-950/50"
          }
        `}
      >
        <span className="text-xl min-w-[24px]">{icon}</span>
        {expanded && <span>{label}</span>}
      </motion.div>
    </Link>
  );
}
