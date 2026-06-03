"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/userdashboard/CounselorBrandedBanner.jsx
//
// A welcoming banner shown at the top of the student's dashboard overview
// ONLY when they are a counselor's student and branding is enabled.
// Shows the counselor's logo, brand name, tagline, and a greeting.
// ─────────────────────────────────────────────────────────────────────────────

export default function CounselorBrandedBanner({ branding }) {
  if (!branding || !branding.brandingEnabled) return null;

  const primary = branding.primaryColor || "#22c55e";
  const accent = branding.accentColor || "#ffffff";
  const bgColor = branding.secondaryColor || "#0A192F";
  const brandName = branding.brandName || "Khizar Overseas";
  const tagline = branding.tagline || "";
  const logo = branding.logo || "";

  return (
    <div
      className="w-full rounded-2xl px-5 py-4 flex items-center gap-4"
      style={{
        background: `linear-gradient(135deg, ${primary}14 0%, ${primary}06 100%)`,
        border: `1px solid ${primary}28`,
      }}
    >
      {/* Logo or initials */}
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          background: logo ? "transparent" : `${primary}22`,
          border: `1.5px solid ${primary}44`,
        }}
      >
        {logo ? (
          <img
            src={logo}
            alt={brandName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-black" style={{ color: primary }}>
            {brandName.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-0.5"
          style={{ color: `${primary}99` }}
        >
          Your counselor
        </p>
        <p
          className="text-base font-bold leading-tight"
          style={{ color: accent }}
        >
          {brandName}
        </p>
        {tagline && (
          <p className="text-xs" style={{ color: `${accent}55` }}>
            {tagline}
          </p>
        )}
      </div>

      {/* Badge */}
      <div className="ml-auto flex-shrink-0">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={{
            background: `${primary}18`,
            color: primary,
            border: `1px solid ${primary}33`,
          }}
        >
          ✓ Verified Partner
        </span>
      </div>
    </div>
  );
}
