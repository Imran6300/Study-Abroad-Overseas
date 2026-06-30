"use client";

/**
 * app/dashboard/org-admin/settings/page.jsx
 *
 * Organisation Settings — fully implemented:
 *   - Organisation Info (name, phone, website, city, state, address)
 *   - Logo upload with preview, replace, delete (Cloudinary via backend)
 *   - Brand Identity (brand name, tagline, footer text)
 *   - Dashboard Colors (primary, background, accent) with live preview
 *   - White-Label Feature Toggles:
 *       • Custom Dashboard Colors
 *       • Remove Khizar Overseas Footer  ← actually persists + applies
 *       • Custom Email Branding          ← actually persists + applies
 *   - Email Branding section (shown when customEmailBranding is ON):
 *       • Support email, reply-to, website, signature
 *       (stored in org branding, used by mail service at send-time)
 *   - Live Brand Preview (updates as you type — no save needed)
 *   - Save Changes persists EVERYTHING including features + email branding
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrganization,
  updateOrganization,
  uploadOrgLogo,
  deleteOrgLogo,
  selectOrganization,
  selectOrgAdminLoading,
} from "@/store/orgAdminSlice";
import {
  Building2,
  Palette,
  ToggleLeft,
  Upload,
  Trash2,
  Mail,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const INPUT = {
  width: "100%",
  background: "#070c18",
  border: "1px solid #0f1c31",
  borderRadius: 9,
  padding: "10px 13px",
  color: "#d0daf0",
  fontSize: 13.5,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const CARD = {
  background: "#090f1e",
  border: "1px solid #0e1d36",
  borderRadius: 14,
  padding: "22px",
  marginBottom: 16,
};

function SectionHead({ icon: Icon, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
      }}
    >
      {Icon && <Icon size={15} color="#2563eb" />}
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#1e3050",
          textTransform: "uppercase",
          letterSpacing: ".14em",
        }}
      >
        {children}
      </div>
      <div
        style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(90deg,#0e1d36,transparent)",
        }}
      />
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 10.5,
          fontWeight: 700,
          color: "#3d5a7e",
          textTransform: "uppercase",
          letterSpacing: ".08em",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p
          style={{
            fontSize: 11,
            color: "#1e3454",
            marginTop: 4,
            lineHeight: 1.5,
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function ToggleRow({ icon, title, desc, on, onChange, badge }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        padding: "12px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontSize: 17,
            width: 22,
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#b0c4de",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {title}
            {badge && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#2563eb",
                  background: "#1e3a8a22",
                  border: "1px solid #2563eb44",
                  borderRadius: 4,
                  padding: "1px 6px",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: "#2a3f5e",
              marginTop: 2,
              lineHeight: 1.5,
            }}
          >
            {desc}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onChange}
        role="switch"
        aria-checked={on}
        style={{
          width: 42,
          height: 23,
          borderRadius: 99,
          border: "none",
          background: on ? "#1d4ed8" : "#0f1c31",
          cursor: "pointer",
          position: "relative",
          flexShrink: 0,
          transition: "background .2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            width: 17,
            height: 17,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,.4)",
            transition: "transform .2s",
            transform: on ? "translateX(20px)" : "translateX(3px)",
          }}
        />
      </button>
    </div>
  );
}

// ─── Live Brand Preview ───────────────────────────────────────────────────────

function BrandPreview({ branding, orgName, logoUrl }) {
  const primary = branding.primaryColor || "#22c55e";
  const bg = branding.secondaryColor || "#0A192F";
  const accent = branding.accentColor || "#ffffff";
  const brand = branding.brandName || orgName || "Your Org";

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #1a2744",
        background: bg,
        fontSize: 11,
        userSelect: "none",
        boxShadow: "0 16px 48px rgba(0,0,0,.5)",
      }}
    >
      {/* Nav */}
      <div
        style={{
          background: bg,
          borderBottom: `1px solid ${primary}22`,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Logo or initials */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: `${primary}22`,
              border: `1px solid ${primary}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 800,
              color: primary,
            }}
          >
            {brand.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div style={{ fontSize: 11, fontWeight: 700, color: accent }}>
          {brand}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 9, color: `${accent}55` }}>
          Dashboard · Students · Settings
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: accent,
            marginBottom: 4,
          }}
        >
          Organisation Overview
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 6,
          }}
        >
          {["Students", "Counselors", "Applications"].map((l, i) => (
            <div
              key={l}
              style={{
                background: `${accent}08`,
                border: `1px solid ${primary}18`,
                borderRadius: 8,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: accent }}>
                {[142, 6, 38][i]}
              </div>
              <div style={{ fontSize: 9, color: `${accent}55`, marginTop: 2 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {!branding.features?.removeKhizarBranding ? (
        <div
          style={{
            padding: "5px 14px",
            fontSize: 8,
            color: `${accent}33`,
            textAlign: "center",
            borderTop: `1px solid ${primary}15`,
          }}
        >
          {branding.footerText || "Powered by Khizar Overseas"}
        </div>
      ) : branding.footerText ? (
        <div
          style={{
            padding: "5px 14px",
            fontSize: 8,
            color: `${accent}33`,
            textAlign: "center",
            borderTop: `1px solid ${primary}15`,
          }}
        >
          {branding.footerText}
        </div>
      ) : null}
    </div>
  );
}

// ─── Logo Upload Section ──────────────────────────────────────────────────────

function LogoUploader({ currentLogoUrl, onUploaded, onDeleted, loading }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  // Clear local preview once the upload has resolved and org Redux state reflects it
  useEffect(() => {
    if (currentLogoUrl) setPreview(null);
  }, [currentLogoUrl]);
  const [dragOver, setDragOver] = useState(false);

  // When a new file is selected (from input or drop), show preview immediately
  // but don't upload yet — upload fires when user clicks "Upload Logo"
  const [pendingFile, setPendingFile] = useState(null);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum size is 5 MB.");
      return;
    }
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!pendingFile) return;
    onUploaded(pendingFile);
    setPendingFile(null);
    // Don't clear preview here — keep showing local preview until
    // parent's currentLogoUrl updates from Redux (after upload resolves).
    // The useEffect below clears it when currentLogoUrl changes.
  };

  const handleCancel = () => {
    setPendingFile(null);
    setPreview(null);
  };

  const displayUrl = preview || currentLogoUrl;

  return (
    <div>
      {/* Current / Preview */}
      {displayUrl ? (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#070c18",
              border: "1px solid #0f1c31",
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <img
              src={displayUrl}
              alt="Organisation Logo"
              style={{
                width: 64,
                height: 64,
                objectFit: "contain",
                borderRadius: 8,
                border: "1px solid #1a2f52",
                background: "#040810",
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#b0c4de",
                  marginBottom: 4,
                }}
              >
                {preview ? "Preview — not saved yet" : "Current Logo"}
              </div>
              {preview && (
                <div
                  style={{ fontSize: 11, color: "#2a3f5e", marginBottom: 8 }}
                >
                  {pendingFile?.name} ({(pendingFile?.size / 1024).toFixed(0)}{" "}
                  KB)
                </div>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {preview ? (
                  <>
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={loading}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 7,
                        border: "none",
                        background: loading ? "#0f1c31" : "#1d4ed8",
                        color: loading ? "#2a3f5e" : "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {loading ? (
                        <Loader2
                          size={12}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                      ) : (
                        <Upload size={12} />
                      )}
                      {loading ? "Uploading…" : "Upload Logo"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 7,
                        border: "1px solid #0f1c31",
                        background: "transparent",
                        color: "#3d5a7e",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 7,
                        border: "1px solid #1a2f52",
                        background: "transparent",
                        color: "#3d5a7e",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <ImageIcon size={12} />
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={onDeleted}
                      disabled={loading}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 7,
                        border: "1px solid #3f1515",
                        background: "transparent",
                        color: "#ef4444",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: loading ? 0.5 : 1,
                      }}
                    >
                      <Trash2 size={12} />
                      Remove Logo
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Drop zone
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#2563eb" : "#0f1c31"}`,
            borderRadius: 10,
            padding: "28px 20px",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color .15s",
            background: dragOver ? "#0a1525" : "transparent",
            marginBottom: 12,
          }}
        >
          <Upload size={24} color="#1e3454" style={{ margin: "0 auto 8px" }} />
          <div style={{ fontSize: 13, color: "#3d5a7e", fontWeight: 600 }}>
            Drop your logo here or click to browse
          </div>
          <div style={{ fontSize: 11, color: "#1e3050", marginTop: 4 }}>
            PNG, JPG, SVG · Max 5 MB · Recommended: 256×256px
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────

