"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/userdashboard/BrandedFooter.jsx
//
// Reads branding from Redux.
// - If removeKhizarBranding = true (premium): shows counselor's custom footerText
// - Otherwise: shows "Powered by Khizar Overseas"
// ─────────────────────────────────────────────────────────────────────────────

import { useSelector } from "react-redux";
import { selectActiveBranding } from "@/store/brandingSlice";

export default function BrandedFooter() {
  const branding = useSelector(selectActiveBranding);

  const primary = branding.primaryColor || "#22c55e";
  const bgColor = branding.secondaryColor || "#0A192F";
  const accent = branding.accentColor || "#ffffff";
  const brandName = branding.brandName || "Khizar Overseas";
  const tagline =
    branding.tagline || "Study Abroad CRM & Student Management Platform";
  const footerText = branding.footerText || `Powered by ${brandName}`;
  const removeKhizar = branding.removeKhizarBranding;

  const displayedPoweredBy = removeKhizar
    ? footerText // custom footer (e.g. "Powered by ABC Overseas")
    : "Powered by Khizar Overseas";

  return (
    <footer
      className="lg:ml-72"
      style={{
        borderTop: `1px solid ${primary}15`,
        background: `${bgColor}cc`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: `${accent}44` }}
            >
              Powered By
            </p>
            <h3 className="text-lg font-bold" style={{ color: primary }}>
              {removeKhizar ? brandName : "Khizar Overseas"}
            </h3>
            <p className="text-sm" style={{ color: `${accent}55` }}>
              {removeKhizar
                ? tagline
                : "Study Abroad CRM & Student Management Platform"}
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm" style={{ color: `${accent}55` }}>
              Helping students and counselors manage applications, documents,
              deadlines, and visas.
            </p>
            <p className="mt-1 text-xs" style={{ color: `${accent}33` }}>
              {displayedPoweredBy} · © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
