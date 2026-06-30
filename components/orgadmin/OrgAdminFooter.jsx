"use client";

/**
 * components/orgadmin/OrgAdminFooter.jsx
 *
 * Standalone dark-themed footer for the Organisation Admin dashboard.
 *
 * Features:
 *  - Fully dark to match the org-admin palette (#081525 / #0A192F) with emerald accents
 *  - Branding-aware: reads org.features.removeKhizarBranding and org.branding.footerText
 *    from Redux (orgAdmin slice) to decide what to show in the copyright strip
 *  - Four columns: Brand, Quick Links, Resources, Contact
 *  - Links to every page in the org-admin dashboard
 *  - Manual link included (org-admin/manual)
 *  - Respects white-label: custom footer text replaces "Powered by Khizar Overseas"
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Settings,
  BookOpen,
  Mail,
  Globe,
  ExternalLink,
  Shield,
  Building2,
  HelpCircle,
  Zap,
} from "lucide-react";

// ─── Link definitions ──────────────────────────────────────────────────────────

const QUICK_LINKS = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/dashboard/org-admin",
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
  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/org-admin/settings",
  },
];

const RESOURCE_LINKS = [
  {
    icon: BookOpen,
    label: "Dashboard Manual",
    href: "/dashboard/org-admin/manual",
    external: false,
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
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
    icon: FileText,
    label: "Refund Policy",
    href: "/dashboard/counselor-dashboard/refund-policy",
    external: false,
  },
];

// ─── Reusable link item ────────────────────────────────────────────────────────

function FooterLink({ icon: Icon, label, href, external }) {
  return (
    <li>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-2 text-white/30 hover:text-emerald-400 text-[12px] font-medium transition-colors duration-150 group"
      >
        <Icon
          size={12}
          strokeWidth={2}
          className="shrink-0 text-white/20 group-hover:text-emerald-500 transition-colors"
        />
        <span>{label}</span>
        {external && (
          <ExternalLink
            size={9}
            strokeWidth={2}
            className="opacity-0 group-hover:opacity-60 transition-opacity"
          />
        )}
      </Link>
    </li>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────────

function ColHead({ children }) {
  return (
    <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase mb-3">
      {children}
    </p>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function OrgAdminFooter() {
  const org = useSelector((state) => state.orgAdmin?.organization);
  const removeKhizar = org?.features?.removeKhizarBranding ?? false;
  const footerText = org?.branding?.footerText ?? "";
  const orgName = org?.name ?? "Your Organisation";

  const year = new Date().getFullYear();

  // If white-labelled and no footer text set → render nothing
  if (removeKhizar && !footerText) return null;

  return (
    <footer className="mt-auto border-t border-white/[0.05] bg-[#060d1a]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Top grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* ── Brand column ───────────────────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shrink-0">
                <Building2 size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-emerald-400 font-extrabold text-sm tracking-wide leading-none">
                  {removeKhizar ? orgName.toUpperCase() : "KHIZAR OVERSEAS"}
                </p>
                <p className="text-white/20 text-[10px] font-semibold tracking-widest mt-0.5">
                  ORGANISATION PLATFORM
                </p>
              </div>
            </div>

            <p className="text-white/20 text-[11px] leading-relaxed">
              White-label CRM for overseas education agencies. Manage your
              counselors, students, and applications — all under your brand.
            </p>

            {/* Live badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-900/60 bg-emerald-950/50 text-emerald-500 text-[10px] font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Platform v2.0
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] text-white/25 text-[10px] font-semibold">
                <Zap size={8} strokeWidth={2.5} />
                Multi-tenant
              </span>
            </div>
          </div>

          {/* ── Quick Links ─────────────────────────────────────────────────── */}
          <div>
            <ColHead>Quick Links</ColHead>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </div>

          {/* ── Resources ───────────────────────────────────────────────────── */}
          <div>
            <ColHead>Resources</ColHead>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </div>

          {/* ── Legal ───────────────────────────────────────────────────────── */}
          <div>
            <ColHead>Legal</ColHead>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>

            <div className="mt-5 pt-4 border-t border-white/[0.04]">
              <a
                href="mailto:support@khizaroverseas.in"
                className="flex items-center gap-1.5 text-white/25 hover:text-emerald-400 text-[11px] font-medium transition-colors group"
              >
                <Mail
                  size={11}
                  className="group-hover:text-emerald-500 transition-colors"
                />
                support@khizaroverseas.in
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.05] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Copyright — branding-aware */}
          {removeKhizar ? (
            <p className="text-white/20 text-[11px]">
              © {year}{" "}
              <span className="text-white/35 font-semibold">{orgName}</span> —
              All rights reserved.
            </p>
          ) : (
            <p className="text-white/20 text-[11px]">
              © {year}{" "}
              <span className="text-emerald-600 font-semibold">
                {footerText || "Khizar Overseas"}
              </span>{" "}
              — All rights reserved.
            </p>
          )}

          <div className="flex items-center gap-4">
            <p className="text-white/15 text-[11px]">
              Built for overseas education agencies in India.
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/[0.06] bg-white/[0.03] text-white/20 text-[10px] font-semibold tracking-wide">
              <Shield size={8} strokeWidth={2.5} />
              SOC-ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
