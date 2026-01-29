"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminSidebar() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

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
          overflow-hidden
        `}
      >
        {/* Header / Logo */}
        <div className="px-4 pt-7 pb-10">
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

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1.5">
          <SidebarItem icon="🏠" label="Dashboard" expanded={expanded} />
          <SidebarItem icon="👥" label="Users" expanded={expanded} />
          <SidebarItem icon="📱" label="Devices" expanded={expanded} />
          <SidebarItem icon="📋" label="Logs" expanded={expanded} />
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 mt-auto">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
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

      {/* 
        Invisible spacer that grows/shrinks together with sidebar 
        → prevents main content from being overlapped / jumped
      */}
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

function SidebarItem({ icon, label, expanded }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, x: expanded ? 4 : 0 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center gap-3
        px-3 py-3 rounded-xl cursor-pointer
        text-slate-300 hover:text-sky-400
        hover:bg-sky-950/30 active:bg-sky-950/50
        transition-all duration-200
        text-sm font-medium
        whitespace-nowrap overflow-hidden
      `}
    >
      <span className="text-xl min-w-[24px]">{icon}</span>
      {expanded && <span>{label}</span>}
    </motion.div>
  );
}