"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/dashboard/user", label: "Dashboard", icon: "🏠" },
    { href: "/dashboard/user/applications", label: "Applications", icon: "🎓" },
    {
      href: "/dashboard/user/saved-universities",
      label: "Saved Universities",
      icon: "⭐",
    },
    { href: "/dashboard/user/deadlines", label: "Deadlines", icon: "⏰" },
    { href: "/dashboard/user/documents", label: "Documents", icon: "📄" },
    { href: "/dashboard/user/visa", label: "Visa Progress", icon: "🛂" },

    // { href: "/dashboard/user/scholarships", label: "Scholarships", icon: "💰" },
    { href: "/dashboard/user/settings", label: "Settings", icon: "⚙️" },
  ];

  const isActive = (href) => {
    if (href === "/dashboard/user") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button – only when sidebar is closed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden absolute top-20 left-4 z-[100] 
    w-10 h-10 flex items-center justify-center 
    rounded-lg bg-[#32CD32] text-black text-lg shadow-md"
        >
          ➜
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
  fixed top-0 left-0
  h-screen w-72
  pt-24
  bg-[#0F1C3A] border-r border-white/10
  transform transition-transform duration-300
  z-[80]
  ${open ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0
`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-[#32CD32]">Khizar</h2>
            <p className="text-xs text-gray-400">Overseas</p>
          </div>

          {/* Close button mobile */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100%-150px)] overflow-y-auto px-4 py-4 space-y-2 sidebar-scroll">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${
                isActive(link.href)
                  ? "bg-[#32CD32]/15 text-[#32CD32] border border-[#32CD32]/20"
                  : "text-gray-300 hover:bg-white/10"
              }
            `}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Upgrade CTA */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/pricing"
            className="block text-center bg-[#32CD32]/20 text-[#32CD32] py-3 rounded-xl font-semibold hover:bg-[#32CD32]/30 transition"
          >
            Upgrade Plan 🚀
          </Link>
        </div>
      </aside>
    </>
  );
}
