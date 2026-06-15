"use client";

/**
 * components/counselordashboard/CounselorFooter.jsx
 *
 * Adaptive footer for the Counselor Dashboard.
 *
 * Theme behaviour:
 *  - Settings page  (/dashboard/counselor-dashboard/settings)
 *    → dark theme: bg #060b17, text slate-400/500, borders sky-900/20
 *      (matches the settings page's own `background: "#060b17"` inline style)
 *
 *  - All other pages
 *    → light theme: bg white, border-t slate-100, text slate-500/600
 *      (matches the rest of the dashboard that sits on bg-gray-50 / white cards)
 *
 * No extra dependencies — uses usePathname() from next/navigation and lucide-react
 * icons that are already present in the project.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Shield,
  Scale,
  Handshake,
  HelpCircle,
  Mail,
  Globe,
  ExternalLink,
  BookOpen,
} from "lucide-react";

// ─── Link data ────────────────────────────────────────────────────────────────

const LEGAL_LINKS = [
  {
    icon: FileText,
    label: "Terms of Service",
    href: "/dashboard/counselor-dashboard/terms-of-service",
    external: false,
  },
  {
    icon: Shield,
    label: "Privacy Policy",
    href: "/dashboard/counselor-dashboard/privacy-policy",
    external: false,
  },
  {
    icon: Scale,
    label: "Refund Policy",
    href: "/dashboard/counselor-dashboard/refund-policy",
    external: false,
  },
  {
    icon: Handshake,
    label: "Partner Agreement",
    href: "/dashboard/counselor-dashboard/partner-agreement",
    external: false,
  },
];

const SUPPORT_LINKS = [
  {
    icon: BookOpen,
    label: "Dashboard Manual",
    href: "/dashboard/counselor-dashboard/manual",
    external: false,
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    href: "/dashboard/counselor-dashboard/support",
    external: false,
  },
  {
    icon: Mail,
    label: "Contact Us",
    href: "mailto:support@khizaroverseas.in",
    external: true,
  },
  {
    icon: Globe,
    label: "khizaroverseas.in",
    href: "https://khizaroverseas.in",
    external: true,
  },
];

const SETTINGS_ROUTE = "/dashboard/counselor-dashboard/settings";

// ─── Theme token maps ─────────────────────────────────────────────────────────

const DARK = {
  wrapper: "border-t border-sky-900/20 bg-[#060b17]",
  logoMark:
    "w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-[10px] shadow shrink-0",
  logoText: "text-sky-400 font-extrabold text-sm tracking-wide leading-none",
  logoSub: "text-slate-600 text-[10px] font-semibold tracking-widest mt-0.5",
  tagline: "text-slate-600 text-[11px] mt-1 leading-relaxed",
  sectionTitle:
    "text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-3",
  link: "flex items-center gap-2 text-slate-500 hover:text-sky-400 text-[12px] font-medium transition-colors duration-150 group",
  icon: "shrink-0 text-slate-700 group-hover:text-sky-500 transition-colors",
  divider: "border-t border-sky-900/20",
  bottomText: "text-slate-700 text-[11px]",
  bottomAccent: "text-sky-600 font-semibold",
  badge:
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-sky-900/40 bg-sky-950/40 text-sky-600 text-[10px] font-semibold tracking-wide",
  externalIcon: "opacity-0 group-hover:opacity-100 transition-opacity",
};

const LIGHT = {
  wrapper: "border-t border-slate-100 bg-white",
  logoMark:
    "w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-[10px] shadow shrink-0",
  logoText: "text-sky-600 font-extrabold text-sm tracking-wide leading-none",
  logoSub: "text-slate-400 text-[10px] font-semibold tracking-widest mt-0.5",
  tagline: "text-slate-400 text-[11px] mt-1 leading-relaxed",
  sectionTitle:
    "text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-3",
  link: "flex items-center gap-2 text-slate-500 hover:text-sky-600 text-[12px] font-medium transition-colors duration-150 group",
  icon: "shrink-0 text-slate-300 group-hover:text-sky-500 transition-colors",
  divider: "border-t border-slate-100",
  bottomText: "text-slate-400 text-[11px]",
  bottomAccent: "text-sky-500 font-semibold",
  badge:
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-sky-100 bg-sky-50 text-sky-500 text-[10px] font-semibold tracking-wide",
  externalIcon: "opacity-0 group-hover:opacity-100 transition-opacity",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CounselorFooter() {
  const pathname = usePathname();
  const isSettings = pathname === SETTINGS_ROUTE;
  const t = isSettings ? DARK : DARK;

  const year = new Date().getFullYear();

  return (
    <footer className={`${t.wrapper} mt-auto`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Top row ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={t.logoMark}>OA</div>
              <div>
                <p className={t.logoText}>KHIZAR OVERSEAS</p>
                <p className={t.logoSub}>COUNSELOR PLATFORM</p>
              </div>
            </div>
            <p className={t.tagline}>
              Empowering education counselors to manage students, applications
              and visa journeys — all in one place.
            </p>

            {/* Platform version badge */}
            <div className="mt-4">
              <span className={t.badge}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Platform v2.0
              </span>
            </div>
          </div>

          {/* Spacer on desktop */}
          <div className="hidden lg:block" />

          {/* Legal column */}
          <div>
            <p className={t.sectionTitle}>Legal</p>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(({ icon: Icon, label, href, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={t.link}
                  >
                    <Icon size={13} strokeWidth={2} className={t.icon} />
                    <span>{label}</span>
                    {external && (
                      <ExternalLink
                        size={10}
                        strokeWidth={2}
                        className={t.externalIcon}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <p className={t.sectionTitle}>Support</p>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map(({ icon: Icon, label, href, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={t.link}
                  >
                    <Icon size={13} strokeWidth={2} className={t.icon} />
                    <span>{label}</span>
                    {external && (
                      <ExternalLink
                        size={10}
                        strokeWidth={2}
                        className={t.externalIcon}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div
          className={`${t.divider} pt-5 flex flex-col sm:flex-row items-center justify-between gap-3`}
        >
          <p className={t.bottomText}>
            © {year} <span className={t.bottomAccent}>Khizar Overseas</span> —
            All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <p className={t.bottomText}>
              Built for overseas education counselors in India.
            </p>
            {/* Subtle compliance note */}
            <span className={t.badge}>
              <Shield size={9} strokeWidth={2.5} />
              SOC-ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
