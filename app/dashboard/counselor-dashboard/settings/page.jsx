"use client";

/**
 * app/dashboard/counselor-dashboard/settings/page.jsx  —  RAZORPAY EDITION
 *
 * Changes from Stripe version:
 *  - handlePay()          → loads Razorpay checkout widget inline (no full-page redirect)
 *  - handleManageBilling() → replaced by handleCancelSubscription() (Razorpay has no portal)
 *  - useEffect for ?payment=success query param → removed (no redirect-back URL needed;
 *    payment confirmation is synchronous via verifyPayment())
 *  - Razorpay script loader added (loads checkout.razorpay.com/v1/checkout.js once)
 *  - Cancel confirmation dialog added to the Subscription panel
 *
 * RESPONSIVE UPDATE:
 *  - Desktop UI: zero changes
 *  - Mobile (≤768px): nav collapses to horizontally scrollable tabs with hidden action buttons,
 *    floating mobile save FAB added, layout grid collapses to single column,
 *    profile card header stacks vertically, subscription panel stacks, bottom save bar stacks,
 *    all g2/g3 grids single-column, modal padding tightened, color swatches stack.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { counselorApi } from "@/lib/counselorApi";

const cls = (...args) => args.filter(Boolean).join(" ");
const SECTIONS = ["profile", "branding", "email", "subscription"];

function fileToDataUrl(file) {
  if (!file) return Promise.resolve("");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatExpiry(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Load Razorpay checkout.js once ────────────────────────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Mini Student Dashboard Preview ───────────────────────────────────────────
function StudentDashboardPreview({ branding, profile }) {
  const primary = branding.primaryColor || "#22c55e";
  const secondary = branding.secondaryColor || "#0A192F";
  const accent = branding.accentColor || "#ffffff";
  const brand = branding.brandName || "Khizar";
  const tagline = branding.tagline || "Overseas";
  const showFooter = !branding.features.removeKhizarBranding;
  const logoPreview = branding.logoPreview;

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #1a2744",
        background: secondary,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 11,
        userSelect: "none",
        boxShadow: "0 24px 64px rgba(0,0,0,.5)",
      }}
    >
      {/* Top nav */}
      <div
        style={{
          background: secondary,
          borderBottom: `1px solid ${primary}22`,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: `${primary}22`,
              border: `1px solid ${primary}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: 9, fontWeight: 800, color: primary }}>
                {brand.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: accent }}>
              {brand}
            </div>
            <div style={{ fontSize: 8, color: `${accent}66` }}>{tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 9, color: `${accent}88` }}>
            Home · Countries · Courses
          </div>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            S
          </div>
        </div>
      </div>

      {/* Layout */}
      <div style={{ display: "flex", minHeight: 280 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 100,
            background: `${secondary}ee`,
            borderRight: `1px solid ${primary}15`,
            padding: "10px 0",
            flexShrink: 0,
          }}
        >
          <div style={{ padding: "0 10px", marginBottom: 8 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: primary }}>
              {brand}
            </div>
            <div style={{ fontSize: 7, color: `${accent}44` }}>{tagline}</div>
          </div>
          {[
            "Dashboard",
            "Applications",
            "Saved Uni",
            "Deadlines",
            "Documents",
            "Visa Progress",
            "Settings",
          ].map((item, i) => (
            <div
              key={item}
              style={{
                padding: "5px 10px",
                fontSize: 8,
                fontWeight: i === 0 ? 700 : 400,
                color: i === 0 ? accent : `${accent}55`,
                background: i === 0 ? `${primary}22` : "transparent",
                borderLeft:
                  i === 0 ? `2px solid ${primary}` : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 1,
              }}
            >
              <span style={{ fontSize: 9 }}>
                {["🏠", "📋", "⭐", "⏰", "📄", "✈️", "⚙️"][i]}
              </span>
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "12px 14px", overflowX: "hidden" }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: accent }}>
              Dashboard
            </div>
            <div style={{ fontSize: 8, color: `${accent}55` }}>
              Welcome back, Syed Imran Ahmed
            </div>
          </div>

          {/* Profile complete banner */}
          <div
            style={{
              background: `${primary}14`,
              border: `1px solid ${primary}33`,
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: primary }}>
                🎉 Profile 100% Complete!
              </div>
              <div style={{ fontSize: 7, color: `${accent}66`, marginTop: 2 }}>
                You're ready to apply — let's go!
              </div>
              <div
                style={{
                  marginTop: 4,
                  height: 3,
                  borderRadius: 99,
                  background: `${accent}15`,
                  width: 80,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 99,
                    background: primary,
                  }}
                />
              </div>
            </div>
            <div
              style={{
                background: primary,
                color: "#fff",
                fontSize: 7,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 5,
                flexShrink: 0,
              }}
            >
              Start Applying ✏️
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 6,
              marginBottom: 10,
            }}
          >
            {[
              { icon: "🎓", label: "Applications", val: "1" },
              { icon: "⭐", label: "Shortlisted", val: "0" },
              { icon: "⏰", label: "Deadlines", val: "0" },
              { icon: "🛂", label: "Visa", val: "Pending" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: `${accent}08`,
                  border: `1px solid ${primary}1a`,
                  borderRadius: 7,
                  padding: "6px 6px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 12 }}>{s.icon}</div>
                <div
                  style={{ fontSize: 8, color: `${accent}55`, marginTop: 1 }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: accent,
                    marginTop: 2,
                  }}
                >
                  {s.val}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom two panels */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div
              style={{
                background: `${primary}0e`,
                border: `1px solid ${primary}22`,
                borderRadius: 7,
                padding: "8px 10px",
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: accent,
                  marginBottom: 4,
                }}
              >
                ⏰ Urgent Deadlines
              </div>
              <div
                style={{
                  fontSize: 7,
                  color: `${accent}44`,
                  textAlign: "center",
                  paddingTop: 6,
                }}
              >
                No urgent deadlines 🎉
              </div>
            </div>
            <div
              style={{
                background: `${accent}06`,
                border: `1px solid ${accent}0f`,
                borderRadius: 7,
                padding: "8px 10px",
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: accent,
                  marginBottom: 4,
                }}
              >
                Recent Applications
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 0",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    background: `${primary}22`,
                    border: `1px solid ${primary}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 7,
                    color: primary,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  MIT
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 600,
                      color: accent,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Massachusetts Inst.
                  </div>
                  <div style={{ fontSize: 6, color: `${accent}44` }}>
                    Computer Applications
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    background: primary,
                    color: "#fff",
                    fontSize: 6,
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                >
                  Offer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <div
          style={{
            background: `${secondary}cc`,
            borderTop: `1px solid ${primary}15`,
            padding: "5px 14px",
            fontSize: 7,
            color: `${accent}33`,
            textAlign: "center",
          }}
        >
          {branding.footerText || "Powered by Khizar Overseas"}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function LockBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "2px 7px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        background: "rgba(245,158,11,.1)",
        color: "#f59e0b",
        border: "1px solid rgba(245,158,11,.2)",
        marginLeft: 7,
        letterSpacing: ".02em",
      }}
    >
      🔒 Premium
    </span>
  );
}

