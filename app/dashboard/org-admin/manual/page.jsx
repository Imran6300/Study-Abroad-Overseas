"use client";

/**
 * app/dashboard/org-admin/manual/page.jsx
 *
 * Full pictorial guide for the Organisation Admin Dashboard.
 * Dark-themed to match the org-admin palette (bg-[#081525], emerald accents).
 * All illustrations are pure inline SVG — no external image dependencies.
 *
 * Sections:
 *  1. Overview         — what the org-admin dashboard is
 *  2. Overview Page    — KPI cards, funnel, leaderboard, recent applications
 *  3. Counselors       — invite flow, status management, removing counselors
 *  4. Students         — org-scoped student list, pipeline stages, detail view
 *  5. Applications     — read-only cross-counselor application monitor
 *  6. Settings         — org info, logo, brand identity, white-label toggles
 *  7. Subscription     — partner plan, trial, billing, settlement
 *  8. Quick Reference  — tips and keyboard navigation
 */

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Settings,
  BookOpen,
  TrendingUp,
  Palette,
  CreditCard,
  Lightbulb,
  ChevronRight,
  ArrowLeft,
  Building2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// ─── Anchor nav ───────────────────────────────────────────────────────────────

const NAV = [
  { id: "intro", label: "Introduction", icon: BookOpen },
  { id: "overview-page", label: "Overview Page", icon: LayoutDashboard },
  { id: "counselors", label: "Counselors", icon: Users },
  { id: "students", label: "Students", icon: GraduationCap },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "settings", label: "Settings & Branding", icon: Palette },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "tips", label: "Quick Reference", icon: Lightbulb },
];

// ─── Reusable section wrapper ─────────────────────────────────────────────────

function Section({ id, icon: Icon, color, title, subtitle, children }) {
  return (
    <section id={id} className="mb-20 scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shrink-0`}
        >
          <Icon size={19} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white leading-none">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

// ─── Tip box ──────────────────────────────────────────────────────────────────

function Tip({ children }) {
  return (
    <div className="flex gap-3 bg-amber-500/[0.08] border border-amber-500/20 rounded-xl p-4 mt-4">
      <Lightbulb
        size={15}
        className="text-amber-400 shrink-0 mt-0.5"
        strokeWidth={2}
      />
      <p className="text-amber-200/70 text-[13px] leading-relaxed">
        {children}
      </p>
    </div>
  );
}

// ─── Warning box ──────────────────────────────────────────────────────────────

function Warning({ children }) {
  return (
    <div className="flex gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl p-4 mt-4">
      <AlertTriangle
        size={15}
        className="text-red-400 shrink-0 mt-0.5"
        strokeWidth={2}
      />
      <p className="text-red-200/70 text-[13px] leading-relaxed">{children}</p>
    </div>
  );
}

// ─── Success callout ──────────────────────────────────────────────────────────

function Success({ children }) {
  return (
    <div className="flex gap-3 bg-emerald-500/[0.07] border border-emerald-500/20 rounded-xl p-4 mt-4">
      <CheckCircle
        size={15}
        className="text-emerald-400 shrink-0 mt-0.5"
        strokeWidth={2}
      />
      <p className="text-emerald-200/70 text-[13px] leading-relaxed">
        {children}
      </p>
    </div>
  );
}

// ─── Step list ────────────────────────────────────────────────────────────────

function Steps({ steps }) {
  return (
    <ol className="space-y-3 mt-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5">
            {i + 1}
          </div>
          <p className="text-white/50 text-[13px] leading-relaxed">{step}</p>
        </li>
      ))}
    </ol>
  );
}

// ─── Info card grid ───────────────────────────────────────────────────────────

function InfoCard({ icon: Icon, color, title, desc }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.12] transition-colors">
      <div
        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}
      >
        <Icon size={15} className="text-white" strokeWidth={2} />
      </div>
      <p className="text-white/80 text-[13px] font-semibold mb-1">{title}</p>
      <p className="text-white/35 text-[12px] leading-relaxed">{desc}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ILLUSTRATIONS ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

