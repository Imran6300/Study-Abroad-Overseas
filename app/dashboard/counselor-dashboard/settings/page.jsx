"use client";
import { useState, useRef } from "react";

const cls = (...args) => args.filter(Boolean).join(" ");

const COUNTRIES = [
  "Canada",
  "USA",
  "United Kingdom",
  "Australia",
  "Germany",
  "New Zealand",
  "Ireland",
  "Netherlands",
  "Singapore",
  "UAE",
];
const TIMEZONES = [
  "Asia/Kolkata (IST +5:30)",
  "America/Toronto (EST -5:00)",
  "America/New_York (EST -5:00)",
  "Europe/London (GMT +0:00)",
  "Australia/Sydney (AEDT +11:00)",
  "Asia/Dubai (GST +4:00)",
];
const INTAKES = [
  "Fall 2025",
  "Spring 2026",
  "Summer 2026",
  "Fall 2026",
  "Spring 2027",
];
const LANGUAGES = [
  "English",
  "Hindi",
  "Urdu",
  "Arabic",
  "French",
  "Mandarin",
  "Telugu",
  "Tamil",
];
const SECTIONS = ["profile", "notifications", "security", "workflow"];

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return {
    score: s,
    label: ["", "Weak", "Fair", "Good", "Strong"][s],
    color: ["", "#ef4444", "#f59e0b", "#60a5fa", "#10b981"][s],
  };
};