function Field({ label, children, hint }) {
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

function ToggleRow({
  icon,
  title,
  desc,
  on,
  onChange,
  locked = false,
  onLockedClick,
}) {
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
          <div style={{ fontSize: 13, fontWeight: 600, color: "#b0c4de" }}>
            {title}
            {locked && <LockBadge />}
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
        onClick={() => {
          if (locked) {
            onLockedClick?.();
            return;
          }
          onChange?.();
        }}
        role="switch"
        aria-checked={on}
        style={{
          width: 42,
          height: 23,
          borderRadius: 99,
          border: "none",
          background: on ? "#1d4ed8" : "#0f1c31",
          cursor: locked ? "not-allowed" : "pointer",
          opacity: locked ? 0.6 : 1,
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

function SectionHead({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        color: "#1e3050",
        textTransform: "uppercase",
        letterSpacing: ".14em",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {children}
      <span
        style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(90deg,#0e1d36,transparent)",
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CounselorSettingsPage() {
  const [active, setActive] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [saveError, setSaveError] = useState("");
  const refs = useRef({});

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    photoPreview: "",
  });

  const [branding, setBranding] = useState({
    brandName: "",
    logoPreview: "",
    brandingEnabled: true,
    plan: "standard",
    premiumExpiresAt: null,
    tagline: "",
    faviconPreview: "",
    primaryColor: "#22c55e",
    secondaryColor: "#0A192F",
    accentColor: "#ffffff",
    features: {
      customColors: false,
      removeKhizarBranding: false,
      customEmailBranding: false,
    },
    footerText: "",
  });

  const [emailSettings, setEmailSettings] = useState({
    senderName: "",
    senderEmail: "",
    welcomeSubject:
      "Welcome to {brandName} — Your Study Abroad Journey Starts!",
    welcomeBody:
      "Hi {studentName},\n\nWelcome aboard! We're thrilled to have you with us at {brandName}.\n\nYour dedicated counselor will guide you every step of the way.\n\nBest regards,\n{counselorName}\n{brandName}",
    reminderSubject: "📅 Deadline Reminder from {brandName}",
    reminderBody:
      "Hi {studentName},\n\nThis is a friendly reminder that your deadline for {universityName} is approaching on {deadline}.\n\nPlease make sure all documents are ready.\n\nBest,\n{counselorName}",
    offerSubject: "🎉 Congratulations! You got an offer from {universityName}",
    offerBody:
      "Hi {studentName},\n\nGreat news! You have received an offer from {universityName}.\n\nLog in to your dashboard to view the details.\n\n{counselorName}\n{brandName}",
  });

  const router = useRouter();

  // ── Load branding from backend on mount ──────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [{ branding: b }, statusRes] = await Promise.allSettled([
          counselorApi.getMyBranding(),
          counselorApi.getSubscriptionStatus(),
        ]).then(([br, sr]) => [
          br.status === "fulfilled" ? br.value : { branding: {} },
          sr.status === "fulfilled" ? sr.value : { data: {} },
        ]);

        const premiumExpiresAt =
          statusRes?.data?.premiumExpiresAt || b.premiumExpiresAt || null;

        setBranding({
          brandName: b.brandName || "",
          logoPreview: b.logo || "",
          brandingEnabled: b.brandingEnabled ?? true,
          plan: b.plan || "standard",
          premiumExpiresAt,
          tagline: b.tagline || "",
          faviconPreview: b.favicon || "",
          primaryColor: b.primaryColor || "#22c55e",
          secondaryColor: b.secondaryColor || "#0A192F",
          accentColor: b.accentColor || "#ffffff",
          features: {
            customColors: b.features?.customColors ?? false,
            removeKhizarBranding: b.features?.removeKhizarBranding ?? false,
            customEmailBranding: b.features?.customEmailBranding ?? false,
          },
          footerText: b.footerText || "",
        });

        setEmailSettings((prev) => ({
          ...prev,
          senderName: b.brandName || prev.senderName,
        }));
      } catch (err) {
        console.error("[settings] failed to load branding:", err);
      } finally {
        setPageLoading(false);
      }
    })();
  }, []);

  const isPremium =
    branding.plan === "premium" &&
    (!branding.premiumExpiresAt ||
      new Date(branding.premiumExpiresAt) > new Date());

  const premiumLocked = !isPremium;

  const scrollTo = (id) => {
    setActive(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Save branding fields ──────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        brandName: branding.brandName,
        tagline: branding.tagline,
        brandingEnabled: branding.brandingEnabled,
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        accentColor: branding.accentColor,
        footerText: branding.footerText,
        removeKhizarBranding: branding.features.removeKhizarBranding,
        customEmailBranding: branding.features.customEmailBranding,
      };
      await counselorApi.updateBranding(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    } catch (err) {
      console.error("[settings] save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = () => {
    setUpgradeModal(true);
  };

  // ── Razorpay Checkout ─────────────────────────────────────────────────────
  const handlePay = async () => {
    setPaying(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setSaveError(
          "Failed to load payment SDK. Please check your internet connection.",
        );
        setTimeout(() => setSaveError(""), 5000);
        setPaying(false);
        return;
      }

      const data = await counselorApi.createOrder();
      if (!data?.subscriptionId) {
        throw new Error("No subscription ID returned from server");
      }

      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Khizar Overseas",
        description: "Counselor Premium Plan — ₹999/month",
        image: "/logo.png",
        prefill: data.prefill || {},
        theme: { color: "#f59e0b" },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
        handler: async (response) => {
          try {
            const verify = await counselorApi.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verify?.success) {
              setBranding((prev) => ({
                ...prev,
                plan: "premium",
                premiumExpiresAt: verify.expiresAt || null,
                features: {
                  customColors: true,
                  removeKhizarBranding: true,
                  customEmailBranding: true,
                },
              }));
              setUpgradeModal(false);
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            } else {
              setSaveError(
                "Payment verification failed. Please contact support if you were charged.",
              );
            }
          } catch (verifyErr) {
            console.error("[handlePay:verify]", verifyErr);
            if (verifyErr?.status === 401) {
              setSaveError("Session expired. Please refresh the page.");
            } else {
              setSaveError(
                "Payment received but verification failed. Save your payment ID: " +
                  response.razorpay_payment_id,
              );
            }
            setTimeout(() => setSaveError(""), 8000);
          } finally {
            setPaying(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("[razorpay] payment failed:", response.error);
        setSaveError(
          `Payment failed: ${response.error?.description || "Unknown error"}. Please try again.`,
        );
        setTimeout(() => setSaveError(""), 6000);
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      console.error("[handlePay]", err);
      setSaveError(
        err?.status === 401
          ? "Session expired — please refresh the page and try again."
          : "Payment setup failed. Please try again.",
      );
      setTimeout(() => setSaveError(""), 5000);
      setPaying(false);
    }
  };

  // ── Cancel subscription ───────────────────────────────────────────────────
  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const data = await counselorApi.cancelSubscription();
      setCancelConfirm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error("[handleCancelSubscription]", err);
      setCancelConfirm(false);
      setSaveError(
        err?.status === 401
          ? "Session expired — please refresh the page and try again."
          : err?.message || "Cancellation failed. Please contact support.",
      );
      setTimeout(() => setSaveError(""), 5000);
    } finally {
      setCancelling(false);
    }
  };

  const updateProfile = (field, value) =>
    setProfile((p) => ({ ...p, [field]: value }));
  const updateBranding = (field, value) =>
    setBranding((p) => ({ ...p, [field]: value }));
  const updateFeature = (field, value) =>
    setBranding((p) => ({ ...p, features: { ...p.features, [field]: value } }));
  const updateEmail = (field, value) =>
    setEmailSettings((p) => ({ ...p, [field]: value }));

  // ── Logo upload ───────────────────────────────────────────────────────────
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = await fileToDataUrl(file);
    updateBranding("logoPreview", localUrl);
    try {
      const res = await counselorApi.uploadBrandingAsset("logo", file);
      updateBranding("logoPreview", res.url);
    } catch (err) {
      console.error("[settings] logo upload failed:", err);
    }
  };

  // ── Favicon upload ────────────────────────────────────────────────────────
  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = await fileToDataUrl(file);
    updateBranding("faviconPreview", localUrl);
    try {
      const res = await counselorApi.uploadBrandingAsset("favicon", file);
      updateBranding("faviconPreview", res.url);
    } catch (err) {
      console.error("[settings] favicon upload failed:", err);
    }
  };

  // ── Profile photo ─────────────────────────────────────────────────────────
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateProfile("photoPreview", await fileToDataUrl(file));
  };

  const inputStyle = {
    width: "100%",
    background: "#070c18",
    border: "1px solid #0f1c31",
    borderRadius: 9,
    padding: "10px 13px",
    color: "#d0daf0",
    fontSize: 13.5,
    outline: "none",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: "border .15s, box-shadow .15s",
    WebkitAppearance: "none",
    boxSizing: "border-box",
  };

  const cardStyle = {
    background: "#090f1e",
    border: "1px solid #0e1d36",
    borderRadius: 14,
    padding: "22px",
    position: "relative",
    overflow: "hidden",
    marginBottom: 12,
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#060b17",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: "#2e4570",
          fontSize: 14,
        }}
      >
        Loading settings…
      </div>
    );
  }

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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1a2744; border-radius: 9px; }
        button, input, select, textarea { font-family: inherit; }
        
        .fi:hover:not(:focus) { border-color: #172540 !important; }
        .fi:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,.13) !important; }
        .fi::placeholder { color: #1e3050 !important; }
        .fi:disabled { opacity: .5 !important; cursor: not-allowed !important; }
        textarea.fi { resize: vertical; line-height: 1.65; min-height: 100px; }

        .stab {
          padding: 7px 15px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #2e4570;
          background: none;
          border: none;
          cursor: pointer;
          transition: all .15s;
          white-space: nowrap;
          letter-spacing: -.01em;
        }
        .stab:hover { color: #7fa0c8; background: rgba(255,255,255,.025); }
        .stab.on { color: #e2eaf8; background: #0f1e36; border: 1px solid #1a2f52; }

        .btn-p {
          padding: 10px 22px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 700;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: all .15s;
          letter-spacing: -.01em;
        }
        .btn-p:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,.3); }
        .btn-p:active { transform: none; }
        .btn-p:disabled { opacity: .6; cursor: not-allowed; transform: none; }

        .btn-g {
          padding: 10px 20px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 500;
          background: transparent;
          color: #4a607d;
          border: 1px solid #0f1c31;
          cursor: pointer;
          transition: all .15s;
        }
        .btn-g:hover { background: #0a1322; color: #7a9ac0; border-color: #172540; }

        .btn-gold {
          padding: 11px 26px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: all .2s;
          letter-spacing: -.01em;
          box-shadow: 0 8px 28px rgba(245,158,11,.28);
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(245,158,11,.38); }
        .btn-gold:active { transform: none; }
        .btn-gold:disabled { opacity: .7; cursor: not-allowed; transform: none; }

        .btn-danger {
          padding: 10px 20px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          background: transparent;
          color: #ef4444;
          border: 1px solid rgba(239,68,68,.25);
          cursor: pointer;
          transition: all .15s;
        }
        .btn-danger:hover { background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.4); }
        .btn-danger:disabled { opacity: .5; cursor: not-allowed; }

        .s-anchor { scroll-margin-top: 58px; }
        .divider { height: 1px; background: #080f1c; margin: 2px 0; }
        .card-shine::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 5%, #152040 40%, #152040 60%, transparent 95%);
        }
        .tog-divider { height: 1px; background: #0a1422; }

        .color-swatch {
          display: flex;
          align-items: center;
          gap: 9px;
          background: #070c18;
          border: 1px solid #0f1c31;
          border-radius: 9px;
          padding: 7px 10px;
          cursor: pointer;
          transition: border .15s;
        }
        .color-swatch:hover { border-color: #172540; }
        .color-swatch input[type=color] {
          width: 28px; height: 28px; border-radius: 6px;
          border: 2px solid #1a2f52; padding: 1px;
          cursor: pointer; background: none; flex-shrink: 0;
        }

        .stat-pill {
          background: #070c18;
          border: 1px solid #0f1c31;
          border-radius: 10px;
          padding: 12px 15px;
        }

        .toast {
          position: fixed; bottom: 28px; left: 50%;
          transform: translateX(-50%);
          background: #10b981; color: #fff;
          padding: 11px 24px; border-radius: 9px;
          font-size: 13.5px; font-weight: 700; z-index: 999;
          box-shadow: 0 8px 28px rgba(16,185,129,.4);
          animation: toastIn .3s ease; white-space: nowrap;
          letter-spacing: -.01em;
          max-width: calc(100vw - 32px);
          text-align: center;
        }
        @keyframes toastIn {
          from{ opacity:0; transform:translateX(-50%) translateY(10px); }
          to{ opacity:1; transform:translateX(-50%) translateY(0); }
        }

        .modal-bg {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.72);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn .2s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .modal-box {
          background: #090f1e;
          border: 1px solid #1a2f52;
          border-radius: 18px;
          padding: 32px;
          width: 100%; max-width: 440px;
          position: relative;
          animation: modalIn .25s ease;
          box-shadow: 0 32px 80px rgba(0,0,0,.6);
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes modalIn {
          from{ opacity:0; transform: translateY(16px) scale(.97); }
          to{ opacity:1; transform: none; }
        }

        .preview-panel {
          position: sticky; top: 72px;
          height: calc(100vh - 90px);
          overflow-y: auto; padding-bottom: 32px;
        }
        @media(max-width:1100px){ .preview-panel { display: none; } }

        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media(max-width:640px){ .g2,.g3{ grid-template-columns:1fr; } }

        .ava {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg,#1a3366,#2563eb,#6d28d9);
          display: flex; align-items: center; justify-content: center;
          font-size: 21px; font-weight: 800; color: #fff;
          flex-shrink: 0; position: relative;
          box-shadow: 0 0 0 2px #090f1e, 0 0 0 4px #162444;
          overflow: hidden; letter-spacing: -.5px;
        }
        .ava img { width: 100%; height: 100%; object-fit: cover; }
        .ava .dot {
          position: absolute; bottom: 3px; right: 3px;
          width: 11px; height: 11px; border-radius: 50%;
          background: #10b981; border: 2px solid #090f1e;
        }

        .badge {
          display: inline-flex; align-items: center;
          padding: 3px 8px; border-radius: 5px;
          font-size: 10.5px; font-weight: 700; letter-spacing: .02em;
        }
        .bg { background: rgba(16,185,129,.1); color: #10b981; border: 1px solid rgba(16,185,129,.18); }
        .ba { background: rgba(245,158,11,.1); color: #f59e0b; border: 1px solid rgba(245,158,11,.18); }
        .bb { background: rgba(59,130,246,.1); color: #60a5fa; border: 1px solid rgba(59,130,246,.18); }
        .bp { background: linear-gradient(135deg,rgba(245,158,11,.15),rgba(217,119,6,.1)); color: #fbbf24; border: 1px solid rgba(245,158,11,.3); }

        .lockedOverlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(6,11,23,.65), rgba(6,11,23,.88));
          backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px; z-index: 5;
        }

        .upload-lbl {
          font-size: 11px; color: #2563eb; cursor: pointer;
          font-weight: 700; text-decoration: underline;
          text-decoration-style: dotted; text-underline-offset: 3px;
          padding: 0; background: none; border: none;
          margin-top: 5px; display: inline-block;
        }
        .upload-lbl:hover { color: #60a5fa; }

        .preview-toggle-btn {
          display: none;
          padding: 7px 14px; border-radius: 8px;
          font-size: 12.5px; font-weight: 600;
          background: #0f1e36; color: #7fa0c8;
          border: 1px solid #1a2f52; cursor: pointer;
        }
        @media(max-width:1100px){ .preview-toggle-btn { display: flex; align-items: center; gap: 6px; } }

        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #10b981; animation: pulse 2s infinite; flex-shrink: 0;
        }
        @keyframes pulse {
          0%,100%{ box-shadow: 0 0 0 0 rgba(16,185,129,.5); }
          50%{ box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }

        .email-var {
          display: inline-block; padding: 1px 6px;
          background: rgba(37,99,235,.15); color: #60a5fa;
          border-radius: 4px; font-size: 10.5px; font-weight: 600;
          margin: 2px; border: 1px solid rgba(37,99,235,.2);
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── MAIN LAYOUT GRID ──────────────────────────────────── */
        .settings-layout {
          max-width: 1400px;
          margin: 0 auto;
          padding: 28px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 28px;
          align-items: start;
        }

        /* ─── NAV ACTIONS (desktop: always visible) ─────────────── */
        .nav-actions { display: flex; gap: 8px; flex-shrink: 0; align-items: center; }
        .nav-discard-btn { display: block; }
        .nav-save-btn   { display: block; }

        /* ─── MOBILE FAB ────────────────────────────────────────── */
        .mobile-fab { display: none; }

        /* ─── SUBSCRIPTION PANEL FLEX ───────────────────────────── */
        .sub-panel-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* ─── PROFILE HEADER ────────────────────────────────────── */
        .profile-header {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          flex-wrap: wrap;
        }

        /* ─── BOTTOM SAVE BAR ───────────────────────────────────── */
        .bottom-save-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          background: #090f1e;
          border: 1px solid #0e1d36;
          border-radius: 12px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .bottom-save-bar-actions { display: flex; gap: 8px; }

        /* ─── BENEFITS GRID ─────────────────────────────────────── */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        /* ═══════════════════════════════════════════════════════════
           MOBILE OVERRIDES  (≤768px)
           Desktop layout = zero changes above this line
           ═══════════════════════════════════════════════════════════ */
        @media (max-width: 768px) {

          /* Layout: single column, tighter padding */
          .settings-layout {
            grid-template-columns: 1fr;
            padding: 16px 14px 100px;
            gap: 0;
          }

          /* Page title tighter */
          .settings-layout > div:first-child > div:first-child h1 {
            font-size: 19px !important;
          }

          /* Nav: taller touch targets, horizontal scroll */
          .nav-tabs-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 2px;
          }
          .nav-tabs-wrap::-webkit-scrollbar { display: none; }

          /* Hide Discard + Save from nav on mobile → replaced by FAB */
          .nav-discard-btn { display: none !important; }
          .nav-save-btn   { display: none !important; }

          /* Preview toggle stays but shrinks */
          .preview-toggle-btn {
            padding: 6px 10px !important;
            font-size: 11.5px !important;
          }

          /* FAB: floating save button bottom-right */
          .mobile-fab {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            bottom: 20px;
            right: 16px;
            z-index: 90;
            gap: 7px;
            padding: 13px 20px;
            border-radius: 50px;
            font-size: 13.5px;
            font-weight: 800;
            background: linear-gradient(135deg, #1d4ed8, #2563eb);
            color: #fff;
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 28px rgba(29,78,216,.45);
            letter-spacing: -.01em;
            transition: all .15s;
            white-space: nowrap;
          }
          .mobile-fab:disabled { opacity: .7; cursor: not-allowed; }
          .mobile-fab:active { transform: scale(.97); }

          /* Cards: tighter padding */
          .card-shine { padding: 16px !important; }

          /* Profile header: stack avatar + info */
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          /* Profile stats strip: 3 cols → fit on one row */
          .profile-stats-g3 {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
          /* Profile input row: already 1-col via .g3 override */

          /* Subscription: stack the plan card vertically */
          .sub-panel-row {
            flex-direction: column;
            gap: 12px;
          }
          .sub-plan-info { min-width: unset !important; }
          .sub-stat-pill { min-width: unset !important; width: 100% !important; }

          /* Bottom save bar: stack */
          .bottom-save-bar {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            padding: 14px;
            /* Push above FAB */
            margin-bottom: 8px;
          }
          .bottom-save-bar-actions {
            justify-content: stretch;
          }
          .bottom-save-bar-actions .btn-g,
          .bottom-save-bar-actions .btn-p {
            flex: 1;
          }

          /* Benefits grid: stays 2-col — fits fine on mobile */
          /* (no change needed) */

          /* Color swatches: 1 col on very narrow */
          .color-swatches-g3 {
            grid-template-columns: 1fr !important;
          }

          /* Modal: full-width, less padding */
          .modal-box {
            padding: 22px 18px !important;
            border-radius: 16px !important;
            max-height: 85vh;
          }

          /* Email template cards: tighter */
          .email-tpl-card {
            padding: 13px !important;
          }

          /* Sender details g2: single col on mobile */
          .sender-g2 {
            grid-template-columns: 1fr !important;
          }

          /* Branding g2 (brand name + logo): single col */
          .brand-identity-g2 {
            grid-template-columns: 1fr !important;
          }

          /* Premium card g2 (tagline + favicon): single col */
          .premium-top-g2 {
            grid-template-columns: 1fr !important;
          }

          /* Locked overlay: adjust text */
          .lockedOverlay p { font-size: 12px !important; }

          /* Toast: full-width */
          .toast {
            bottom: 80px !important; /* above FAB */
            left: 14px !important;
            right: 14px !important;
            transform: none !important;
            max-width: unset !important;
          }

          /* Section anchor scroll offset */
          .s-anchor { scroll-margin-top: 62px; }

          /* Sticky nav height */
          .settings-nav { height: 50px !important; }

          /* Page header */
          .page-header { margin-bottom: 20px !important; }

          /* Section blocks */
          .section-block { margin-bottom: 24px !important; }
        }

        /* Extra narrow (≤400px) */
        @media (max-width: 400px) {
          .profile-stats-g3 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .badge { font-size: 9.5px !important; padding: 2px 6px !important; }
          .stab { padding: 6px 11px !important; font-size: 12px !important; }
          .benefits-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Sticky Nav ─────────────────────────────────────────── */}
      <div
        className="settings-nav"
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
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 54,
            gap: 12,
          }}
        >
          {/* Tabs — horizontally scrollable on mobile */}
          <div
            className="nav-tabs-wrap"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flex: 1,
              minWidth: 0,
            }}
          >
            {SECTIONS.map((id) => (
              <button
                key={id}
                className={cls("stab", active === id && "on")}
                onClick={() => scrollTo(id)}
              >
                {
                  {
                    profile: "Profile",
                    branding: "Branding",
                    email: "Email Templates",
                    subscription: "Subscription",
                  }[id]
                }
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <button
              className="preview-toggle-btn"
              onClick={() => setShowPreview((v) => !v)}
            >
              <span className="live-dot" />
              {showPreview ? "Hide" : "Preview"}
            </button>
            <button
              className="btn-g nav-discard-btn"
              style={{ padding: "7px 15px", fontSize: 12.5 }}
            >
              Discard
            </button>
            <button
              className="btn-p nav-save-btn"
              style={{ padding: "7px 18px", fontSize: 13 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Layout ─────────────────────────────────────────────── */}
      <div className="settings-layout">
        {/* ── Left: Settings ─────────────────────────────────── */}
        <div>
          {/* Page header */}
          <div className="page-header" style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontSize: 23,
                fontWeight: 800,
                color: "#e8f0ff",
                letterSpacing: "-0.04em",
                marginBottom: 5,
              }}
            >
              Account Settings
            </h1>
            <p style={{ fontSize: 13, color: "#2e4570", lineHeight: 1.6 }}>
              Manage your profile, branding, and subscription. Changes reflect
              live in the student dashboard preview →
            </p>
          </div>

          {/* ── PROFILE ──────────────────────────────────────── */}
          <div
            id="profile"
            ref={(el) => {
              refs.current.profile = el;
            }}
            className="s-anchor section-block"
            style={{ marginBottom: 32 }}
          >
            <SectionHead>Profile</SectionHead>

            <div style={cardStyle} className="card-shine">
              {/* Profile header — stacks on mobile */}
              <div className="profile-header">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className="ava">
                    {profile.photoPreview ? (
                      <img src={profile.photoPreview} alt="Profile" />
                    ) : (
                      <>
                        {profile.fullName
                          .split(" ")
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "?"}
                        <div className="dot" />
                      </>
                    )}
                  </div>
                  <label className="upload-lbl">
                    Change photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#e8f0ff",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {profile.fullName || "—"}
                    </span>
                    <span className="badge bg">● Active</span>
                    <span className="badge bb">Counselor</span>
                    {isPremium && <span className="badge bp">⭐ Premium</span>}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#2e4570",
                      marginBottom: 14,
                      lineHeight: 1.6,
                      wordBreak: "break-all",
                    }}
                  >
                    {profile.email} &nbsp;·&nbsp; {profile.phone}
                  </p>
                  {/* Stats — forced 3-col even on mobile */}
                  <div
                    className="profile-stats-g3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 12,
                    }}
                  >
                    {[
                      { v: "142", l: "Students" },
                      { v: "87%", l: "Visa Success" },
                      { v: "4.9★", l: "Rating" },
                    ].map((s) => (
                      <div key={s.l} className="stat-pill">
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#60a5fa",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {s.v}
                        </div>
                        <div
                          style={{
                            fontSize: 9.5,
                            color: "#2a3e5a",
                            fontWeight: 700,
                            marginTop: 2,
                            textTransform: "uppercase",
                            letterSpacing: ".06em",
                          }}
                        >
                          {s.l}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile inputs */}
              <div className="g3" style={{ marginTop: 18 }}>
                {[
                  {
                    label: "Full Name",
                    field: "fullName",
                    placeholder: "Your full name",
                  },
                  {
                    label: "Email",
                    field: "email",
                    placeholder: "Email address",
                  },
                  {
                    label: "Phone",
                    field: "phone",
                    placeholder: "Phone number",
                  },
                ].map(({ label, field, placeholder }) => (
                  <Field key={field} label={label}>
                    <input
                      className="fi"
                      style={inputStyle}
                      value={profile[field]}
                      onChange={(e) => updateProfile(field, e.target.value)}
                      placeholder={placeholder}
                    />
                  </Field>
                ))}
              </div>
            </div>
          </div>

          {/* ── BRANDING ─────────────────────────────────────── */}
          <div
            id="branding"
            ref={(el) => {
              refs.current.branding = el;
            }}
            className="s-anchor section-block"
            style={{ marginBottom: 32 }}
          >
            <SectionHead>Branding</SectionHead>

            {/* Free tier */}
            <div style={cardStyle} className="card-shine">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#e8f0ff",
                      marginBottom: 3,
                    }}
                  >
                    Brand Identity
                  </div>
                  <p
                    style={{ fontSize: 12, color: "#2e4570", lineHeight: 1.6 }}
                  >
                    Brand name and logo are available on the free plan.
                  </p>
                </div>
                <span className={cls("badge", isPremium ? "bp" : "ba")}>
                  {isPremium ? "⭐ Premium Active" : "Standard Plan"}
                </span>
              </div>

              {/* Brand identity g2 — single col on mobile */}
              <div className="g2 brand-identity-g2">
                <Field label="Brand Name (Free)">
                  <input
                    className="fi"
                    style={inputStyle}
                    value={branding.brandName}
                    onChange={(e) =>
                      updateBranding("brandName", e.target.value)
                    }
                    placeholder="Your brand name"
                  />
                </Field>

                <Field label="Logo Upload (Free)">
                  <div
                    style={{
                      background: "#070c18",
                      border: "1px dashed #16305a",
                      borderRadius: 9,
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 10,
                        background: "#0d1628",
                        border: "1px solid #13233d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {branding.logoPreview ? (
                        <img
                          src={branding.logoPreview}
                          alt="Logo"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 10, color: "#2a3f5e" }}>
                          Logo
                        </span>
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#3d5a7e",
                          marginBottom: 5,
                        }}
                      >
                        PNG, SVG or JPG · max 2MB
                      </p>
                      <label className="upload-lbl">
                        Upload logo
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleLogoUpload}
                        />
                      </label>
                    </div>
                  </div>
                </Field>
              </div>

              <div style={{ marginTop: 8 }}>
                <ToggleRow
                  icon="🟢"
                  title="Branding Enabled"
                  desc="Toggle your brand profile on or off for students."
                  on={branding.brandingEnabled}
                  onChange={() =>
                    updateBranding("brandingEnabled", !branding.brandingEnabled)
                  }
                />
              </div>
            </div>

            {/* Premium tier */}
            <div
              style={{ ...cardStyle, position: "relative" }}
              className="card-shine"
            >
              {premiumLocked && (
                <div className="lockedOverlay">
                  <div
                    style={{
                      textAlign: "center",
                      maxWidth: 300,
                      padding: "0 16px",
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#e8f0ff",
                        marginBottom: 6,
                      }}
                    >
                      Premium White Label
                    </div>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "#6a8ab0",
                        lineHeight: 1.7,
                        marginBottom: 14,
                      }}
                    >
                      Unlock tagline, favicon, dashboard colors, remove footer
                      branding, and email templates.
                    </p>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#f59e0b",
                        marginBottom: 12,
                      }}
                    >
                      ₹999
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#6a8ab0",
                        }}
                      >
                        /month
                      </span>
                    </div>
                    <button className="btn-gold" onClick={handleUpgrade}>
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#e8f0ff",
                      marginBottom: 3,
                    }}
                  >
                    Premium White Label <LockBadge />
                  </div>
                  <p
                    style={{ fontSize: 12, color: "#2e4570", lineHeight: 1.6 }}
                  >
                    Full control over your student dashboard appearance.
                  </p>
                </div>
              </div>

              {/* Tagline + favicon — single col on mobile */}
              <div className="g2 premium-top-g2" style={{ marginBottom: 16 }}>
                <Field label="Tagline (Premium)">
                  <input
                    className="fi"
                    style={inputStyle}
                    value={branding.tagline}
                    onChange={(e) => updateBranding("tagline", e.target.value)}
                    placeholder="Study Abroad Specialist"
                    disabled={premiumLocked}
                  />
                </Field>

                <Field label="Favicon (Premium)">
                  <div
                    style={{
                      background: "#070c18",
                      border: "1px dashed #16305a",
                      borderRadius: 9,
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      opacity: premiumLocked ? 0.5 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: "#0d1628",
                        border: "1px solid #13233d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {branding.faviconPreview ? (
                        <img
                          src={branding.faviconPreview}
                          alt="Favicon"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 9, color: "#2a3f5e" }}>
                          Icon
                        </span>
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#3d5a7e",
                          marginBottom: 5,
                        }}
                      >
                        Square icon for browser tabs
                      </p>
                      <label
                        className={premiumLocked ? "" : "upload-lbl"}
                        style={
                          premiumLocked
                            ? { fontSize: 11, color: "#2a3f5e" }
                            : {}
                        }
                      >
                        Upload favicon
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleFaviconUpload}
                          disabled={premiumLocked}
                        />
                      </label>
                    </div>
                  </div>
                </Field>
              </div>

              {/* Color pickers — 3 col desktop, 1 col on very narrow mobile */}
              <div style={{ marginBottom: 4 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#3d5a7e",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    marginBottom: 10,
                  }}
                >
                  Dashboard Colors (Premium)
                </label>
                <div
                  className="g3 color-swatches-g3"
                  style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                >
                  {[
                    {
                      label: "Primary",
                      field: "primaryColor",
                      hint: "Buttons, accents",
                    },
                    {
                      label: "Background",
                      field: "secondaryColor",
                      hint: "Sidebar & BG",
                    },
                    {
                      label: "Text / Accent",
                      field: "accentColor",
                      hint: "Main text",
                    },
                  ].map(({ label, field, hint }) => (
                    <div
                      key={field}
                      className="color-swatch"
                      style={{ opacity: premiumLocked ? 0.5 : 1 }}
                    >
                      <input
                        type="color"
                        value={branding[field]}
                        onChange={(e) => updateBranding(field, e.target.value)}
                        disabled={premiumLocked}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 6,
                          border: "2px solid #1a2f52",
                          padding: 1,
                          cursor: premiumLocked ? "not-allowed" : "pointer",
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
                          style={{
                            fontSize: 10,
                            color: "#2a3e5a",
                            marginTop: 1,
                          }}
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
                          {branding[field]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ margin: "14px 0 4px" }}>
                <ToggleRow
                  icon="🚫"
                  title="Remove Footer Branding"
                  desc="Hide 'Powered by Khizar Overseas' from student dashboard."
                  on={branding.features.removeKhizarBranding}
                  locked={premiumLocked}
                  onLockedClick={handleUpgrade}
                  onChange={() =>
                    updateFeature(
                      "removeKhizarBranding",
                      !branding.features.removeKhizarBranding,
                    )
                  }
                />
                <div className="tog-divider" />
                <ToggleRow
                  icon="✉️"
                  title="Custom Email Branding"
                  desc="Use your brand name and colors in all student notification emails."
                  on={branding.features.customEmailBranding}
                  locked={premiumLocked}
                  onLockedClick={handleUpgrade}
                  onChange={() =>
                    updateFeature(
                      "customEmailBranding",
                      !branding.features.customEmailBranding,
                    )
                  }
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <Field
                  label="Footer Text (Premium)"
                  hint="Shown in the student dashboard footer."
                >
                  <textarea
                    className="fi"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.65,
                      minHeight: 72,
                    }}
                    value={branding.footerText}
                    onChange={(e) =>
                      updateBranding("footerText", e.target.value)
                    }
                    placeholder="Powered by Khizar Overseas"
                    disabled={premiumLocked}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* ── EMAIL TEMPLATES ───────────────────────────────── */}
          <div
            id="email"
            ref={(el) => {
              refs.current.email = el;
            }}
            className="s-anchor section-block"
            style={{ marginBottom: 32 }}
          >
            <SectionHead>Email Templates</SectionHead>

            <div
              style={{ ...cardStyle, position: "relative" }}
              className="card-shine"
            >
              {premiumLocked && (
                <div className="lockedOverlay">
                  <div
                    style={{
                      textAlign: "center",
                      maxWidth: 300,
                      padding: "0 16px",
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✉️</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#e8f0ff",
                        marginBottom: 6,
                      }}
                    >
                      Branded Email Templates
                    </div>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "#6a8ab0",
                        lineHeight: 1.7,
                        marginBottom: 14,
                      }}
                    >
                      Customize welcome, deadline reminder, and offer emails
                      with your own brand voice. Premium only.
                    </p>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#f59e0b",
                        marginBottom: 12,
                      }}
                    >
                      ₹999
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#6a8ab0",
                        }}
                      >
                        /month
                      </span>
                    </div>
                    <button className="btn-gold" onClick={handleUpgrade}>
                      Unlock Email Templates
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#e8f0ff",
                    marginBottom: 4,
                  }}
                >
                  Email Templates <LockBadge />
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#2e4570",
                    lineHeight: 1.6,
                    marginBottom: 8,
                  }}
                >
                  Customize automated emails sent to your students.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {[
                    "{brandName}",
                    "{studentName}",
                    "{counselorName}",
                    "{universityName}",
                    "{deadline}",
                  ].map((v) => (
                    <span key={v} className="email-var">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#1e3454",
                    textTransform: "uppercase",
                    letterSpacing: ".1em",
                    marginBottom: 10,
                    borderBottom: "1px solid #0a1525",
                    paddingBottom: 7,
                  }}
                >
                  Sender Details
                </div>
                {/* Sender details — single col on mobile */}
                <div className="g2 sender-g2">
                  <Field label="Sender Name">
                    <input
                      className="fi"
                      style={inputStyle}
                      value={emailSettings.senderName}
                      onChange={(e) =>
                        updateEmail("senderName", e.target.value)
                      }
                      placeholder="Your Name"
                      disabled={premiumLocked}
                    />
                  </Field>
                  <Field label="Reply-To Email">
                    <input
                      className="fi"
                      style={inputStyle}
                      value={emailSettings.senderEmail}
                      onChange={(e) =>
                        updateEmail("senderEmail", e.target.value)
                      }
                      placeholder="your@email.com"
                      disabled={premiumLocked}
                    />
                  </Field>
                </div>
              </div>

              {[
                {
                  key: "welcome",
                  icon: "👋",
                  label: "Welcome Email",
                  desc: "Sent when a student registers under your profile.",
                  subjectKey: "welcomeSubject",
                  bodyKey: "welcomeBody",
                },
                {
                  key: "reminder",
                  icon: "📅",
                  label: "Deadline Reminder",
                  desc: "Sent automatically before application deadlines.",
                  subjectKey: "reminderSubject",
                  bodyKey: "reminderBody",
                },
                {
                  key: "offer",
                  icon: "🎉",
                  label: "Offer Notification",
                  desc: "Sent when a student receives a university offer.",
                  subjectKey: "offerSubject",
                  bodyKey: "offerBody",
                },
              ].map(({ key, icon, label, desc, subjectKey, bodyKey }) => (
                <div
                  key={key}
                  className="email-tpl-card"
                  style={{
                    marginBottom: 16,
                    background: "#070c18",
                    border: "1px solid #0f1c31",
                    borderRadius: 11,
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      marginBottom: 12,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#b0c4de",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#2a3e5a", marginTop: 1 }}
                      >
                        {desc}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <Field label="Subject Line">
                      <input
                        className="fi"
                        style={inputStyle}
                        value={emailSettings[subjectKey]}
                        onChange={(e) =>
                          updateEmail(subjectKey, e.target.value)
                        }
                        disabled={premiumLocked}
                      />
                    </Field>
                    <Field label="Email Body">
                      <textarea
                        className="fi"
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          lineHeight: 1.65,
                          minHeight: 110,
                        }}
                        value={emailSettings[bodyKey]}
                        onChange={(e) => updateEmail(bodyKey, e.target.value)}
                        disabled={premiumLocked}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SUBSCRIPTION ─────────────────────────────────── */}
          <div
            id="subscription"
            ref={(el) => {
              refs.current.subscription = el;
            }}
            className="s-anchor section-block"
            style={{ marginBottom: 20 }}
          >
            <SectionHead>Subscription</SectionHead>

            <div style={cardStyle} className="card-shine">
              {/* Subscription row — stacks on mobile */}
              <div className="sub-panel-row">
                <div
                  className="sub-plan-info"
                  style={{ flex: 1, minWidth: 240 }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#e8f0ff",
                      marginBottom: 6,
                    }}
                  >
                    Current Plan:{" "}
                    <span style={{ color: isPremium ? "#f59e0b" : "#60a5fa" }}>
                      {isPremium ? "⭐ Premium" : "Standard"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#2e4570",
                      lineHeight: 1.7,
                      marginBottom: 14,
                    }}
                  >
                    Standard: brand name + logo upload only.{" "}
                    <strong style={{ color: "#4a6e9a" }}>Premium</strong>{" "}
                    unlocks tagline, favicon, dashboard colors, remove branding,
                    email templates, and footer text.
                  </p>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    <span className="badge bg">✓ Brand Name</span>
                    <span className="badge bg">✓ Logo</span>
                    <span className={cls("badge", isPremium ? "bp" : "ba")}>
                      {isPremium ? "⭐ Premium Active" : "🔒 Premium Locked"}
                    </span>
                  </div>
                </div>

                <div
                  className="stat-pill sub-stat-pill"
                  style={{
                    minWidth: 220,
                    background: isPremium
                      ? "linear-gradient(135deg, rgba(245,158,11,.08), rgba(217,119,6,.05))"
                      : "#070c18",
                    border: isPremium
                      ? "1px solid rgba(245,158,11,.25)"
                      : "1px solid #0f1c31",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: isPremium ? "#d97706" : "#2e4570",
                      fontWeight: 700,
                    }}
                  >
                    {isPremium ? "Premium Expires" : "Upgrade to Premium"}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 20,
                      fontWeight: 800,
                      color: isPremium ? "#f59e0b" : "#e8f0ff",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {isPremium
                      ? formatExpiry(branding.premiumExpiresAt) || "Active"
                      : "₹999"}
                    {!isPremium && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#3d5a7e",
                        }}
                      >
                        /month
                      </span>
                    )}
                  </div>
                  {!isPremium && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "#2e4570",
                        marginTop: 4,
                        marginBottom: 10,
                        lineHeight: 1.5,
                      }}
                    >
                      Full white-label dashboard + branded emails
                    </p>
                  )}
                  <button
                    className={isPremium ? "btn-danger" : "btn-gold"}
                    style={{ marginTop: 12, width: "100%", padding: "10px" }}
                    onClick={
                      isPremium ? () => setCancelConfirm(true) : handleUpgrade
                    }
                  >
                    {isPremium ? "Cancel Subscription" : "Upgrade Now →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Benefits grid */}
            <div style={cardStyle} className="card-shine">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#e8f0ff",
                  marginBottom: 14,
                }}
              >
                What's included in Premium
              </div>
              <div className="benefits-grid">
                {[
                  {
                    icon: "🎨",
                    title: "Custom Colors",
                    desc: "Full dashboard color control",
                  },
                  {
                    icon: "🚫",
                    title: "Remove Footer",
                    desc: "Hide Khizar Overseas branding",
                  },
                  {
                    icon: "✉️",
                    title: "Branded Emails",
                    desc: "Custom welcome & reminder emails",
                  },
                  {
                    icon: "🏷️",
                    title: "Tagline & Favicon",
                    desc: "Complete brand identity",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      background: "#070c18",
                      border: "1px solid #0f1c31",
                      borderRadius: 10,
                      padding: "13px 14px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: isPremium ? "#f59e0b" : "#60a5fa",
                          marginBottom: 3,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#2a3e5a",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!isPremium && (
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button className="btn-gold" onClick={handleUpgrade}>
                    Upgrade Now — ₹999/month
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom save bar */}
          <div className="bottom-save-bar">
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6a8ab0" }}>
                Save all changes
              </div>
              <div style={{ fontSize: 11.5, color: "#1e3050", marginTop: 2 }}>
                Review your settings above before saving.
              </div>
            </div>
            <div className="bottom-save-bar-actions">
              <button className="btn-g">Reset to Defaults</button>
              <button className="btn-p" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Live Preview ─────────────────────────────── */}
        <div className="preview-panel">
          <div
            style={{
              background: "#090f1e",
              border: "1px solid #0e1d36",
              borderRadius: 16,
              padding: "18px",
              marginBottom: 14,
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
              <div className="live-dot" />
              <div style={{ fontSize: 12, fontWeight: 700, color: "#b0c4de" }}>
                Live Student Dashboard Preview
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
            <StudentDashboardPreview branding={branding} profile={profile} />
          </div>

          <div
            style={{
              background: "#090f1e",
              border: "1px solid #0e1d36",
              borderRadius: 12,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1e3454",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                marginBottom: 10,
              }}
            >
              Current Brand Colors
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Primary", val: branding.primaryColor },
                { label: "Background", val: branding.secondaryColor },
                { label: "Accent", val: branding.accentColor },
              ].map(({ label, val }) => (
                <div key={label} style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{
                      width: "100%",
                      height: 28,
                      borderRadius: 7,
                      background: val,
                      border: "1px solid rgba(255,255,255,.07)",
                      marginBottom: 5,
                    }}
                  />
                  <div
                    style={{ fontSize: 10, color: "#2a3e5a", fontWeight: 600 }}
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

            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "#070c18",
                border: "1px solid #0f1c31",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              {branding.logoPreview ? (
                <img
                  src={branding.logoPreview}
                  alt="Brand logo"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    background: `${branding.primaryColor}22`,
                    border: `1px solid ${branding.primaryColor}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    color: branding.primaryColor,
                  }}
                >
                  {branding.brandName.slice(0, 2).toUpperCase() || "??"}
                </div>
              )}
              <div>
                <div
                  style={{ fontSize: 12, fontWeight: 700, color: "#b0c4de" }}
                >
                  {branding.brandName}
                </div>
                <div style={{ fontSize: 10.5, color: "#2a3e5a" }}>
                  {branding.tagline}
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span
                  className={cls("badge", isPremium ? "bp" : "ba")}
                  style={{ fontSize: 9.5 }}
                >
                  {isPremium ? "⭐ Premium" : "Standard"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile FAB (Save) — hidden on desktop ──────────────── */}
      <button
        className="mobile-fab"
        onClick={handleSave}
        disabled={saving}
        aria-label="Save settings"
      >
        {saving ? (
          <>
            <span
              style={{
                width: 14,
                height: 14,
                border: "2px solid rgba(255,255,255,.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin .6s linear infinite",
                flexShrink: 0,
              }}
            />
            Saving…
          </>
        ) : saved ? (
          "✓ Saved!"
        ) : (
          "💾 Save Changes"
        )}
      </button>

      {/* ── Mobile Preview Overlay ─────────────────────────────── */}
      {showPreview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.85)",
            backdropFilter: "blur(10px)",
            zIndex: 100,
            padding: 20,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => setShowPreview(false)}
        >
          <div
            style={{ maxWidth: 440, margin: "auto", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#e8f0ff",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div className="live-dot" />
                Live Preview
              </div>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  background: "#0f1c31",
                  border: "1px solid #1a2f52",
                  borderRadius: 7,
                  color: "#7a9ac0",
                  padding: "5px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Close ✕
              </button>
            </div>
            <StudentDashboardPreview branding={branding} profile={profile} />
          </div>
        </div>
      )}

      {/* ── Upgrade Modal (Razorpay) ───────────────────────────── */}
      {upgradeModal && (
        <div
          className="modal-bg"
          onClick={() => !paying && setUpgradeModal(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setUpgradeModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                color: "#2a3e5a",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#e8f0ff",
                  letterSpacing: "-0.03em",
                  marginBottom: 6,
                }}
              >
                Upgrade to Premium
              </div>
              <p style={{ fontSize: 13, color: "#4a6e9a", lineHeight: 1.7 }}>
                Full white-label control over your student dashboard and all
                automated emails.
              </p>
            </div>

            <div
              style={{
                background: "#070c18",
                border: "1px solid #0f1c31",
                borderRadius: 12,
                padding: "18px",
                marginBottom: 20,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#f59e0b",
                    letterSpacing: "-0.04em",
                  }}
                >
                  ₹999
                </span>
                <span
                  style={{ fontSize: 14, color: "#4a6e9a", fontWeight: 500 }}
                >
                  /month
                </span>
              </div>
              {[
                "Custom dashboard colors (primary, background, accent)",
                "Remove Khizar Overseas footer branding",
                "Custom tagline & favicon",
                "Branded welcome & reminder emails",
                "Custom email templates with your voice",
                "Priority support",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 9,
                    marginBottom: 9,
                  }}
                >
                  <span
                    style={{
                      color: "#10b981",
                      fontSize: 14,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: "#6a8ab0",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="btn-gold"
              style={{
                width: "100%",
                padding: "13px",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(255,255,255,.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin .6s linear infinite",
                    }}
                  />
                  Opening Payment…
                </>
              ) : (
                "Pay ₹999 — Activate Premium"
              )}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "#1e3454",
                marginTop: 12,
              }}
            >
              Cancel anytime · Billed monthly · Secure via Razorpay
            </p>
          </div>
        </div>
      )}

      {/* ── Cancel Confirmation Modal ──────────────────────────── */}
      {cancelConfirm && (
        <div
          className="modal-bg"
          onClick={() => !cancelling && setCancelConfirm(false)}
        >
          <div
            className="modal-box"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#e8f0ff",
                  marginBottom: 8,
                }}
              >
                Cancel Subscription?
              </div>
              <p style={{ fontSize: 13, color: "#6a8ab0", lineHeight: 1.7 }}>
                Your premium access will remain active
                {branding.premiumExpiresAt
                  ? ` until ${formatExpiry(branding.premiumExpiresAt)}`
                  : " until the end of the current billing period"}
                . After that, your account will revert to the Standard plan.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-g"
                style={{ flex: 1 }}
                onClick={() => setCancelConfirm(false)}
                disabled={cancelling}
              >
                Keep Premium
              </button>
              <button
                className="btn-danger"
                style={{ flex: 1 }}
                onClick={handleCancelSubscription}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling…" : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toasts ─────────────────────────────────────────────── */}
      {saved && (
        <div className="toast">
          {isPremium
            ? "⭐ Premium activated! Subscription scheduled for cancellation."
            : "✓ Settings saved successfully"}
        </div>
      )}

      {saveError && (
        <div
          className="toast"
          style={{
            background: "#ef4444",
            boxShadow: "0 8px 28px rgba(239,68,68,.4)",
          }}
        >
          ⚠️ {saveError}
        </div>
      )}
    </div>
  );
}
