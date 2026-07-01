"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/userdashboard/BrandedSidebar.jsx
//
// Replaces the old DashboardSidebar.
// Reads counselor branding from Redux → applies brand name, logo, colors.
// Falls back to Khizar Overseas defaults if no counselor assigned.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectActiveBranding } from "@/store/brandingSlice";
import Image from "next/image";

const NAV_LINKS = [
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

  {
    href: "/dashboard/user/counseling",
    label: "Counseling Sessions",
    icon: "💬",
  },

  { href: "/dashboard/user/settings", label: "Settings", icon: "⚙️" },
];

export default function BrandedSidebar({ isCounselorStudent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const branding = useSelector(selectActiveBranding);

  const primary = branding.primaryColor || "#22c55e";
  const bgColor = branding.secondaryColor || "#0A192F";
  const accent = branding.accentColor || "#ffffff";
  const brandName = branding.brandName || "Khizar Overseas";
  const tagline = branding.tagline || "";
  const logo = branding.logo || "";

  const isActive = (href) =>
    href === "/dashboard/user" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile toggle button */}
      {/*
        FIX: was `absolute top-4 left-4 z-[100]`.
        The main site Header (nav-bar.jsx) renders a fixed, opaque, full-width
        bar (h-[85px]) inside a z-[1000] wrapper. That completely covered this
        button — both visually and for clicks — whenever Header is shown,
        i.e. for a plain (non-counselor) Khizar Overseas student. Counselor/org
        students never noticed because their layout hides the main Header.
        Fix: use `fixed` (not `absolute`, so it doesn't scroll away), push it
        below the 85px header when Header is present, and give it a z-index
        above the header's z-[1000] as a safety margin.
      */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`lg:hidden fixed left-4 z-[1050] w-10 h-10 flex items-center justify-center rounded-lg text-black text-lg shadow-md ${
            isCounselorStudent ? "top-4" : "top-[97px]"
          }`}
          style={{ background: primary }}
        >
          ➜
        </button>
      )}

      {/* Backdrop overlay */}
      {/* z-index raised above the header's z-[1000] — same reasoning as the toggle button above */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1040] lg:hidden"
        />
      )}

      {/* Sidebar */}
      {/*
        z-index is elevated ONLY below the lg breakpoint (mobile drawer),
        so the open mobile sidebar isn't stuck underneath the fixed header.
        At lg+ we revert to the original z-[80] — on desktop the sidebar and
        header intentionally overlap in the top-left corner, with the header
        painting on top (z-[1000]). Elevating z-index at lg+ too would make
        the sidebar cover the header's logo/nav there instead, which is the
        desktop regression this fixes.
      */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72
          ${isCounselorStudent ? "pt-10" : "pt-24"}
          border-r transform transition-transform duration-300 z-[1045] lg:z-[80]
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        style={{
          background: `color-mix(in srgb, ${bgColor} 95%, white 5%)`,
          borderColor: `${primary}20`,
        }}
      >
        {/* Brand header */}
        <div
          className="flex items-center justify-between px-5 pb-5"
          style={{ borderBottom: `1px solid ${primary}20` }}
        >
          <div className="flex items-center gap-3">
            {/* Logo or initials */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                background: logo ? "transparent" : `${primary}22`,
                border: `1px solid ${primary}44`,
              }}
            >
              {logo ? (
                <img
                  src={logo}
                  alt={brandName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-black" style={{ color: primary }}>
                  {brandName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h2
                className="text-base font-bold leading-none"
                style={{ color: primary }}
              >
                {brandName}
              </h2>
              {tagline && (
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: `${accent}55` }}
                >
                  {tagline}
                </p>
              )}
            </div>
          </div>

          {/* Close on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-sm"
            style={{ color: `${accent}66` }}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100%-110px)] overflow-y-auto px-3 py-4 space-y-1 sidebar-scroll">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium"
                style={{
                  background: active ? `${primary}18` : "transparent",
                  color: active ? accent : `${accent}66`,
                  border: active
                    ? `1px solid ${primary}30`
                    : "1px solid transparent",
                }}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom plan badge */}
        {branding.plan === "premium" && (
          <div
            className="absolute bottom-4 left-3 right-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <span className="text-xs">⭐</span>
            <span className="text-[11px] font-semibold text-amber-400">
              {brandName} Premium
            </span>
          </div>
        )}
      </aside>
    </>
  );
}