export default function CounselorSettingsPage() {
  const [active, setActive] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [countries, setCountries] = useState([
    "Canada",
    "USA",
    "United Kingdom",
  ]);
  const [twoFA, setTwoFA] = useState(false);
  const [pw, setPw] = useState("");
  const [showSessions, setShowSessions] = useState(false);
  const sectionRefs = useRef({});

  const [notifs, setNotifs] = useState({
    appUpdates: true,
    visaAlerts: true,
    deadlines: true,
    studentMsgs: false,
    weeklyReport: false,
    smsAlerts: false,
  });
  const [integrations, setIntegrations] = useState({
    googleCal: true,
    whatsapp: true,
    zoom: false,
    gmail: false,
    notion: false,
  });

  const strength = getStrength(pw);

  const scrollTo = (id) => {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2800);
  };

  const toggleCountry = (c) =>
    setCountries((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1a2744; border-radius: 9px; }
        button, input, select, textarea { font-family: inherit; }

        .stab { padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #3d5575; background: none; border: none; cursor: pointer; transition: all .15s; white-space: nowrap; }
        .stab:hover { color: #7fa0c8; background: rgba(255,255,255,.03); }
        .stab.on { color: #e2eaf8; background: #0f1e36; border: 1px solid #1a2f52; }

        .s-anchor { scroll-margin-top: 72px; }

        .s-head { font-size: 10.5px; font-weight: 700; color: #1e3050; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
        .s-head::after { content: ''; flex: 1; height: 1px; background: #0a1525; }

        .card { background: #090f1e; border: 1px solid #101d34; border-radius: 14px; padding: 22px; position: relative; overflow: hidden; }
        .card::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: linear-gradient(90deg, transparent 5%, #152040 40%, #152040 60%, transparent 95%); }

        .fi { width: 100%; background: #070c18; border: 1px solid #0f1c31; border-radius: 9px; padding: 10px 13px; color: #d0daf0; font-size: 13.5px; outline: none; transition: border .15s, box-shadow .15s; -webkit-appearance: none; }
        .fi::placeholder { color: #243554; }
        .fi:hover:not(:focus) { border-color: #172540; }
        .fi:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.13); }
        select.fi { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23243554'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 13px center; padding-right: 32px; }
        textarea.fi { resize: vertical; line-height: 1.65; min-height: 88px; }
        .fl { display: block; font-size: 11px; font-weight: 600; color: #2a3f5e; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 6px; }

        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media(max-width:640px){ .g2,.g3{ grid-template-columns:1fr; } }

        .tog-track { width: 42px; height: 23px; border-radius: 99px; border: none; cursor: pointer; position: relative; flex-shrink: 0; transition: background .2s; }
        .tog-thumb { position: absolute; top: 3px; width: 17px; height: 17px; border-radius: 50%; background: #fff; transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.4); }

        .btn-p { padding: 10px 22px; border-radius: 9px; font-size: 13.5px; font-weight: 600; background: #1d4ed8; color: #fff; border: none; cursor: pointer; transition: all .15s; }
        .btn-p:hover { background: #2563eb; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,.28); }
        .btn-p:active { transform: none; }
        .btn-g { padding: 10px 20px; border-radius: 9px; font-size: 13px; font-weight: 500; background: transparent; color: #4a607d; border: 1px solid #0f1c31; cursor: pointer; transition: all .15s; }
        .btn-g:hover { background: #0a1322; color: #7a9ac0; border-color: #172540; }
        .btn-sm { padding: 7px 14px; border-radius: 7px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; transition: all .15s; }

        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 5px; font-size: 11px; font-weight: 700; letter-spacing: .02em; }
        .bg { background: rgba(16,185,129,.1); color: #10b981; border: 1px solid rgba(16,185,129,.18); }
        .ba { background: rgba(245,158,11,.1); color: #f59e0b; border: 1px solid rgba(245,158,11,.18); }
        .bb { background: rgba(59,130,246,.1); color: #60a5fa; border: 1px solid rgba(59,130,246,.18); }
        .br { background: rgba(239,68,68,.1); color: #f87171; border: 1px solid rgba(239,68,68,.18); }

        .stat-pill { background: #070c18; border: 1px solid #0f1c31; border-radius: 10px; padding: 13px 16px; }

        .chip { padding: 6px 13px; border-radius: 7px; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .15s; border: 1px solid #0f1c31; background: #070c18; color: #2e4570; }
        .chip:hover { border-color: #1a2f52; color: #7fa0c8; }
        .chip.on { background: rgba(37,99,235,.1); border-color: rgba(37,99,235,.35); color: #60a5fa; }

        .divrow { height: 1px; background: #080f1c; }

        .pw-bar-wrap { height: 4px; background: #0a1525; border-radius: 99px; overflow: hidden; margin-top: 8px; }
        .pw-bar { height: 100%; border-radius: 99px; transition: width .35s, background .35s; }

        .act-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid #080f1c; }
        .act-row:last-child { border-bottom: none; padding-bottom: 0; }

        .int-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 0; border-bottom: 1px solid #080f1c; }
        .int-row:last-child { border-bottom: none; padding-bottom: 0; }

        .toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: #10b981; color: #fff; padding: 11px 24px; border-radius: 9px; font-size: 13.5px; font-weight: 600; z-index: 999; box-shadow: 0 8px 28px rgba(16,185,129,.35); animation: toastIn .3s ease; white-space: nowrap; }
        @keyframes toastIn { from{ opacity:0;transform:translateX(-50%) translateY(10px); } to{ opacity:1;transform:translateX(-50%) translateY(0); } }

        .sticky-nav { position: sticky; top: 0; z-index: 50; background: rgba(6,11,23,.94); backdrop-filter: blur(14px); border-bottom: 1px solid #0a1525; }

        .ava { width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg,#1a3366,#2563eb,#6d28d9); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #fff; flex-shrink: 0; position: relative; box-shadow: 0 0 0 2px #090f1e, 0 0 0 4px #162444; letter-spacing: -.5px; }
        .ava .dot { position: absolute; bottom: 3px; right: 3px; width: 12px; height: 12px; border-radius: 50%; background: #10b981; border: 2px solid #090f1e; }
        .upload-btn { margin-top: 6px; font-size: 11.5px; color: #2563eb; background: none; border: none; cursor: pointer; font-weight: 600; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 3px; padding: 0; }
        .upload-btn:hover { color: #60a5fa; }
      `}</style>

      {/* ── STICKY TOP NAV ── */}
      <div className="sticky-nav">
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              overflowX: "auto",
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
                    notifications: "Notifications",
                    security: "Security",
                    workflow: "Workflow",
                  }[id]
                }
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              className="btn-g"
              style={{ padding: "7px 16px", fontSize: 13 }}
            >
              Discard
            </button>
            <button
              className="btn-p"
              style={{ padding: "7px 18px", fontSize: 13 }}
              onClick={handleSave}
            >
              {saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div
        style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px 80px" }}
      >
        {/* PAGE HEADER */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#e8f0ff",
              letterSpacing: "-0.04em",
              marginBottom: 5,
            }}
          >
            Account Settings
          </h1>
          <p style={{ fontSize: 13.5, color: "#2e4570", lineHeight: 1.6 }}>
            Manage your profile, notifications, security and counselor workflow
            preferences.
          </p>
        </div>

        {/* ══════════ PROFILE ══════════ */}
        <div
          id="profile"
          ref={(el) => (sectionRefs.current.profile = el)}
          className="s-anchor"
          style={{ marginBottom: 36 }}
        >
          <div className="s-head">Profile</div>

          {/* IDENTITY */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className="ava">
                  SM
                  <div className="dot" />
                </div>
                <button className="upload-btn">Change photo</button>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#e8f0ff",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Syed Mubashir
                  </span>
                  <span className="badge bg">● Active</span>
                  <span className="badge bb">Senior Counselor</span>
                </div>
                <p
                  style={{
                    fontSize: 12.5,
                    color: "#2e4570",
                    marginBottom: 16,
                    lineHeight: 1.6,
                  }}
                >
                  mubashir@overseas.com &nbsp;·&nbsp; Hyderabad, India
                  &nbsp;·&nbsp; Member since Jan 2019
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { v: "142", l: "Students" },
                    { v: "87%", l: "Visa Success" },
                    { v: "4.9★", l: "Rating" },
                    { v: "6 yrs", l: "Experience" },
                  ].map((s) => (
                    <div key={s.l} className="stat-pill">
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#60a5fa",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {s.v}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: "#2a3e5a",
                          fontWeight: 600,
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
          </div>

          {/* PERSONAL INFO */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#6a8ab0",
                marginBottom: 16,
              }}
            >
              Personal Information
            </div>
            <div className="g2" style={{ marginBottom: 14 }}>
              <Field label="Full Name">
                <input className="fi" defaultValue="Syed Mubashir" />
              </Field>
              <Field label="Designation">
                <input className="fi" defaultValue="Senior Counselor" />
              </Field>
              <Field label="Professional Email">
                <input
                  className="fi"
                  type="email"
                  defaultValue="mubashir@overseas.com"
                />
              </Field>
              <Field label="Phone Number">
                <input
                  className="fi"
                  type="tel"
                  defaultValue="+91 98765 43210"
                />
              </Field>
              <Field label="City / Location">
                <input className="fi" defaultValue="Hyderabad, India" />
              </Field>
              <Field label="Primary Language">
                <select className="fi">
                  {LANGUAGES.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Professional Bio">
              <textarea
                className="fi"
                defaultValue="Helping students navigate overseas admissions, visa guidance, and application management. Specializing in Canada, UK, and Australia pathways since 2018."
              />
            </Field>
          </div>

          {/* SPECIALIZATION COUNTRIES */}
          <div className="card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6a8ab0" }}>
                Specialization Countries
              </div>
              <span style={{ fontSize: 11.5, color: "#1e3050" }}>
                {countries.length} selected
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#1e3050", marginBottom: 14 }}>
              Countries you actively counsel students for.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  className={cls("chip", countries.includes(c) && "on")}
                  onClick={() => toggleCountry(c)}
                >
                  {countries.includes(c) ? "✓ " : ""}
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════ NOTIFICATIONS ══════════ */}
        <div
          id="notifications"
          ref={(el) => (sectionRefs.current.notifications = el)}
          className="s-anchor"
          style={{ marginBottom: 36 }}
        >
          <div className="s-head">Notifications</div>

          <div className="card" style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#6a8ab0",
                marginBottom: 16,
              }}
            >
              Alerts & Updates
            </div>
            {[
              {
                k: "appUpdates",
                icon: "📋",
                t: "Application Updates",
                d: "Status changes across all student applications",
              },
              {
                k: "visaAlerts",
                icon: "🛂",
                t: "Visa Decision Alerts",
                d: "Approvals, rejections and embassy notifications",
              },
              {
                k: "deadlines",
                icon: "⏰",
                t: "Deadline Reminders",
                d: "7-day, 3-day and 24-hour warnings",
              },
              {
                k: "studentMsgs",
                icon: "💬",
                t: "Student Messages",
                d: "In-app alerts for new student messages",
              },
              {
                k: "weeklyReport",
                icon: "📊",
                t: "Weekly Activity Report",
                d: "Counseling summary delivered every Monday",
              },
              {
                k: "smsAlerts",
                icon: "📱",
                t: "SMS Alerts",
                d: "Critical alerts sent via SMS",
              },
            ].map((item, i, arr) => (
              <div key={item.k}>
                <ToggleRow
                  icon={item.icon}
                  title={item.t}
                  desc={item.d}
                  on={notifs[item.k]}
                  onChange={() =>
                    setNotifs((p) => ({ ...p, [item.k]: !p[item.k] }))
                  }
                />
                {i < arr.length - 1 && <div className="divrow" />}
              </div>
            ))}
          </div>

          <div className="card">
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#6a8ab0",
                marginBottom: 16,
              }}
            >
              Delivery Preferences
            </div>
            <div className="g2" style={{ marginBottom: 14 }}>
              <Field label="Email Digest">
                <select className="fi">
                  <option>Real-time (immediately)</option>
                  <option>Hourly digest</option>
                  <option>Daily digest — 9 AM</option>
                  <option>Weekly digest</option>
                </select>
              </Field>
              <Field label="Notification Sound">
                <select className="fi">
                  <option>Default chime</option>
                  <option>Subtle</option>
                  <option>None</option>
                </select>
              </Field>
            </div>
            <div className="g2">
              <Field label="Quiet Hours — From">
                <input className="fi" type="time" defaultValue="22:00" />
              </Field>
              <Field label="Quiet Hours — To">
                <input className="fi" type="time" defaultValue="07:00" />
              </Field>
            </div>
          </div>
        </div>

        {/* ══════════ SECURITY ══════════ */}
        <div
          id="security"
          ref={(el) => (sectionRefs.current.security = el)}
          className="s-anchor"
          style={{ marginBottom: 36 }}
        >
          <div className="s-head">Security</div>

          <div className="g2" style={{ marginBottom: 12, alignItems: "start" }}>
            {/* PASSWORD */}
            <div className="card">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6a8ab0",
                  marginBottom: 16,
                }}
              >
                Change Password
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 13 }}
              >
                <Field label="Current Password">
                  <input
                    className="fi"
                    type="password"
                    placeholder="Enter current password"
                  />
                </Field>
                <Field label="New Password">
                  <input
                    className="fi"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                  />
                  {pw && (
                    <div>
                      <div className="pw-bar-wrap">
                        <div
                          className="pw-bar"
                          style={{
                            width: `${strength.score * 25}%`,
                            background: strength.color,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: strength.color,
                          marginTop: 4,
                          fontWeight: 600,
                        }}
                      >
                        {strength.label} password
                      </div>
                    </div>
                  )}
                </Field>
                <Field label="Confirm Password">
                  <input
                    className="fi"
                    type="password"
                    placeholder="Re-enter new password"
                  />
                </Field>
              </div>
              <button
                className="btn-p"
                style={{ marginTop: 18, width: "100%" }}
              >
                Update Password
              </button>
            </div>

            {/* 2FA + SESSIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#6a8ab0",
                        marginBottom: 4,
                      }}
                    >
                      Two-Factor Auth
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "#1e3050",
                        lineHeight: 1.55,
                      }}
                    >
                      Adds an extra layer of protection to your account.
                    </div>
                  </div>
                  <span className={cls("badge", twoFA ? "bg" : "ba")}>
                    {twoFA ? "ON" : "OFF"}
                  </span>
                </div>
                <button
                  onClick={() => setTwoFA((p) => !p)}
                  className={twoFA ? "btn-g" : "btn-p"}
                  style={{ width: "100%", fontSize: 13 }}
                >
                  {twoFA ? "Disable 2FA" : "Enable 2FA →"}
                </button>
                {twoFA && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px 13px",
                      background: "rgba(16,185,129,.07)",
                      border: "1px solid rgba(16,185,129,.15)",
                      borderRadius: 8,
                      fontSize: 12.5,
                      color: "#10b981",
                    }}
                  >
                    ✓ Your account is protected with 2FA.
                  </div>
                )}
              </div>

              <div className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#6a8ab0" }}
                  >
                    Active Sessions
                  </div>
                  <button
                    style={{
                      fontSize: 12,
                      color: "#3b82f6",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                    onClick={() => setShowSessions((p) => !p)}
                  >
                    {showSessions ? "Hide" : "View all"}
                  </button>
                </div>
                {[
                  {
                    device: "Chrome · Windows",
                    loc: "Hyderabad, IN",
                    time: "Now",
                    current: true,
                  },
                  {
                    device: "iOS App",
                    loc: "Hyderabad, IN",
                    time: "Yesterday 6:15 PM",
                    current: false,
                  },
                  ...(showSessions
                    ? [
                        {
                          device: "Firefox · MacOS",
                          loc: "Mumbai, IN",
                          time: "May 9, 3:28 PM",
                          current: false,
                        },
                      ]
                    : []),
                ].map((s) => (
                  <div className="act-row" key={s.time}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 11 }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "#070c18",
                          border: "1px solid #0f1c31",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                        }}
                      >
                        {s.device.includes("iOS") ? "📱" : "💻"}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: "#b8cbe4",
                          }}
                        >
                          {s.device}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#1e3050",
                            marginTop: 2,
                          }}
                        >
                          {s.loc} · {s.time}
                        </div>
                      </div>
                    </div>
                    {s.current ? (
                      <span className="badge bg">Current</span>
                    ) : (
                      <button
                        style={{
                          fontSize: 12,
                          color: "#f87171",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(239,68,68,.04)",
              border: "1px solid rgba(239,68,68,.12)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#f87171",
                  marginBottom: 3,
                }}
              >
                Delete Account
              </div>
              <div style={{ fontSize: 12.5, color: "#3d5575" }}>
                Permanently remove your account and all data. This cannot be
                undone.
              </div>
            </div>
            <button
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: "transparent",
                border: "1px solid rgba(239,68,68,.3)",
                color: "#f87171",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* ══════════ WORKFLOW ══════════ */}
        <div
          id="workflow"
          ref={(el) => (sectionRefs.current.workflow = el)}
          className="s-anchor"
          style={{ marginBottom: 36 }}
        >
          <div className="s-head">Workflow</div>

          <div className="g2" style={{ marginBottom: 12, alignItems: "start" }}>
            <div className="card">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6a8ab0",
                  marginBottom: 16,
                }}
              >
                Regional Settings
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 13 }}
              >
                <Field label="Timezone">
                  <select className="fi">
                    {TIMEZONES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Date Format">
                  <select className="fi">
                    <option>DD / MM / YYYY</option>
                    <option>MM / DD / YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </Field>
                <Field label="Currency Display">
                  <select className="fi">
                    <option>INR — ₹</option>
                    <option>USD — $</option>
                    <option>GBP — £</option>
                    <option>CAD — C$</option>
                  </select>
                </Field>
                <Field label="Primary Language">
                  <select className="fi">
                    {LANGUAGES.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="card">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6a8ab0",
                  marginBottom: 16,
                }}
              >
                Dashboard Preferences
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 13 }}
              >
                <Field label="Default Intake">
                  <select className="fi">
                    {INTAKES.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Default Landing View">
                  <select className="fi">
                    <option>Overview Dashboard</option>
                    <option>Student Pipeline</option>
                    <option>Application Tracker</option>
                    <option>Calendar</option>
                  </select>
                </Field>
                <Field label="Students Per Page">
                  <select className="fi">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </Field>
                <Field label="Sort Applications By">
                  <select className="fi">
                    <option>Last Updated</option>
                    <option>Deadline (soonest)</option>
                    <option>Student Name</option>
                    <option>Status</option>
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* INTEGRATIONS */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#6a8ab0",
                marginBottom: 4,
              }}
            >
              Connected Integrations
            </div>
            <p style={{ fontSize: 12, color: "#1e3050", marginBottom: 14 }}>
              Sync your tools and communication channels.
            </p>
            {[
              {
                k: "googleCal",
                icon: "📅",
                name: "Google Calendar",
                desc: "Sync sessions and deadlines",
              },
              {
                k: "whatsapp",
                icon: "💬",
                name: "WhatsApp Business",
                desc: "Automated student reminders",
              },
              {
                k: "zoom",
                icon: "🎥",
                name: "Zoom",
                desc: "Video counseling sessions",
              },
              {
                k: "gmail",
                icon: "📧",
                name: "Gmail",
                desc: "Send updates from Gmail",
              },
              {
                k: "notion",
                icon: "📝",
                name: "Notion",
                desc: "Sync student notes",
              },
            ].map((item, i, arr) => (
              <div key={item.k}>
                <div className="int-row">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 13 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: "#070c18",
                        border: "1px solid #0f1c31",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 17,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#b8cbe4",
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#1e3050",
                          marginTop: 2,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className={cls(
                        "badge",
                        integrations[item.k] ? "bg" : "bb",
                      )}
                    >
                      {integrations[item.k] ? "Connected" : "Connect"}
                    </span>
                    <button
                      className="btn-sm"
                      onClick={() =>
                        setIntegrations((p) => ({ ...p, [item.k]: !p[item.k] }))
                      }
                      style={{
                        background: integrations[item.k]
                          ? "transparent"
                          : "rgba(37,99,235,.12)",
                        color: integrations[item.k] ? "#2e4570" : "#60a5fa",
                        border: `1px solid ${integrations[item.k] ? "#0f1c31" : "rgba(37,99,235,.28)"}`,
                      }}
                    >
                      {integrations[item.k] ? "Disconnect" : "Connect →"}
                    </button>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="divrow" />}
              </div>
            ))}
          </div>

          {/* AI TEASER */}
          <div
            style={{
              padding: "20px 24px",
              background: "#090f1e",
              border: "1px solid #1a2f52",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(37,99,235,.09) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 16 }}>✦</span>
                <span
                  style={{ fontSize: 13.5, fontWeight: 700, color: "#c0cfe8" }}
                >
                  AI Counselor Assistant
                </span>
                <span className="badge ba">Coming Soon</span>
              </div>
              <p style={{ fontSize: 12.5, color: "#1e3050", lineHeight: 1.7 }}>
                Visa success prediction, smart document checklists, risk
                scoring, and automated student profiling — built for overseas
                education counselors.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 7,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                {[
                  "Visa Prediction",
                  "Risk Scoring",
                  "Auto-Checklists",
                  "Smart Matching",
                ].map((f) => (
                  <span
                    key={f}
                    style={{
                      padding: "4px 10px",
                      background: "rgba(245,158,11,.07)",
                      border: "1px solid rgba(245,158,11,.15)",
                      borderRadius: 5,
                      fontSize: 11,
                      color: "#f59e0b",
                      fontWeight: 600,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <button
              style={{
                padding: "9px 18px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                background: "rgba(245,158,11,.08)",
                border: "1px solid rgba(245,158,11,.22)",
                color: "#f59e0b",
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Join Waitlist →
            </button>
          </div>
        </div>

        {/* ── FOOTER SAVE BAR ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 22px",
            background: "#090f1e",
            border: "1px solid #101d34",
            borderRadius: 12,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#6a8ab0" }}>
              Save all changes
            </div>
            <div style={{ fontSize: 12, color: "#1e3050", marginTop: 2 }}>
              Review your settings above before saving.
            </div>
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <button className="btn-g">Reset to Defaults</button>
            <button className="btn-p" onClick={handleSave}>
              {saved ? "✓ Saved!" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {saved && <div className="toast">✓ Settings saved successfully</div>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="fl">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ icon, title, desc, on, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 0",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <span
          style={{
            fontSize: 18,
            width: 24,
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: "#b0c4de" }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "#1e3050", marginTop: 2 }}>
            {desc}
          </div>
        </div>
      </div>
      <button
        className="tog-track"
        onClick={onChange}
        role="switch"
        aria-checked={on}
        style={{ background: on ? "#1d4ed8" : "#0f1c31" }}
      >
        <span
          className="tog-thumb"
          style={{ transform: on ? "translateX(20px)" : "translateX(3px)" }}
        />
      </button>
    </div>
  );
}