export default function OrgAdminSettingsPage() {
  const dispatch = useDispatch();
  const org = useSelector(selectOrganization);
  const loading = useSelector(selectOrgAdminLoading);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    branding: {
      brandName: "",
      tagline: "",
      primaryColor: "#22c55e",
      secondaryColor: "#0A192F",
      accentColor: "#ffffff",
      footerText: "",
      // Email branding fields stored in branding object
      supportEmail: "",
      replyTo: "",
      signature: "",
    },
    features: {
      customColors: true,
      removeKhizarBranding: false,
      customEmailBranding: false,
    },
  });

  // Fetch org on mount
  useEffect(() => {
    dispatch(fetchOrganization());
  }, [dispatch]);

  // Hydrate form from Redux once loaded
  useEffect(() => {
    if (!org) return;
    setForm({
      name: org.name ?? "",
      phone: org.phone ?? "",
      website: org.website ?? "",
      address: org.address ?? "",
      city: org.city ?? "",
      state: org.state ?? "",
      branding: {
        brandName: org.branding?.brandName ?? "",
        tagline: org.branding?.tagline ?? "",
        primaryColor: org.branding?.primaryColor ?? "#22c55e",
        secondaryColor: org.branding?.secondaryColor ?? "#0A192F",
        accentColor: org.branding?.accentColor ?? "#ffffff",
        footerText: org.branding?.footerText ?? "",
        supportEmail: org.branding?.supportEmail ?? "",
        replyTo: org.branding?.replyTo ?? "",
        signature: org.branding?.signature ?? "",
      },
      features: {
        customColors: org.features?.customColors ?? true,
        removeKhizarBranding: org.features?.removeKhizarBranding ?? false,
        customEmailBranding: org.features?.customEmailBranding ?? false,
      },
    });
  }, [org]);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const setBranding = (field, value) =>
    setForm((prev) => ({
      ...prev,
      branding: { ...prev.branding, [field]: value },
    }));
  const setFeature = (field, value) =>
    setForm((prev) => ({
      ...prev,
      features: { ...prev.features, [field]: value },
    }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await dispatch(updateOrganization(form)).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    } catch (err) {
      setSaveError(err?.message ?? "Save failed. Please try again.");
      setTimeout(() => setSaveError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file) => {
    try {
      await dispatch(uploadOrgLogo(file)).unwrap();
    } catch (err) {
      setSaveError(err?.message ?? "Logo upload failed.");
      setTimeout(() => setSaveError(""), 5000);
    }
  };

  const handleLogoDelete = async () => {
    try {
      await dispatch(deleteOrgLogo()).unwrap();
    } catch (err) {
      setSaveError(err?.message ?? "Logo delete failed.");
      setTimeout(() => setSaveError(""), 5000);
    }
  };

  const isInitialLoading = loading?.organization && !org;
  const isLogoLoading = loading?.logo;

  if (isInitialLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#060b17",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          color: "#2e4570",
          fontSize: 14,
        }}
      >
        <Loader2
          size={20}
          style={{ marginRight: 8, animation: "spin 1s linear infinite" }}
        />
        Loading organisation settings…
      </div>
    );
  }

  const currentLogoUrl = org?.branding?.logo || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b17",
        color: "#c9d4e8",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1a2744; border-radius: 9px; }
        .fi:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,.13) !important; }
        .fi::placeholder { color: #1e3050 !important; }
        .tog-divider { height: 1px; background: #0a1422; margin: 0; }
        .color-swatch {
          display: flex; align-items: center; gap: 9px;
          background: #070c18; border: 1px solid #0f1c31;
          border-radius: 9px; padding: 7px 10px; cursor: pointer;
          transition: border .15s;
        }
        .color-swatch:hover { border-color: #172540; }
        .settings-grid {
          max-width: 1300px;
          margin: 0 auto;
          padding: 28px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: start;
        }
        .preview-col {
          position: sticky;
          top: 24px;
        }
        .btn-p {
          padding: 10px 22px; border-radius: 9px;
          font-size: 13.5px; font-weight: 700;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff; border: none; cursor: pointer;
          transition: all .15s; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-p:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,.3); }
        .btn-p:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .toast {
          position: fixed; bottom: 28px; left: 50%;
          transform: translateX(-50%);
          background: #10b981; color: #fff;
          padding: 11px 24px; border-radius: 9px;
          font-size: 13.5px; font-weight: 700; z-index: 999;
          box-shadow: 0 8px 28px rgba(16,185,129,.4);
          white-space: nowrap; display: flex; align-items: center; gap: 8px;
          animation: slideUp .2s ease;
        }
        .toast-err {
          background: #ef4444;
          box-shadow: 0 8px 28px rgba(239,68,68,.4);
        }
        @keyframes slideUp { from { opacity:0; transform: translateX(-50%) translateY(8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media (max-width: 1100px) { .preview-col { display: none; } }
        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr; padding: 16px 14px 80px; }
          .g2, .g3 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Sticky top bar ───────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(6,11,23,.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #0a1525",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "0 24px",
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e8f0ff" }}>
            Organisation Settings
          </div>
          <button
            className="btn-p"
            style={{ padding: "7px 18px", fontSize: 13 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2
                size={13}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : saved ? (
              <CheckCircle2 size={13} />
            ) : null}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        {/* ── Left: forms ──────────────────────────────────────────────── */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#e8f0ff",
                letterSpacing: "-0.04em",
                marginBottom: 4,
              }}
            >
              Organisation Settings
            </h1>
            <p style={{ fontSize: 13, color: "#2e4570", lineHeight: 1.6 }}>
              Manage your organisation profile and brand appearance for the
              student portal.
            </p>
          </div>

          {/* ── ORG INFO ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <SectionHead icon={Building2}>Organisation Info</SectionHead>
            <div style={CARD}>
              <div className="g2" style={{ marginBottom: 14 }}>
                <Field label="Organisation Name">
                  <input
                    className="fi"
                    style={INPUT}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Acme Overseas"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className="fi"
                    style={INPUT}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </Field>
              </div>

              <div style={{ marginBottom: 14 }}>
                <Field label="Website">
                  <input
                    className="fi"
                    style={INPUT}
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="https://acmeoverseas.com"
                  />
                </Field>
              </div>

              <div className="g2" style={{ marginBottom: 14 }}>
                <Field label="City">
                  <input
                    className="fi"
                    style={INPUT}
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Hyderabad"
                  />
                </Field>
                <Field label="State">
                  <input
                    className="fi"
                    style={INPUT}
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    placeholder="Telangana"
                  />
                </Field>
              </div>

              <Field label="Address">
                <input
                  className="fi"
                  style={INPUT}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="123, Road Name, Area"
                />
              </Field>
            </div>
          </div>

          {/* ── BRANDING ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <SectionHead icon={Palette}>Branding</SectionHead>

            {/* Logo Upload */}
            <div style={CARD}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#e8f0ff",
                  marginBottom: 3,
                }}
              >
                Organisation Logo
              </div>
              <p style={{ fontSize: 12, color: "#2e4570", marginBottom: 14 }}>
                Displayed in the student portal sidebar and all branded
                communications.
              </p>
              <LogoUploader
                currentLogoUrl={currentLogoUrl}
                onUploaded={handleLogoUpload}
                onDeleted={handleLogoDelete}
                loading={isLogoLoading}
              />
            </div>

            {/* Identity */}
            <div style={CARD}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#e8f0ff",
                  marginBottom: 3,
                }}
              >
                Brand Identity
              </div>
              <p style={{ fontSize: 12, color: "#2e4570", marginBottom: 14 }}>
                These appear on the student portal and all communications.
              </p>
              <div className="g2" style={{ marginBottom: 14 }}>
                <Field label="Brand Name">
                  <input
                    className="fi"
                    style={INPUT}
                    value={form.branding.brandName}
                    onChange={(e) => setBranding("brandName", e.target.value)}
                    placeholder="Acme Overseas"
                  />
                </Field>
                <Field label="Tagline">
                  <input
                    className="fi"
                    style={INPUT}
                    value={form.branding.tagline}
                    onChange={(e) => setBranding("tagline", e.target.value)}
                    placeholder="Your Future, Our Expertise"
                  />
                </Field>
              </div>
              <Field
                label="Footer Text"
                hint="Shown at the bottom of the student dashboard. Leave blank to use the default."
              >
                <input
                  className="fi"
                  style={INPUT}
                  value={form.branding.footerText}
                  onChange={(e) => setBranding("footerText", e.target.value)}
                  placeholder="Powered by Acme Overseas"
                />
              </Field>
            </div>

            {/* Colors */}
            <div style={CARD}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#e8f0ff",
                  marginBottom: 3,
                }}
              >
                Dashboard Colors
              </div>
              <p style={{ fontSize: 12, color: "#2e4570", marginBottom: 14 }}>
                Controls the look of the student portal for all your counselors'
                students.
              </p>
              <div className="g3">
                {[
                  {
                    label: "Primary",
                    field: "primaryColor",
                    hint: "Buttons & accents",
                  },
                  {
                    label: "Background",
                    field: "secondaryColor",
                    hint: "Sidebar & BG",
                  },
                  {
                    label: "Text / Accent",
                    field: "accentColor",
                    hint: "Main text color",
                  },
                ].map(({ label, field, hint }) => (
                  <div key={field} className="color-swatch">
                    <input
                      type="color"
                      value={form.branding[field]}
                      onChange={(e) => setBranding(field, e.target.value)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 6,
                        border: "2px solid #1a2f52",
                        padding: 1,
                        cursor: "pointer",
                        background: "none",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#b0c4de",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{ fontSize: 10, color: "#2a3e5a", marginTop: 1 }}
                      >
                        {hint}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#3d5a7e",
                          marginTop: 1,
                          fontFamily: "monospace",
                        }}
                      >
                        {form.branding[field]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── WHITE-LABEL FEATURES ──────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <SectionHead icon={ToggleLeft}>White-Label Features</SectionHead>
            <div style={CARD}>
              <p
                style={{
                  fontSize: 12,
                  color: "#2e4570",
                  marginBottom: 16,
                  lineHeight: 1.6,
                }}
              >
                These features control what your students and counselors see on
                the platform. Changes take effect immediately after saving.
              </p>

              <ToggleRow
                icon="🎨"
                title="Custom Dashboard Colors"
                desc="Apply your brand colors to the student portal."
                on={form.features.customColors}
                onChange={() =>
                  setFeature("customColors", !form.features.customColors)
                }
              />
              <div className="tog-divider" />
              <ToggleRow
                icon="🚫"
                title="Remove Khizar Overseas Footer"
                desc="Hide 'Powered by Khizar Overseas' from the student dashboard footer. Your custom footer text will be shown instead."
                on={form.features.removeKhizarBranding}
                onChange={() =>
                  setFeature(
                    "removeKhizarBranding",
                    !form.features.removeKhizarBranding,
                  )
                }
              />
              <div className="tog-divider" />
              <ToggleRow
                icon="✉️"
                title="Custom Email Branding"
                desc="Use your brand name, logo, and colors in automated student notification emails."
                on={form.features.customEmailBranding}
                onChange={() =>
                  setFeature(
                    "customEmailBranding",
                    !form.features.customEmailBranding,
                  )
                }
              />
            </div>
          </div>

          {/* ── EMAIL BRANDING (shown when toggle is ON) ──────────────── */}
          {form.features.customEmailBranding && (
            <div style={{ marginBottom: 28 }}>
              <SectionHead icon={Mail}>Email Branding</SectionHead>
              <div style={CARD}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e8f0ff",
                    marginBottom: 3,
                  }}
                >
                  Email Identity
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#2e4570",
                    marginBottom: 16,
                    lineHeight: 1.6,
                  }}
                >
                  When custom email branding is enabled, your brand name, logo,
                  and colors will automatically appear in all outgoing student
                  emails (application updates, deadline reminders, visa
                  notifications). The fields below let you configure reply and
                  support details.
                </p>

                <div className="g2" style={{ marginBottom: 14 }}>
                  <Field
                    label="Support Email"
                    hint="Shown as the support contact in emails."
                  >
                    <input
                      className="fi"
                      style={INPUT}
                      type="email"
                      value={form.branding.supportEmail}
                      onChange={(e) =>
                        setBranding("supportEmail", e.target.value)
                      }
                      placeholder="support@youragency.com"
                    />
                  </Field>
                  <Field
                    label="Reply-To Address"
                    hint="Students can reply to this address. Defaults to support email."
                  >
                    <input
                      className="fi"
                      style={INPUT}
                      type="email"
                      value={form.branding.replyTo}
                      onChange={(e) => setBranding("replyTo", e.target.value)}
                      placeholder="hello@youragency.com"
                    />
                  </Field>
                </div>

                <Field
                  label="Email Signature"
                  hint="Appended to the bottom of every outgoing email. Keep it brief."
                >
                  <textarea
                    className="fi"
                    style={{
                      ...INPUT,
                      minHeight: 80,
                      resize: "vertical",
                      lineHeight: 1.5,
                    }}
                    value={form.branding.signature}
                    onChange={(e) => setBranding("signature", e.target.value)}
                    placeholder={`— ${form.branding.brandName || form.name || "Your Agency"} Team\n${form.website || ""}`}
                  />
                </Field>

                {/* Info callout */}
                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 14px",
                    background: "#0a1830",
                    border: "1px solid #0f2040",
                    borderRadius: 9,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: "#2a4060",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Your{" "}
                    <strong style={{ color: "#3d6090" }}>brand name</strong>,{" "}
                    <strong style={{ color: "#3d6090" }}>logo</strong>, and{" "}
                    <strong style={{ color: "#3d6090" }}>primary color</strong>{" "}
                    are pulled automatically from the Branding section above.
                    There is no need to re-enter them here. Email templates are
                    updated on the next send after saving.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom save */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "15px 20px",
              background: "#090f1e",
              border: "1px solid #0e1d36",
              borderRadius: 12,
            }}
          >
            <button className="btn-p" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2
                  size={13}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : saved ? (
                <CheckCircle2 size={13} />
              ) : null}
              {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
            </button>
          </div>
        </div>

        {/* ── Right: live preview ──────────────────────────────────────── */}
        <div className="preview-col">
          <div
            style={{
              background: "#090f1e",
              border: "1px solid #0e1d36",
              borderRadius: 16,
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981",
                  flexShrink: 0,
                }}
              />
              <div style={{ fontSize: 12, fontWeight: 700, color: "#b0c4de" }}>
                Live Brand Preview
              </div>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10.5,
                  color: "#1e3454",
                  fontWeight: 600,
                  background: "#0a1322",
                  border: "1px solid #0f1c31",
                  borderRadius: 5,
                  padding: "2px 7px",
                }}
              >
                Updates instantly
              </span>
            </div>

            <BrandPreview
              branding={{ ...form.branding, features: form.features }}
              orgName={form.name}
              logoUrl={currentLogoUrl}
            />

            {/* Color swatches */}
            <div
              style={{
                marginTop: 14,
                padding: "12px 14px",
                background: "#070c18",
                border: "1px solid #0f1c31",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#1e3454",
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  marginBottom: 10,
                }}
              >
                Active Colors
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "Primary", val: form.branding.primaryColor },
                  { label: "Background", val: form.branding.secondaryColor },
                  { label: "Accent", val: form.branding.accentColor },
                ].map(({ label, val }) => (
                  <div key={label} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        width: "100%",
                        height: 24,
                        borderRadius: 6,
                        background: val,
                        border: "1px solid rgba(255,255,255,.07)",
                        marginBottom: 4,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 9.5,
                        color: "#2a3e5a",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "#1e3050",
                        fontFamily: "monospace",
                        marginTop: 1,
                      }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature status summary */}
            <div
              style={{
                marginTop: 14,
                padding: "12px 14px",
                background: "#070c18",
                border: "1px solid #0f1c31",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#1e3454",
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  marginBottom: 10,
                }}
              >
                Feature Status
              </div>
              {[
                { label: "Custom Colors", on: form.features.customColors },
                {
                  label: "Remove KO Footer",
                  on: form.features.removeKhizarBranding,
                },
                {
                  label: "Email Branding",
                  on: form.features.customEmailBranding,
                },
              ].map(({ label, on }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 11, color: "#2a3f5e" }}>
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: on ? "#10b981" : "#1e3050",
                      background: on ? "#10b98118" : "#0a1422",
                      border: `1px solid ${on ? "#10b98133" : "#0f1c31"}`,
                      borderRadius: 4,
                      padding: "1px 7px",
                    }}
                  >
                    {on ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Toasts ───────────────────────────────────────────────────────── */}
      {saved && (
        <div className="toast">
          <CheckCircle2 size={15} />
          Organisation settings saved!
        </div>
      )}
      {saveError && (
        <div className="toast toast-err">
          <AlertCircle size={15} />
          {saveError}
        </div>
      )}
    </div>
  );
}