/** Illustration 1: Full dashboard layout */
function IllustDashboard() {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <svg
        viewBox="0 0 720 310"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full rounded-2xl border border-white/[0.06] shadow-xl"
      >
        <defs>
          <linearGradient id="og1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="og2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="og3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="og4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Page background */}
        <rect width="720" height="310" fill="#081525" rx="12" />

        {/* Sidebar */}
        <rect x="0" y="0" width="72" height="310" fill="#0a192f" rx="12" />
        <rect x="0" y="0" width="36" height="310" fill="#0a192f" />

        {/* Sidebar logo */}
        <rect x="18" y="16" width="36" height="36" rx="10" fill="url(#og1)" />
        <text
          x="36"
          y="39"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="800"
        >
          ORG
        </text>

        {/* Sidebar nav icons */}
        {[80, 118, 156, 194, 232].map((y, i) => (
          <rect
            key={i}
            x="20"
            y={y}
            width="32"
            height="28"
            rx="8"
            fill={i === 0 ? "#10b98120" : "transparent"}
          />
        ))}
        <rect x="27" y="87" width="18" height="14" rx="3" fill={`#10b981`} />
        {[125, 163, 201, 239].map((y, i) => (
          <rect
            key={i}
            x="27"
            y={y}
            width="18"
            height="14"
            rx="3"
            fill="#334155"
          />
        ))}
        {/* Sidebar active indicator */}
        <rect x="0" y="84" width="3" height="20" rx="2" fill="#10b981" />

        {/* Top header */}
        <rect x="72" y="0" width="648" height="50" fill="#0d2137" />
        <text x="92" y="30" fill="#ffffff" fontSize="13" fontWeight="700">
          Organisation Dashboard
        </text>
        {/* Bell icon */}
        <circle cx="680" cy="25" r="14" fill="#0a192f" />
        <circle cx="686" cy="19" r="4" fill="#10b981" />

        {/* KPI cards */}
        {[
          { x: 88, label: "Students", val: "142", color: "#10b981" },
          { x: 240, label: "Enrolled", val: "38", color: "#3b82f6" },
          { x: 392, label: "Counselors", val: "6", color: "#a855f7" },
          { x: 544, label: "Applications", val: "89", color: "#f59e0b" },
        ].map(({ x, label, val, color }) => (
          <g key={x}>
            <rect
              x={x}
              y="64"
              width="136"
              height="80"
              rx="12"
              fill="#0d2137"
              stroke="#ffffff0f"
              strokeWidth="1"
            />
            <rect
              x={x}
              y="64"
              width="70"
              height="2"
              rx="1"
              fill={color}
              opacity="0.5"
            />
            <rect
              x={x + 8}
              y="75"
              width="28"
              height="28"
              rx="8"
              fill={`${color}20`}
            />
            <rect
              x={x + 14}
              y="82"
              width="16"
              height="14"
              rx="3"
              fill={color}
              opacity="0.7"
            />
            <text
              x={x + 10}
              y="120"
              fill="white"
              fontSize="20"
              fontWeight="800"
            >
              {val}
            </text>
            <text
              x={x + 10}
              y="135"
              fill="#ffffff40"
              fontSize="8"
              fontWeight="700"
              letterSpacing="1"
            >
              {label.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Student Pipeline */}
        <rect
          x="88"
          y="158"
          width="360"
          height="140"
          rx="12"
          fill="#0d2137"
          stroke="#ffffff0f"
          strokeWidth="1"
        />
        <text
          x="104"
          y="177"
          fill="#ffffff60"
          fontSize="9"
          fontWeight="700"
          letterSpacing="1"
        >
          STUDENT PIPELINE
        </text>
        {[
          { label: "Lead", w: 280, fill: "#334155" },
          { label: "Contacted", w: 220, fill: "#3b82f640" },
          { label: "Qualified", w: 170, fill: "#6366f140" },
          { label: "Applied", w: 110, fill: "#a855f740" },
          { label: "Enrolled", w: 60, fill: "#10b98140" },
        ].map(({ label, w, fill }, i) => (
          <g key={label}>
            <rect
              x="104"
              y={188 + i * 18}
              width={w}
              height="12"
              rx="3"
              fill={fill}
            />
            <text
              x={106 + w + 6}
              y={199 + i * 18}
              fill="#ffffff30"
              fontSize="8"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Top Counselors leaderboard */}
        <rect
          x="462"
          y="158"
          width="258"
          height="140"
          rx="12"
          fill="#0d2137"
          stroke="#ffffff0f"
          strokeWidth="1"
        />
        <text
          x="478"
          y="177"
          fill="#ffffff60"
          fontSize="9"
          fontWeight="700"
          letterSpacing="1"
        >
          TOP COUNSELORS
        </text>
        {["Riya S.", "Arjun K.", "Meena P."].map((name, i) => (
          <g key={name}>
            <circle
              cx="490"
              cy={196 + i * 28}
              r="10"
              fill={["url(#og1)", "url(#og2)", "url(#og3)"][i]}
            />
            <text
              x="490"
              y={200 + i * 28}
              textAnchor="middle"
              fill="white"
              fontSize="7"
              fontWeight="700"
            >
              {name[0]}
            </text>
            <text
              x="506"
              y={200 + i * 28}
              fill="#ffffff70"
              fontSize="9"
              fontWeight="600"
            >
              {name}
            </text>
            <text
              x="690"
              y={200 + i * 28}
              textAnchor="end"
              fill="#10b981"
              fontSize="9"
              fontWeight="700"
            >
              {[14, 11, 9][i]} enrolled
            </text>
          </g>
        ))}

        {/* Footer strip */}
        <rect x="72" y="292" width="648" height="18" fill="#060d1a" />
        <text x="360" y="304" textAnchor="middle" fill="#ffffff15" fontSize="8">
          Powered by Khizar Overseas — Organisation Dashboard
        </text>
      </svg>
    </div>
  );
}

/** Illustration 2: Counselors management page */
function IllustCounselors() {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <svg
        viewBox="0 0 720 280"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full rounded-2xl border border-white/[0.06] shadow-xl"
      >
        <rect width="720" height="280" fill="#081525" rx="12" />

        {/* Header */}
        <rect x="0" y="0" width="720" height="48" fill="#0d2137" />
        <text x="20" y="29" fill="white" fontSize="13" fontWeight="700">
          Counselors
        </text>

        {/* Invite button */}
        <rect x="590" y="12" width="114" height="26" rx="8" fill="#10b981" />
        <text
          x="647"
          y="29"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="700"
        >
          + Invite Counselor
        </text>

        {/* Counselor cards */}
        {[
          {
            name: "Riya Sharma",
            email: "riya@agency.in",
            status: "active",
            students: 14,
            color: "#10b981",
          },
          {
            name: "Arjun Kumar",
            email: "arjun@agency.in",
            status: "active",
            students: 11,
            color: "#10b981",
          },
          {
            name: "Meena Patel",
            email: "meena@agency.in",
            status: "pending",
            students: 0,
            color: "#f59e0b",
          },
          {
            name: "Sana Mirza",
            email: "sana@agency.in",
            status: "inactive",
            students: 3,
            color: "#ef4444",
          },
        ].map(({ name, email, status, students, color }, i) => (
          <g key={name}>
            <rect
              x="16"
              y={60 + i * 50}
              width="688"
              height="42"
              rx="10"
              fill="#0d2137"
              stroke="#ffffff0a"
              strokeWidth="1"
            />
            {/* Avatar */}
            <circle cx="48" cy={81 + i * 50} r="14" fill={`${color}30`} />
            <text
              x="48"
              y={86 + i * 50}
              textAnchor="middle"
              fill={color}
              fontSize="10"
              fontWeight="800"
            >
              {name[0]}
            </text>
            {/* Name + email */}
            <text
              x="72"
              y={77 + i * 50}
              fill="white"
              fontSize="11"
              fontWeight="700"
            >
              {name}
            </text>
            <text x="72" y={90 + i * 50} fill="#ffffff30" fontSize="9">
              {email}
            </text>
            {/* Status badge */}
            <rect
              x="260"
              y={72 + i * 50}
              width={status === "pending" ? 52 : 48}
              height="18"
              rx="9"
              fill={
                status === "active"
                  ? "#10b98120"
                  : status === "pending"
                    ? "#f59e0b20"
                    : "#ef444420"
              }
            />
            <text
              x={286 + (status === "pending" ? 0 : -2)}
              y={85 + i * 50}
              textAnchor="middle"
              fill={
                status === "active"
                  ? "#10b981"
                  : status === "pending"
                    ? "#f59e0b"
                    : "#ef4444"
              }
              fontSize="8"
              fontWeight="700"
            >
              {status.toUpperCase()}
            </text>
            {/* Students count */}
            <text x="380" y={85 + i * 50} fill="#ffffff40" fontSize="10">
              {students} students
            </text>
            {/* Action dots */}
            {[580, 596, 612].map((cx) => (
              <circle
                key={cx}
                cx={cx}
                cy={81 + i * 50}
                r="2.5"
                fill="#ffffff20"
              />
            ))}
            {/* Resend badge for pending */}
            {status === "pending" && (
              <>
                <rect
                  x="638"
                  y={72 + i * 50}
                  width="54"
                  height="18"
                  rx="8"
                  fill="#f59e0b20"
                  stroke="#f59e0b30"
                  strokeWidth="1"
                />
                <text
                  x="665"
                  y={85 + i * 50}
                  textAnchor="middle"
                  fill="#f59e0b"
                  fontSize="8"
                  fontWeight="600"
                >
                  Resend
                </text>
              </>
            )}
          </g>
        ))}

        {/* Invite modal overlay */}
        <rect
          x="200"
          y="40"
          width="320"
          height="200"
          rx="16"
          fill="#0d2137"
          stroke="#ffffff15"
          strokeWidth="1"
        />
        <text
          x="360"
          y="70"
          textAnchor="middle"
          fill="white"
          fontSize="13"
          fontWeight="700"
        >
          Invite Counselor
        </text>
        <text x="360" y="84" textAnchor="middle" fill="#ffffff30" fontSize="9">
          They receive an activation email to set their password.
        </text>
        <rect
          x="220"
          y="96"
          width="280"
          height="30"
          rx="8"
          fill="#060d1a"
          stroke="#ffffff10"
          strokeWidth="1"
        />
        <text x="232" y="111" fill="#ffffff25" fontSize="10">
          Full Name
        </text>
        <rect
          x="220"
          y="135"
          width="280"
          height="30"
          rx="8"
          fill="#060d1a"
          stroke="#ffffff10"
          strokeWidth="1"
        />
        <text x="232" y="150" fill="#ffffff25" fontSize="10">
          Email Address
        </text>
        <rect x="220" y="178" width="280" height="34" rx="10" fill="#10b981" />
        <text
          x="360"
          y="200"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
        >
          Send Invitation
        </text>

        {/* Shadow behind modal */}
        <rect x="0" y="0" width="720" height="280" fill="#00000060" rx="12" />
        <rect
          x="200"
          y="40"
          width="320"
          height="200"
          rx="16"
          fill="#0d2137"
          stroke="#ffffff15"
          strokeWidth="1"
        />
        <text
          x="360"
          y="70"
          textAnchor="middle"
          fill="white"
          fontSize="13"
          fontWeight="700"
        >
          Invite Counselor
        </text>
        <text x="360" y="84" textAnchor="middle" fill="#ffffff30" fontSize="9">
          They receive an activation email to set their password.
        </text>
        <rect
          x="220"
          y="96"
          width="280"
          height="30"
          rx="8"
          fill="#060d1a"
          stroke="#ffffff10"
          strokeWidth="1"
        />
        <text x="232" y="115" fill="#ffffff50" fontSize="10">
          Full Name
        </text>
        <rect
          x="220"
          y="135"
          width="280"
          height="30"
          rx="8"
          fill="#060d1a"
          stroke="#10b98140"
          strokeWidth="1.5"
        />
        <text x="232" y="154" fill="#ffffff70" fontSize="10">
          riya@agency.in
        </text>
        <rect x="220" y="178" width="280" height="34" rx="10" fill="#10b981" />
        <text
          x="360"
          y="200"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
        >
          Send Invitation →
        </text>
      </svg>
    </div>
  );
}

/** Illustration 3: Students list */
function IllustStudents() {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <svg
        viewBox="0 0 720 260"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full rounded-2xl border border-white/[0.06] shadow-xl"
      >
        <rect width="720" height="260" fill="#081525" rx="12" />
        <rect x="0" y="0" width="720" height="48" fill="#0d2137" />
        <text x="20" y="29" fill="white" fontSize="13" fontWeight="700">
          Students
        </text>

        {/* Search bar */}
        <rect
          x="20"
          y="58"
          width="240"
          height="30"
          rx="9"
          fill="#0d2137"
          stroke="#ffffff0f"
          strokeWidth="1"
        />
        <text x="36" y="77" fill="#ffffff25" fontSize="10">
          Search students...
        </text>

        {/* Stage filter chips */}
        {["All", "Lead", "Qualified", "Enrolled"].map((s, i) => (
          <g key={s}>
            <rect
              x={274 + i * 64}
              y="58"
              width="58"
              height="30"
              rx="9"
              fill={i === 0 ? "#10b98120" : "#0d2137"}
              stroke={i === 0 ? "#10b98140" : "#ffffff0a"}
              strokeWidth="1"
            />
            <text
              x={303 + i * 64}
              y="77"
              textAnchor="middle"
              fill={i === 0 ? "#10b981" : "#ffffff40"}
              fontSize="9"
              fontWeight="600"
            >
              {s}
            </text>
          </g>
        ))}

        {/* Table header */}
        <rect x="16" y="100" width="688" height="28" rx="6" fill="#ffffff05" />
        {["Student", "Counselor", "Stage", "Country", "Updated"].map((h, i) => (
          <text
            key={h}
            x={[32, 220, 360, 460, 570][i]}
            y="118"
            fill="#ffffff25"
            fontSize="8"
            fontWeight="700"
            letterSpacing="0.8"
          >
            {h.toUpperCase()}
          </text>
        ))}

        {/* Student rows */}
        {[
          {
            name: "Priya Nair",
            counselor: "Riya S.",
            stage: "enrolled",
            country: "Canada",
            color: "#10b981",
          },
          {
            name: "Rahul Mehta",
            counselor: "Arjun K.",
            stage: "visa_process",
            country: "UK",
            color: "#f59e0b",
          },
          {
            name: "Ananya Singh",
            counselor: "Riya S.",
            stage: "application_submitted",
            country: "Australia",
            color: "#a855f7",
          },
          {
            name: "Karan Patel",
            counselor: "Meena P.",
            stage: "contacted",
            country: "Germany",
            color: "#3b82f6",
          },
        ].map(({ name, counselor, stage, country, color }, i) => (
          <g key={name}>
            <rect
              x="16"
              y={132 + i * 28}
              width="688"
              height="26"
              rx="6"
              fill={i % 2 === 0 ? "#ffffff03" : "transparent"}
            />
            <circle cx="46" cy={145 + i * 28} r="9" fill={`${color}25`} />
            <text
              x="46"
              y={149 + i * 28}
              textAnchor="middle"
              fill={color}
              fontSize="8"
              fontWeight="800"
            >
              {name[0]}
            </text>
            <text
              x="62"
              y={148 + i * 28}
              fill="#ffffff70"
              fontSize="10"
              fontWeight="600"
            >
              {name}
            </text>
            <text x="220" y={148 + i * 28} fill="#ffffff35" fontSize="9">
              {counselor}
            </text>
            <rect
              x="355"
              y={137 + i * 28}
              width={80}
              height="15"
              rx="7"
              fill={`${color}20`}
            />
            <text
              x="395"
              y={148 + i * 28}
              textAnchor="middle"
              fill={color}
              fontSize="7"
              fontWeight="700"
            >
              {stage.replace(/_/g, " ").toUpperCase()}
            </text>
            <text x="460" y={148 + i * 28} fill="#ffffff35" fontSize="9">
              {country}
            </text>
            <text x="570" y={148 + i * 28} fill="#ffffff25" fontSize="9">
              2d ago
            </text>
            <text x="688" y={148 + i * 28} fill="#ffffff20" fontSize="10">
              ›
            </text>
          </g>
        ))}

        {/* Pagination */}
        <rect x="16" y="246" width="688" height="1" fill="#ffffff06" />
      </svg>
    </div>
  );
}

/** Illustration 4: Applications monitor */
function IllustApplications() {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <svg
        viewBox="0 0 720 250"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full rounded-2xl border border-white/[0.06] shadow-xl"
      >
        <rect width="720" height="250" fill="#081525" rx="12" />
        <rect x="0" y="0" width="720" height="48" fill="#0d2137" />
        <text x="20" y="29" fill="white" fontSize="13" fontWeight="700">
          Applications
        </text>

        {/* Stat chips at top */}
        {[
          { label: "Total", val: "89", color: "#ffffff40" },
          { label: "Pending", val: "24", color: "#f59e0b" },
          { label: "Accepted", val: "31", color: "#10b981" },
          { label: "Enrolled", val: "18", color: "#a855f7" },
        ].map(({ label, val, color }, i) => (
          <g key={label}>
            <rect
              x={16 + i * 90}
              y="56"
              width="82"
              height="36"
              rx="9"
              fill="#0d2137"
              stroke="#ffffff0a"
              strokeWidth="1"
            />
            <text
              x={57 + i * 90}
              y="71"
              textAnchor="middle"
              fill={color}
              fontSize="14"
              fontWeight="800"
            >
              {val}
            </text>
            <text
              x={57 + i * 90}
              y="83"
              textAnchor="middle"
              fill="#ffffff25"
              fontSize="7"
              fontWeight="600"
            >
              {label.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Search + status filter */}
        <rect
          x="16"
          y="102"
          width="220"
          height="28"
          rx="8"
          fill="#0d2137"
          stroke="#ffffff0a"
          strokeWidth="1"
        />
        <text x="30" y="120" fill="#ffffff25" fontSize="10">
          Search university / student...
        </text>

        {/* Status filter */}
        {["All Status", "Pending", "Accepted", "Rejected"].map((s, i) => (
          <g key={s}>
            <rect
              x={246 + i * 72}
              y="102"
              width="66"
              height="28"
              rx="8"
              fill={i === 0 ? "#10b98115" : "#0d2137"}
              stroke={i === 0 ? "#10b98130" : "#ffffff0a"}
              strokeWidth="1"
            />
            <text
              x={279 + i * 72}
              y="120"
              textAnchor="middle"
              fill={i === 0 ? "#10b981" : "#ffffff35"}
              fontSize="8"
              fontWeight={i === 0 ? "700" : "500"}
            >
              {s}
            </text>
          </g>
        ))}

        {/* Refresh button */}
        <rect
          x="640"
          y="102"
          width="64"
          height="28"
          rx="8"
          fill="#0d2137"
          stroke="#ffffff0a"
          strokeWidth="1"
        />
        <text x="672" y="120" textAnchor="middle" fill="#ffffff30" fontSize="9">
          ↻ Refresh
        </text>

        {/* Applications rows */}
        {[
          {
            uni: "University of Toronto",
            student: "Priya Nair",
            counselor: "Riya S.",
            status: "accepted",
            color: "#10b981",
          },
          {
            uni: "King's College London",
            student: "Rahul Mehta",
            counselor: "Arjun K.",
            status: "pending",
            color: "#f59e0b",
          },
          {
            uni: "Monash University",
            student: "Ananya Singh",
            counselor: "Riya S.",
            status: "reviewing",
            color: "#3b82f6",
          },
          {
            uni: "TU Munich",
            student: "Karan Patel",
            counselor: "Meena P.",
            status: "enrolled",
            color: "#a855f7",
          },
        ].map(({ uni, student, counselor, status, color }, i) => (
          <g key={uni}>
            <rect
              x="16"
              y={140 + i * 26}
              width="688"
              height="24"
              rx="6"
              fill={i % 2 === 0 ? "#ffffff02" : "transparent"}
            />
            <text
              x="22"
              y={156 + i * 26}
              fill="#ffffff60"
              fontSize="10"
              fontWeight="600"
            >
              {uni}
            </text>
            <text x="280" y={156 + i * 26} fill="#ffffff35" fontSize="9">
              {student}
            </text>
            <text x="430" y={156 + i * 26} fill="#ffffff25" fontSize="9">
              {counselor}
            </text>
            <rect
              x="548"
              y={144 + i * 26}
              width={status === "reviewing" ? 56 : 48}
              height="14"
              rx="7"
              fill={`${color}20`}
            />
            <text
              x={572 + (status === "reviewing" ? 4 : 0)}
              y={155 + i * 26}
              textAnchor="middle"
              fill={color}
              fontSize="7"
              fontWeight="700"
            >
              {status.toUpperCase()}
            </text>
            <text x="686" y={156 + i * 26} fill="#ffffff15" fontSize="10">
              ›
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Illustration 5: Settings page */
function IllustSettings() {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <svg
        viewBox="0 0 720 310"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full rounded-2xl border border-white/[0.06] shadow-xl"
      >
        <defs>
          <linearGradient id="brandPreview" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>

        <rect width="720" height="310" fill="#070c18" rx="12" />
        <rect x="0" y="0" width="720" height="48" fill="#090f1e" />
        <text x="20" y="29" fill="white" fontSize="13" fontWeight="700">
          Organisation Settings
        </text>

        {/* Left panel - sections */}
        <rect
          x="16"
          y="58"
          width="200"
          height="240"
          rx="12"
          fill="#090f1e"
          stroke="#0e1d36"
          strokeWidth="1"
        />

        {[
          { label: "Organisation Info", icon: "🏢" },
          { label: "Brand Identity", icon: "🎨" },
          { label: "Logo & Media", icon: "🖼️" },
          { label: "Dashboard Colors", icon: "🌈" },
          { label: "Feature Toggles", icon: "⚡" },
          { label: "Email Branding", icon: "✉️" },
        ].map(({ label, icon }, i) => (
          <g key={label}>
            <rect
              x="24"
              y={68 + i * 36}
              width="184"
              height="32"
              rx="8"
              fill={i === 1 ? "#10b98115" : "transparent"}
              stroke={i === 1 ? "#10b98130" : "transparent"}
              strokeWidth="1"
            />
            <text
              x="40"
              y={89 + i * 36}
              fill={i === 1 ? "#10b981" : "#ffffff35"}
              fontSize="10"
              fontWeight={i === 1 ? "700" : "500"}
            >
              {icon} {label}
            </text>
          </g>
        ))}

        {/* Right panel - Brand Identity form */}
        <rect
          x="226"
          y="58"
          width="478"
          height="240"
          rx="12"
          fill="#090f1e"
          stroke="#0e1d36"
          strokeWidth="1"
        />
        <text x="242" y="80" fill="#2563eb" fontSize="11" fontWeight="700">
          🎨 Brand Identity
        </text>

        {/* Form fields */}
        {["Brand Name", "Tagline", "Footer Text"].map((label, i) => (
          <g key={label}>
            <text
              x="242"
              y={102 + i * 44}
              fill="#ffffff35"
              fontSize="8"
              fontWeight="700"
              letterSpacing="0.8"
            >
              {label.toUpperCase()}
            </text>
            <rect
              x="242"
              y={108 + i * 44}
              width="320"
              height="28"
              rx="8"
              fill="#070c18"
              stroke="#0f1c31"
              strokeWidth="1"
            />
            <text x="254" y={126 + i * 44} fill="#d0daf0" fontSize="10">
              {
                [
                  "Global Future Consultancy",
                  "Your gateway to world-class education",
                  "Powered by Global Future",
                ][i]
              }
            </text>
          </g>
        ))}

        {/* Feature toggles */}
        <text x="242" y="244" fill="#2563eb" fontSize="11" fontWeight="700">
          ⚡ White-Label Features
        </text>

        {[
          { label: "Remove Khizar Branding", on: true },
          { label: "Custom Dashboard Colors", on: false },
          { label: "Custom Email Branding", on: true },
        ].map(({ label, on }, i) => (
          <g key={label}>
            <text x="242" y={264 + i * 18} fill="#ffffff40" fontSize="9">
              {label}
            </text>
            <rect
              x="562"
              y={254 + i * 18}
              width="32"
              height="16"
              rx="8"
              fill={on ? "#10b981" : "#1e3a5f"}
            />
            <circle cx={on ? 586 : 570} cy={262 + i * 18} r="6" fill="white" />
          </g>
        ))}

        {/* Live brand preview */}
        <rect
          x="574"
          y="90"
          width="120"
          height="90"
          rx="10"
          fill="#0a1929"
          stroke="#10b98130"
          strokeWidth="1"
        />
        <text
          x="634"
          y="107"
          textAnchor="middle"
          fill="#10b981"
          fontSize="7"
          fontWeight="700"
          letterSpacing="0.8"
        >
          LIVE PREVIEW
        </text>
        <rect
          x="582"
          y="112"
          width="104"
          height="30"
          rx="6"
          fill="url(#brandPreview)"
        />
        <text
          x="634"
          y="131"
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontWeight="700"
        >
          Global Future
        </text>
        <text x="634" y="152" textAnchor="middle" fill="#ffffff30" fontSize="7">
          Your gateway to...
        </text>
        <rect x="590" y="158" width="88" height="14" rx="4" fill="#10b98115" />
        <text x="634" y="168" textAnchor="middle" fill="#10b981" fontSize="7">
          Powered by Global Future
        </text>
      </svg>
    </div>
  );
}

/** Illustration 6: Subscription / Partner plan */
function IllustSubscription() {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <svg
        viewBox="0 0 720 250"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full rounded-2xl border border-white/[0.06] shadow-xl"
      >
        <defs>
          <linearGradient id="planGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="planGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        <rect width="720" height="250" fill="#081525" rx="12" />

        {/* Plan cards */}
        {[
          {
            x: 20,
            name: "Free Partner",
            price: "₹0",
            period: "Forever",
            color: "url(#planGrad2)",
            features: ["5 students", "Basic CRM", "Email support"],
          },
          {
            x: 256,
            name: "Pro Partner",
            price: "₹999",
            period: "/quarter",
            color: "url(#planGrad)",
            features: ["Unlimited students", "White-label", "Priority support"],
          },
          {
            x: 492,
            name: "Agency Plus",
            price: "₹1,999",
            period: "/quarter",
            color: "url(#planGrad2)",
            features: [
              "Everything in Pro",
              "Custom domain",
              "Dedicated manager",
            ],
          },
        ].map(({ x, name, price, period, color, features }) => (
          <g key={name}>
            <rect
              x={x}
              y="20"
              width="216"
              height="210"
              rx="16"
              fill="#0d2137"
              stroke="#ffffff0a"
              strokeWidth="1"
            />
            {name === "Pro Partner" && (
              <>
                <rect
                  x={x}
                  y="20"
                  width="216"
                  height="210"
                  rx="16"
                  fill="#0d2137"
                  stroke="#10b98140"
                  strokeWidth="2"
                />
                <rect
                  x={x + 68}
                  y="12"
                  width="80"
                  height="18"
                  rx="9"
                  fill="url(#planGrad)"
                />
                <text
                  x={x + 108}
                  y="25"
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="700"
                >
                  MOST POPULAR
                </text>
              </>
            )}
            <rect
              x={x + 12}
              y="36"
              width="192"
              height="40"
              rx="10"
              fill={color}
              opacity="0.15"
            />
            <text
              x={x + 108}
              y="55"
              textAnchor="middle"
              fill="white"
              fontSize="13"
              fontWeight="800"
            >
              {name}
            </text>
            <text
              x={x + 108}
              y="72"
              textAnchor="middle"
              fill="#10b981"
              fontSize="22"
              fontWeight="800"
            >
              {price}
            </text>
            <text
              x={x + 108}
              y="87"
              textAnchor="middle"
              fill="#ffffff30"
              fontSize="9"
            >
              {period}
            </text>

            {features.map((f, fi) => (
              <g key={f}>
                <circle cx={x + 26} cy={108 + fi * 22} r="5" fill="#10b98115" />
                <text
                  x={x + 26}
                  y={112 + fi * 22}
                  textAnchor="middle"
                  fill="#10b981"
                  fontSize="7"
                >
                  ✓
                </text>
                <text
                  x={x + 36}
                  y={112 + fi * 22}
                  fill="#ffffff50"
                  fontSize="9"
                >
                  {f}
                </text>
              </g>
            ))}

            <rect
              x={x + 20}
              y="186"
              width="176"
              height="30"
              rx="10"
              fill={name === "Pro Partner" ? "url(#planGrad)" : "#0d2137"}
              stroke={name !== "Pro Partner" ? "#ffffff15" : "none"}
              strokeWidth="1"
            />
            <text
              x={x + 108}
              y="205"
              textAnchor="middle"
              fill={name === "Pro Partner" ? "white" : "#ffffff40"}
              fontSize="10"
              fontWeight="700"
            >
              {name === "Pro Partner" ? "Current Plan ✓" : "Select Plan"}
            </text>
          </g>
        ))}

        {/* Settlement info bar */}
        <rect x="20" y="238" width="680" height="4" rx="2" fill="#ffffff08" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── PAGE ─────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function OrgAdminManualPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#081525" }}
    >
      {/* Kill webkit scrollbar on the nav pill row — scrollbar-none Tailwind plugin not required */}
      <style>{`.org-manual-nav::-webkit-scrollbar { display: none; }`}</style>

      {/* ── Sticky nav ────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#060d1a]/90 backdrop-blur-sm overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="org-manual-nav flex items-center gap-1 py-2"
            style={{
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <Link
              href="/dashboard/org-admin"
              className="flex items-center gap-1.5 text-white/30 hover:text-emerald-400 text-[11px] font-medium transition-colors shrink-0 pr-3 border-r border-white/[0.08] mr-2"
            >
              <ArrowLeft size={13} strokeWidth={2} />
              Dashboard
            </Link>
            {NAV.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/30 hover:text-emerald-400 hover:bg-emerald-500/[0.08] text-[11px] font-medium transition-all shrink-0"
              >
                <Icon size={12} strokeWidth={2} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl mb-5">
            <Building2 size={30} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            Organisation Dashboard Manual
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            A complete pictorial guide to every feature in your Org Admin
            dashboard. Use the navigation above to jump to any section.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-900/60 bg-emerald-950/50 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Platform v2.0
            </span>
            <span className="text-white/20 text-xs">
              Organisation Admin Guide
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
         Section 1 — Introduction
        ═══════════════════════════════════════════════════════════════════ */}
        <Section
          id="intro"
          icon={BookOpen}
          color="from-emerald-500 to-teal-600"
          title="Introduction"
          subtitle="What is the Organisation Dashboard and who is it for?"
        >
          <p className="text-white/45 text-[14px] leading-relaxed mb-6">
            The Organisation Dashboard is a white-label CRM layer built for
            agency owners and team leads who manage multiple education
            counselors under one roof. As an Org Admin you can invite
            counselors, monitor all student pipelines across your team, track
            applications organisation-wide, and fully brand the platform as your
            own product.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <InfoCard
              icon={Users}
              color="from-emerald-500 to-teal-600"
              title="Invite Counselors"
              desc="Add your team members with a single email invite. They activate their own accounts independently."
            />
            <InfoCard
              icon={GraduationCap}
              color="from-blue-500 to-indigo-600"
              title="See All Students"
              desc="View every student across all your counselors in one searchable, filterable table."
            />
            <InfoCard
              icon={FileText}
              color="from-purple-500 to-pink-600"
              title="Monitor Applications"
              desc="Track application statuses across the entire organisation — pending, reviewing, accepted, enrolled."
            />
            <InfoCard
              icon={Palette}
              color="from-amber-500 to-orange-600"
              title="White-Label Brand"
              desc="Replace Khizar Overseas branding with your agency's own name, logo, colors, and footer text."
            />
          </div>

          <Tip>
            The Org Admin role is completely separate from individual
            counselors. Counselors log in to their own separate dashboard and
            only see their assigned students. You, as Org Admin, see everything.
          </Tip>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════════
         Section 2 — Overview Page
        ═══════════════════════════════════════════════════════════════════ */}
        <Section
          id="overview-page"
          icon={LayoutDashboard}
          color="from-emerald-500 to-teal-600"
          title="Overview Page"
          subtitle="The first screen you see after login — your organisation at a glance"
        >
          <IllustDashboard />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3">
                KPI Cards (top row)
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-3">
                Four metric cards show your organisation's health at a glance.
                Each card is clickable and takes you to the relevant detail
                page.
              </p>
              <ul className="space-y-2 text-[12px] text-white/35">
                <li className="flex gap-2">
                  <span className="text-emerald-400">●</span>
                  <span>
                    <strong className="text-white/60">Students</strong> — total
                    students across all counselors
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">●</span>
                  <span>
                    <strong className="text-white/60">Enrolled</strong> —
                    students who completed the full journey
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">●</span>
                  <span>
                    <strong className="text-white/60">Counselors</strong> —
                    active staff members in your org
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">●</span>
                  <span>
                    <strong className="text-white/60">Applications</strong> —
                    total university applications raised
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3">
                Student Pipeline Funnel
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-3">
                The horizontal bar chart shows how students are distributed
                across pipeline stages — from "Lead" at the top to "Enrolled" at
                the bottom. Wider bars = more students at that stage.
              </p>
              <h3 className="text-white/70 text-sm font-bold mb-3 mt-4">
                Top Counselors Leaderboard
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed">
                Lists your top-performing counselors ranked by enrolled student
                count. Useful for recognising high performers and identifying
                who may need support.
              </p>
            </div>
          </div>

          <Tip>
            The Overview page auto-fetches data on every load. Use the header
            refresh icon if you need an immediate update mid-session.
          </Tip>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════════
         Section 3 — Counselors
        ═══════════════════════════════════════════════════════════════════ */}
        <Section
          id="counselors"
          icon={Users}
          color="from-blue-500 to-indigo-600"
          title="Counselors"
          subtitle="Invite, manage, and monitor your team of education counselors"
        >
          <IllustCounselors />

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-white/70 text-sm font-bold mb-2">
                Inviting a new counselor
              </h3>
              <Steps
                steps={[
                  'Click the green "+ Invite Counselor" button in the top-right of the page.',
                  "Enter the counselor's full name and email address in the modal that appears.",
                  'Click "Send Invitation" — the counselor receives an email with an activation link.',
                  "They click the link, set their own password, and are immediately active in your organisation.",
                  'Their account will now appear in your Counselors list with status "Active".',
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  status: "Active",
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10 border-emerald-500/20",
                  desc: "Counselor has accepted the invite and is actively using the dashboard.",
                },
                {
                  status: "Pending",
                  color: "text-amber-400",
                  bg: "bg-amber-500/10 border-amber-500/20",
                  desc: 'Invite sent but counselor has not yet activated their account. Use "Resend" to send again.',
                },
                {
                  status: "Inactive",
                  color: "text-red-400",
                  bg: "bg-red-500/10 border-red-500/20",
                  desc: "Account exists but is suspended. Students are preserved. Re-activate anytime.",
                },
              ].map(({ status, color, bg, desc }) => (
                <div key={status} className={`rounded-xl border p-4 ${bg}`}>
                  <p className={`text-xs font-bold mb-1 ${color}`}>{status}</p>
                  <p className="text-white/40 text-[12px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <Warning>
              Removing a counselor is permanent and cannot be undone from the
              dashboard. Their assigned students remain in the system but become
              unassigned. Use "Inactive" instead of "Remove" if you're unsure.
            </Warning>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════════
         Section 4 — Students
        ═══════════════════════════════════════════════════════════════════ */}
        <Section
          id="students"
          icon={GraduationCap}
          color="from-purple-500 to-pink-600"
          title="Students"
          subtitle="Organisation-wide student view — every student across all counselors"
        >
          <IllustStudents />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3">
                Searching and filtering
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-3">
                Use the search bar to find students by name, email, or passport
                number. The stage chips let you filter to a specific pipeline
                stage instantly.
              </p>
              <p className="text-white/40 text-[13px] leading-relaxed">
                The table paginates at 20 rows per page. Use the Previous / Next
                buttons at the bottom to navigate.
              </p>
            </div>

            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3">
                Pipeline Stages
              </h3>
              <div className="space-y-1.5">
                {[
                  { stage: "Lead", color: "bg-slate-500/25 text-slate-300" },
                  { stage: "Contacted", color: "bg-blue-500/20 text-blue-300" },
                  {
                    stage: "Qualified",
                    color: "bg-indigo-500/20 text-indigo-300",
                  },
                  {
                    stage: "Application Started",
                    color: "bg-violet-500/20 text-violet-300",
                  },
                  {
                    stage: "Application Submitted",
                    color: "bg-purple-500/20 text-purple-300",
                  },
                  {
                    stage: "Offer Received",
                    color: "bg-amber-500/20 text-amber-300",
                  },
                  {
                    stage: "Visa Process",
                    color: "bg-orange-500/20 text-orange-300",
                  },
                  {
                    stage: "Enrolled",
                    color: "bg-emerald-500/20 text-emerald-300",
                  },
                  { stage: "Lost", color: "bg-red-500/20 text-red-300" },
                ].map(({ stage, color }) => (
                  <div key={stage} className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${color}`}
                    >
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Success>
            Clicking any row opens the full student detail view — including
            their application history, visa progress, deadlines, and attached
            documents. You have read access to all of this as Org Admin.
          </Success>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════════
         Section 5 — Applications
        ═══════════════════════════════════════════════════════════════════ */}
        <Section
          id="applications"
          icon={FileText}
          color="from-amber-500 to-orange-600"
          title="Applications"
          subtitle="A read-only cross-counselor view of all university applications"
        >
          <IllustApplications />

          <div className="mt-6 space-y-4">
            <p className="text-white/40 text-[14px] leading-relaxed">
              The Applications page shows every university application raised by
              any counselor in your organisation. This is a monitoring view —
              you cannot edit applications here; counselors manage them from
              their own dashboard.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  status: "Pending",
                  color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                  desc: "Submitted, awaiting university review",
                },
                {
                  status: "Reviewing",
                  color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                  desc: "University is actively evaluating",
                },
                {
                  status: "Accepted",
                  color:
                    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  desc: "Offer letter received",
                },
                {
                  status: "Enrolled",
                  color:
                    "text-purple-400 bg-purple-500/10 border-purple-500/20",
                  desc: "Student confirmed enrolment",
                },
              ].map(({ status, color, desc }) => (
                <div
                  key={status}
                  className={`rounded-xl border p-3 ${color.split(" ").slice(1).join(" ")}`}
                >
                  <p
                    className={`text-[11px] font-bold mb-1 ${color.split(" ")[0]}`}
                  >
                    {status}
                  </p>
                  <p className="text-white/35 text-[11px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <Tip>
              Use the Refresh button or just reload the page to see the latest
              application statuses. Counselors update these in real-time from
              their side.
            </Tip>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════════
         Section 6 — Settings & Branding
        ═══════════════════════════════════════════════════════════════════ */}
        <Section
          id="settings"
          icon={Palette}
          color="from-sky-500 to-indigo-600"
          title="Settings & Branding"
          subtitle="Make the platform entirely yours — logo, colors, name, and more"
        >
          <IllustSettings />

          <div className="mt-8 space-y-8">
            {/* Org Info */}
            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                Organisation Info
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed">
                Set your agency's legal name, phone number, website URL, and
                office address. This information is used in email signatures and
                branding materials sent to students.
              </p>
            </div>

            {/* Brand Identity */}
            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                Brand Identity
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-3">
                Three fields control how your brand appears across the platform:
              </p>
              <ul className="space-y-2 text-[13px] text-white/35">
                <li className="flex gap-2">
                  <span className="text-sky-400 shrink-0">Brand Name</span>
                  <span>
                    — displayed in the sidebar header and footer instead of
                    "Khizar Overseas"
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-400 shrink-0">Tagline</span>
                  <span>
                    — a short line shown under your brand name on the dashboard
                    hero
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-400 shrink-0">Footer Text</span>
                  <span>
                    — replaces the default "Powered by Khizar Overseas" in the
                    dashboard footer
                  </span>
                </li>
              </ul>
              <Success>
                The live brand preview on the right updates in real time as you
                type — no need to save to see how it looks.
              </Success>
            </div>

            {/* Logo */}
            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
                Logo Upload
              </h3>
              <Steps
                steps={[
                  'Click the upload zone in the "Logo & Media" section.',
                  "Choose a PNG, JPG, or WebP file (recommended: 200×200px, transparent background).",
                  "The logo is uploaded to Cloudinary and appears in the sidebar instantly.",
                  'Use "Replace" to swap it, or "Delete" to remove it and revert to the text logo.',
                ]}
              />
            </div>

            {/* White-Label Feature Toggles */}
            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center font-bold">
                  4
                </span>
                White-Label Feature Toggles
              </h3>
              <div className="space-y-3">
                {[
                  {
                    toggle: "Remove Khizar Overseas Branding",
                    desc: "When ON, all Khizar Overseas logos, footer text, and watermarks are hidden. Your brand identity takes over completely. Your footer text field becomes the primary identifier.",
                    warn: true,
                  },
                  {
                    toggle: "Custom Dashboard Colors",
                    desc: "Unlock the color picker fields to set your own primary, background, and accent colors. Changes apply immediately to buttons, active nav highlights, and badges.",
                    warn: false,
                  },
                  {
                    toggle: "Custom Email Branding",
                    desc: "When ON, all system emails (invite, password reset, application updates) are sent using your agency's support email, reply-to address, and email signature rather than the default Khizar ones.",
                    warn: false,
                  },
                ].map(({ toggle, desc, warn }) => (
                  <div
                    key={toggle}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-4 rounded-full bg-emerald-500 flex items-center justify-end pr-0.5">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                      <span className="text-white/70 text-[12px] font-bold">
                        {toggle}
                      </span>
                    </div>
                    <p className="text-white/35 text-[12px] leading-relaxed">
                      {desc}
                    </p>
                    {warn && (
                      <Warning>
                        Once you remove Khizar branding, the default footer is
                        gone. Ensure your "Footer Text" field is filled so the
                        footer isn't empty.
                      </Warning>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Save */}
            <Tip>
              Always click "Save Changes" at the bottom of the settings page
              after modifying any field. Navigating away without saving will
              lose your edits.
            </Tip>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════════
         Section 7 — Subscription & Billing
        ═══════════════════════════════════════════════════════════════════ */}
        <Section
          id="subscription"
          icon={CreditCard}
          color="from-emerald-500 to-teal-600"
          title="Subscription & Billing"
          subtitle="Partner plans, trial period, and quarterly settlement"
        >
          <IllustSubscription />

          <div className="mt-6 space-y-5">
            <p className="text-white/40 text-[14px] leading-relaxed">
              Your organisation operates on a partner subscription. The plan
              determines the number of counselors, students, and white-label
              features you can use. Billing happens quarterly via Razorpay.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-emerald-400 text-xs font-bold mb-2">
                  Trial Period
                </p>
                <p className="text-white/40 text-[13px] leading-relaxed">
                  New organisations start on a free trial. All features are
                  available during trial. A banner appears when the trial is
                  ending. Select a plan before it expires to avoid interruption.
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-amber-400 text-xs font-bold mb-2">
                  Quarterly Settlement
                </p>
                <p className="text-white/40 text-[13px] leading-relaxed">
                  At the end of each quarter, a settlement invoice is generated
                  based on your plan and active counselors. Pay via the Razorpay
                  payment modal before the due date.
                </p>
              </div>
            </div>

            <Warning>
              If a settlement is overdue, your organisation enters a restricted
              state. Counselors can still view data but cannot add new students
              or raise applications until payment is completed.
            </Warning>

            <div>
              <h3 className="text-white/70 text-sm font-bold mb-3">
                Selecting or changing your plan
              </h3>
              <Steps
                steps={[
                  "A plan selection modal appears automatically when your trial ends or when your plan needs renewal.",
                  'Review the plan cards and click "Select Plan" on the one you want.',
                  "A Razorpay payment sheet opens — complete the payment with your card or UPI.",
                  "On successful payment, your plan activates immediately and all features unlock.",
                  "You receive a payment confirmation email at your registered address.",
                ]}
              />
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════════
         Section 8 — Quick Reference
        ═══════════════════════════════════════════════════════════════════ */}
        <Section
          id="tips"
          icon={Lightbulb}
          color="from-amber-500 to-orange-600"
          title="Quick Reference"
          subtitle="Power tips, navigation shortcuts, and common questions"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {[
              {
                title: "Navigating the sidebar",
                body: "Hover over the sidebar on desktop to expand it. On mobile, tap the ≡ hamburger in the top-left to open the drawer. The active page is highlighted in emerald.",
              },
              {
                title: "Notifications bell",
                body: "The bell icon in the top header shows real-time notifications — new applications, student status changes, and counselor invite responses. Click any notification to jump to the relevant record.",
              },
              {
                title: "Data refresh",
                body: "All pages auto-fetch on load. For live data mid-session, reload the page or use any refresh icon. Socket.IO keeps notifications live without reloading.",
              },
              {
                title: "Can I edit students?",
                body: "No — as Org Admin you have read-only access to student data. Counselors are responsible for updating student profiles, pipeline stages, and applications from their own dashboard.",
              },
              {
                title: "Counselor vs Org Admin",
                body: "Counselors log in at /login and land on /dashboard/counselor-dashboard. You (Org Admin) land on /dashboard/org-admin. The two dashboards are completely separate.",
              },
              {
                title: "Branding won't save?",
                body: 'Ensure you scroll to the bottom of Settings and click "Save Changes". Partial saves aren\'t supported — the entire settings form saves as one batch.',
              },
              {
                title: "Logo not showing?",
                body: "After upload, do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R). Cloudinary URL propagation can take a few seconds on first upload.",
              },
              {
                title: "Getting support",
                body: "Email support@khizaroverseas.in with your organisation name and a description of the issue. Include a screenshot if possible. Response time is within 24 hours.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.1] transition-colors"
              >
                <p className="text-white/70 text-[13px] font-bold mb-2 flex items-center gap-2">
                  <ChevronRight
                    size={12}
                    className="text-emerald-500"
                    strokeWidth={2.5}
                  />
                  {title}
                </p>
                <p className="text-white/35 text-[12px] leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Glossary */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5">
            <p className="text-white/50 text-xs font-bold tracking-widest uppercase mb-4">
              Glossary
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {[
                {
                  term: "Org Admin",
                  def: "You — the agency owner with full visibility across all counselors",
                },
                {
                  term: "Counselor",
                  def: "A staff member who manages a subset of students",
                },
                {
                  term: "Pipeline Stage",
                  def: "The current step a student is at in the journey (Lead → Enrolled)",
                },
                {
                  term: "Application",
                  def: "A formal university application raised for a student",
                },
                {
                  term: "White-Label",
                  def: "Replacing Khizar branding with your agency's own identity",
                },
                {
                  term: "Settlement",
                  def: "Quarterly payment that keeps your org plan active",
                },
                {
                  term: "Trial",
                  def: "A free period at the start with full feature access",
                },
                {
                  term: "Pending Invite",
                  def: "A counselor who was invited but hasn't activated yet",
                },
              ].map(({ term, def }) => (
                <div
                  key={term}
                  className="flex gap-2 py-1.5 border-b border-white/[0.04]"
                >
                  <span className="text-emerald-400 text-[12px] font-bold shrink-0 min-w-[120px]">
                    {term}
                  </span>
                  <span className="text-white/30 text-[12px] leading-relaxed">
                    {def}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Footer CTA ───────────────────────────────────────────────────── */}
        <div className="mt-6 mb-10 border border-white/[0.06] rounded-3xl p-8 text-center bg-gradient-to-br from-emerald-950/40 to-teal-950/30">
          <Building2
            size={28}
            className="text-emerald-400 mx-auto mb-3"
            strokeWidth={1.5}
          />
          <h3 className="text-white text-lg font-bold mb-2">
            Ready to manage your organisation?
          </h3>
          <p className="text-white/35 text-sm mb-5 max-w-sm mx-auto">
            Head back to the dashboard overview to see your live metrics and
            start managing your team.
          </p>
          <Link
            href="/dashboard/org-admin"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold transition-colors"
          >
            <LayoutDashboard size={15} strokeWidth={2} />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
