"use client";

/**
 * app/dashboard/counselor-dashboard/manual/page.jsx
 *
 * Full pictorial guide to the Counselor Dashboard.
 * Each section uses inline SVG illustrations to visually represent
 * the feature — no external image dependencies.
 *
 * Sections:
 *  1. Overview — what the dashboard is
 *  2. KPI Cards — student count, conversion rate, applications, revenue
 *  3. Student Management — adding and tracking students
 *  4. Application Pipeline — Kanban board, stages
 *  5. Khizar Applications — managed visa flow
 *  6. Meetings — scheduling and tracking
 *  7. Tasks & Deadlines — creating and managing
 *  8. Settings & Branding — customising the platform
 *  9. Quick Reference — keyboard shortcuts and tips
 */

import Link from "next/link";
import {
  LayoutDashboard,
  GraduationCap,
  FileCheck,
  CalendarDays,
  CheckSquare,
  Settings,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  Palette,
  BookOpen,
  ChevronRight,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";

// ─── Section anchor nav ───────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "kpi", label: "KPI Cards", icon: BarChart3 },
  { id: "students", label: "Students", icon: GraduationCap },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "applications", label: "Applications", icon: FileCheck },
  { id: "meetings", label: "Meetings", icon: CalendarDays },
  { id: "tasks", label: "Tasks & Deadlines", icon: CheckSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── Re-usable section wrapper ────────────────────────────────────────────────
function Section({ id, icon: Icon, color, title, subtitle, children }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md shrink-0`}
        >
          <Icon size={20} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 leading-none">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>
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
    <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 mt-4">
      <Lightbulb
        size={16}
        className="text-amber-500 shrink-0 mt-0.5"
        strokeWidth={2}
      />
      <p className="text-amber-800 text-[13px] leading-relaxed">{children}</p>
    </div>
  );
}

// ─── Step list ────────────────────────────────────────────────────────────────
function Steps({ steps }) {
  return (
    <ol className="space-y-3 mt-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5">
            {i + 1}
          </div>
          <p className="text-slate-600 text-[13px] leading-relaxed">{step}</p>
        </li>
      ))}
    </ol>
  );
}

// ─── ILLUSTRATIONS (pure inline SVG) ─────────────────────────────────────────

/** Dashboard overview — sidebar + header + card grid */
function IllustrationOverview() {
  return (
    <svg
      viewBox="0 0 720 300"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl border border-slate-100 shadow-sm"
    >
      {/* Background */}
      <rect width="720" height="300" fill="#f8fafc" rx="12" />
      {/* Sidebar */}
      <rect x="0" y="0" width="72" height="300" fill="#070d1a" rx="12" />
      <rect x="0" y="0" width="36" height="300" fill="#070d1a" />
      <circle cx="36" cy="40" r="16" fill="url(#logoGrad)" />
      <text
        x="36"
        y="45"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="800"
      >
        OA
      </text>
      {[80, 120, 160, 200].map((y, i) => (
        <rect
          key={i}
          x="16"
          y={y}
          width="40"
          height="28"
          rx="8"
          fill={i === 0 ? "#0ea5e920" : "transparent"}
        />
      ))}
      <rect x="20" y="87" width="14" height="14" rx="3" fill={`#38bdf8`} />
      <rect x="20" y="127" width="14" height="14" rx="3" fill="#475569" />
      <rect x="20" y="167" width="14" height="14" rx="3" fill="#475569" />
      <rect x="20" y="207" width="14" height="14" rx="3" fill="#475569" />
      {/* Top header */}
      <rect x="72" y="0" width="648" height="52" fill="white" />
      <rect x="72" y="51" width="648" height="1" fill="#e2e8f0" />
      <text x="92" y="32" fill="#1e293b" fontSize="15" fontWeight="800">
        Dashboard
      </text>
      <circle cx="680" cy="26" r="16" fill="url(#avatarGrad)" />
      <text
        x="680"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="700"
      >
        CO
      </text>
      <rect x="640" y="16" width="28" height="20" rx="10" fill="#f1f5f9" />
      {/* KPI cards */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={92 + i * 148}
            y="68"
            width="132"
            height="72"
            rx="12"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <rect
            x={106 + i * 148}
            y="80"
            width="24"
            height="24"
            rx="8"
            fill={["#dbeafe", "#ede9fe", "#dcfce7", "#fef3c7"][i]}
          />
          <rect
            x={106 + i * 148}
            y="112"
            width="60"
            height="7"
            rx="4"
            fill="#cbd5e1"
          />
          <rect
            x={106 + i * 148}
            y="124"
            width="40"
            height="9"
            rx="4"
            fill={["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b"][i]}
          />
        </g>
      ))}
      {/* Chart area */}
      <rect
        x="92"
        y="152"
        width="392"
        height="128"
        rx="12"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
      <text x="108" y="172" fill="#1e293b" fontSize="11" fontWeight="700">
        Analytics
      </text>
      {[30, 55, 40, 70, 50, 85, 60].map((h, i) => (
        <rect
          key={i}
          x={115 + i * 48}
          y={240 - h}
          width="24"
          height={h}
          rx="4"
          fill={i % 2 === 0 ? "#bae6fd" : "#c7d2fe"}
        />
      ))}
      {/* Activity feed */}
      <rect
        x="496"
        y="152"
        width="220"
        height="128"
        rx="12"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
      <text x="512" y="172" fill="#1e293b" fontSize="11" fontWeight="700">
        Recent Activity
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx="524" cy={192 + i * 22} r="6" fill="#e0f2fe" />
          <rect
            x="536"
            y={187 + i * 22}
            width="80"
            height="5"
            rx="3"
            fill="#cbd5e1"
          />
          <rect
            x="536"
            y={196 + i * 22}
            width="50"
            height="4"
            rx="3"
            fill="#e2e8f0"
          />
        </g>
      ))}
      {/* Gradients */}
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** KPI cards — 4 stat cards with trend arrows */
function IllustrationKPI() {
  const cards = [
    {
      label: "Total Students",
      value: "248",
      delta: "+12%",
      color: "#3b82f6",
      bg: "#dbeafe",
      icon: "👨‍🎓",
    },
    {
      label: "Conversion Rate",
      value: "34%",
      delta: "+5%",
      color: "#8b5cf6",
      bg: "#ede9fe",
      icon: "📈",
    },
    {
      label: "Applications",
      value: "91",
      delta: "+8",
      color: "#22c55e",
      bg: "#dcfce7",
      icon: "📋",
    },
    {
      label: "Revenue",
      value: "₹2.4L",
      delta: "+18%",
      color: "#f59e0b",
      bg: "#fef3c7",
      icon: "💰",
    },
  ];
  return (
    <svg
      viewBox="0 0 720 160"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl border border-slate-100 shadow-sm"
    >
      <rect width="720" height="160" fill="#f8fafc" rx="12" />
      {cards.map((c, i) => (
        <g key={i}>
          <rect
            x={18 + i * 176}
            y="16"
            width="158"
            height="128"
            rx="14"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          {/* Icon */}
          <rect
            x={34 + i * 176}
            y="30"
            width="32"
            height="32"
            rx="10"
            fill={c.bg}
          />
          <text x={50 + i * 176} y="52" textAnchor="middle" fontSize="14">
            {c.icon}
          </text>
          {/* Label */}
          <text
            x={34 + i * 176}
            y="86"
            fill="#64748b"
            fontSize="10"
            fontWeight="500"
          >
            {c.label}
          </text>
          {/* Value */}
          <text
            x={34 + i * 176}
            y="108"
            fill="#0f172a"
            fontSize="20"
            fontWeight="800"
          >
            {c.value}
          </text>
          {/* Delta */}
          <rect
            x={34 + i * 176}
            y="118"
            width="44"
            height="16"
            rx="8"
            fill={c.bg}
          />
          <text
            x={56 + i * 176}
            y="130"
            textAnchor="middle"
            fill={c.color}
            fontSize="9"
            fontWeight="700"
          >
            ▲ {c.delta}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Student management — table rows with status badges */
function IllustrationStudents() {
  const rows = [
    {
      name: "Priya Sharma",
      country: "🇨🇦 Canada",
      stage: "Enrolled",
      stageBg: "#dcfce7",
      stageColor: "#16a34a",
    },
    {
      name: "Rahul Mehta",
      country: "🇬🇧 UK",
      stage: "Visa Filed",
      stageBg: "#dbeafe",
      stageColor: "#2563eb",
    },
    {
      name: "Sneha Patel",
      country: "🇦🇺 Australia",
      stage: "Applied",
      stageBg: "#fef3c7",
      stageColor: "#d97706",
    },
    {
      name: "Arjun Verma",
      country: "🇩🇪 Germany",
      stage: "Lead",
      stageBg: "#f1f5f9",
      stageColor: "#64748b",
    },
    {
      name: "Divya Nair",
      country: "🇮🇪 Ireland",
      stage: "Interview",
      stageBg: "#ede9fe",
      stageColor: "#7c3aed",
    },
  ];
  return (
    <svg
      viewBox="0 0 720 260"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl border border-slate-100 shadow-sm"
    >
      <rect width="720" height="260" fill="#f8fafc" rx="12" />
      {/* Header row */}
      <rect
        x="16"
        y="16"
        width="688"
        height="36"
        rx="10"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
      <text x="60" y="39" fill="#94a3b8" fontSize="11" fontWeight="700">
        STUDENT
      </text>
      <text x="260" y="39" fill="#94a3b8" fontSize="11" fontWeight="700">
        DESTINATION
      </text>
      <text x="440" y="39" fill="#94a3b8" fontSize="11" fontWeight="700">
        STAGE
      </text>
      <text x="580" y="39" fill="#94a3b8" fontSize="11" fontWeight="700">
        ACTIONS
      </text>
      {/* Add student button */}
      <rect x="600" y="22" width="94" height="24" rx="8" fill="url(#btnGrad)" />
      <text
        x="647"
        y="38"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="700"
      >
        + Add Student
      </text>
      {rows.map((row, i) => (
        <g key={i}>
          <rect
            x="16"
            y={60 + i * 38}
            width="688"
            height="34"
            rx="8"
            fill={i % 2 === 0 ? "white" : "#f8fafc"}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
          <circle
            cx="42"
            cy={77 + i * 38}
            r="10"
            fill={`hsl(${i * 60}, 60%, 85%)`}
          />
          <text
            x="42"
            y={81 + i * 38}
            textAnchor="middle"
            fill={`hsl(${i * 60}, 50%, 35%)`}
            fontSize="8"
            fontWeight="700"
          >
            {row.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </text>
          <text
            x="60"
            y={81 + i * 38}
            fill="#1e293b"
            fontSize="12"
            fontWeight="600"
          >
            {row.name}
          </text>
          <text x="260" y={81 + i * 38} fill="#475569" fontSize="12">
            {row.country}
          </text>
          <rect
            x="440"
            y={66 + i * 38}
            width="72"
            height="20"
            rx="10"
            fill={row.stageBg}
          />
          <text
            x="476"
            y={80 + i * 38}
            textAnchor="middle"
            fill={row.stageColor}
            fontSize="10"
            fontWeight="600"
          >
            {row.stage}
          </text>
          <rect
            x="580"
            y={67 + i * 38}
            width="50"
            height="18"
            rx="6"
            fill="#f1f5f9"
          />
          <text
            x="605"
            y={80 + i * 38}
            textAnchor="middle"
            fill="#64748b"
            fontSize="10"
          >
            View →
          </text>
        </g>
      ))}
      <defs>
        <linearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Pipeline — Kanban board */
function IllustrationPipeline() {
  const cols = [
    {
      title: "Lead",
      color: "#94a3b8",
      bg: "#f8fafc",
      cards: ["Rohan K.", "Meera V."],
    },
    {
      title: "Prospecting",
      color: "#f59e0b",
      bg: "#fffbeb",
      cards: ["Anjali S."],
    },
    {
      title: "Applied",
      color: "#3b82f6",
      bg: "#eff6ff",
      cards: ["Dev P.", "Isha R."],
    },
    {
      title: "Interview",
      color: "#8b5cf6",
      bg: "#f5f3ff",
      cards: ["Karan M."],
    },
    {
      title: "Enrolled",
      color: "#22c55e",
      bg: "#f0fdf4",
      cards: ["Priya S.", "Amit T."],
    },
  ];
  return (
    <svg
      viewBox="0 0 720 240"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl border border-slate-100 shadow-sm"
    >
      <rect width="720" height="240" fill="#f1f5f9" rx="12" />
      {cols.map((col, ci) => (
        <g key={ci}>
          {/* Column */}
          <rect
            x={10 + ci * 140}
            y="10"
            width="130"
            height="220"
            rx="10"
            fill={col.bg}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          {/* Column header */}
          <rect
            x={10 + ci * 140}
            y="10"
            width="130"
            height="32"
            rx="10"
            fill={col.color + "22"}
          />
          <rect
            x={10 + ci * 140}
            y="30"
            width="130"
            height="12"
            fill={col.color + "22"}
          />
          <circle cx={26 + ci * 140} cy="26" r="5" fill={col.color} />
          <text
            x={36 + ci * 140}
            y="30"
            fill="#1e293b"
            fontSize="11"
            fontWeight="700"
          >
            {col.title}
          </text>
          {/* Cards */}
          {col.cards.map((name, ri) => (
            <g key={ri}>
              <rect
                x={18 + ci * 140}
                y={52 + ri * 64}
                width="114"
                height="52"
                rx="8"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <circle
                cx={34 + ci * 140}
                cy={64 + ri * 64}
                r="8"
                fill={`hsl(${ci * 70 + ri * 30}, 60%, 85%)`}
              />
              <text
                x={34 + ci * 140}
                y={68 + ri * 64}
                textAnchor="middle"
                fill={`hsl(${ci * 70 + ri * 30}, 50%, 35%)`}
                fontSize="7"
                fontWeight="700"
              >
                {name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </text>
              <text
                x={48 + ci * 140}
                y={67 + ri * 64}
                fill="#1e293b"
                fontSize="10"
                fontWeight="600"
              >
                {name}
              </text>
              <rect
                x={26 + ci * 140}
                y={76 + ri * 64}
                width="36"
                height="12"
                rx="6"
                fill={col.color + "22"}
              />
              <text
                x={44 + ci * 140}
                y={86 + ri * 64}
                textAnchor="middle"
                fill={col.color}
                fontSize="8"
                fontWeight="600"
              >
                {col.title}
              </text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/** Khizar Applications — timeline steps */
function IllustrationApplications() {
  const steps = [
    { label: "Form Submitted", done: true },
    { label: "Docs Uploaded", done: true },
    { label: "Under Review", done: true },
    { label: "Visa Filed", done: false },
    { label: "Decision", done: false },
  ];
  return (
    <svg
      viewBox="0 0 720 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl border border-slate-100 shadow-sm"
    >
      <rect width="720" height="200" fill="#f8fafc" rx="12" />
      {/* App card */}
      <rect
        x="16"
        y="16"
        width="340"
        height="168"
        rx="14"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <text x="32" y="44" fill="#0f172a" fontSize="14" fontWeight="800">
        Priya Sharma
      </text>
      <text x="32" y="60" fill="#64748b" fontSize="11">
        🇨🇦 Canada — Masters in CS
      </text>
      <rect x="32" y="70" width="64" height="18" rx="9" fill="#dcfce7" />
      <text
        x="64"
        y="83"
        textAnchor="middle"
        fill="#16a34a"
        fontSize="10"
        fontWeight="700"
      >
        Active
      </text>
      {/* Docs list */}
      {["Passport Copy", "Offer Letter", "Bank Statements", "SOP"].map(
        (d, i) => (
          <g key={i}>
            <rect
              x="32"
              y={100 + i * 20}
              width="12"
              height="12"
              rx="3"
              fill={i < 3 ? "#dcfce7" : "#f1f5f9"}
              stroke={i < 3 ? "#22c55e" : "#e2e8f0"}
            />
            <text
              x="48"
              y={111 + i * 20}
              fill={i < 3 ? "#374151" : "#94a3b8"}
              fontSize="10"
            >
              {d}
            </text>
            {i < 3 && (
              <text
                x="43"
                y={111 + i * 20}
                fill="#22c55e"
                fontSize="8"
                fontWeight="700"
              >
                ✓
              </text>
            )}
          </g>
        ),
      )}
      {/* Timeline */}
      <rect
        x="372"
        y="16"
        width="332"
        height="168"
        rx="14"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <text x="388" y="44" fill="#0f172a" fontSize="13" fontWeight="800">
        Application Timeline
      </text>
      {/* Timeline line */}
      <line
        x1="408"
        y1="64"
        x2="408"
        y2="170"
        stroke="#e2e8f0"
        strokeWidth="2"
      />
      {steps.map((s, i) => (
        <g key={i}>
          <circle
            cx="408"
            cy={64 + i * 26}
            r="8"
            fill={s.done ? "url(#doneGrad)" : "white"}
            stroke={s.done ? "none" : "#e2e8f0"}
            strokeWidth="2"
          />
          {s.done && (
            <text
              x="408"
              y={68 + i * 26}
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="800"
            >
              ✓
            </text>
          )}
          <text
            x="424"
            y={68 + i * 26}
            fill={s.done ? "#1e293b" : "#94a3b8"}
            fontSize="11"
            fontWeight={s.done ? "600" : "400"}
          >
            {s.label}
          </text>
        </g>
      ))}
      <defs>
        <linearGradient id="doneGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Meetings — calendar + meeting card */
function IllustrationMeetings() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const meetings = [
    {
      time: "10:00 AM",
      title: "Priya - Visa Docs Review",
      color: "#dbeafe",
      dot: "#3b82f6",
    },
    {
      time: "2:00 PM",
      title: "Rahul - Offer Letter Follow-up",
      color: "#ede9fe",
      dot: "#8b5cf6",
    },
    {
      time: "4:30 PM",
      title: "Sneha - Application Status",
      color: "#dcfce7",
      dot: "#22c55e",
    },
  ];
  return (
    <svg
      viewBox="0 0 720 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl border border-slate-100 shadow-sm"
    >
      <rect width="720" height="220" fill="#f8fafc" rx="12" />
      {/* Mini calendar */}
      <rect
        x="16"
        y="16"
        width="220"
        height="188"
        rx="14"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <rect
        x="16"
        y="16"
        width="220"
        height="40"
        rx="14"
        fill="url(#calGrad)"
      />
      <rect x="16" y="42" width="220" height="14" fill="url(#calGrad)" />
      <text
        x="126"
        y="42"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="800"
      >
        June 2026
      </text>
      {days.map((d, i) => (
        <text
          key={i}
          x={31 + i * 28}
          y="72"
          fill="#94a3b8"
          fontSize="9"
          fontWeight="700"
          textAnchor="middle"
        >
          {d}
        </text>
      ))}
      {Array.from({ length: 30 }, (_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const day = i + 1;
        const isToday = day === 15;
        return (
          <g key={i}>
            {isToday && (
              <circle
                cx={31 + col * 28}
                cy={90 + row * 22}
                r="11"
                fill="url(#calGrad)"
              />
            )}
            <text
              x={31 + col * 28}
              y={94 + row * 22}
              textAnchor="middle"
              fill={isToday ? "white" : "#374151"}
              fontSize="10"
              fontWeight={isToday ? "800" : "400"}
            >
              {day}
            </text>
            {[15, 18, 22].includes(day) && !isToday && (
              <circle
                cx={31 + col * 28}
                cy={99 + row * 22}
                r="2"
                fill="#3b82f6"
              />
            )}
          </g>
        );
      })}
      {/* Meeting cards */}
      <rect
        x="252"
        y="16"
        width="452"
        height="188"
        rx="14"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <text x="268" y="44" fill="#0f172a" fontSize="13" fontWeight="800">
        Today's Meetings
      </text>
      {meetings.map((m, i) => (
        <g key={i}>
          <rect
            x="268"
            y={60 + i * 48}
            width="420"
            height="40"
            rx="10"
            fill={m.color}
          />
          <circle cx="284" cy={80 + i * 48} r="5" fill={m.dot} />
          <text
            x="296"
            y={76 + i * 48}
            fill="#1e293b"
            fontSize="11"
            fontWeight="700"
          >
            {m.title}
          </text>
          <text x="296" y={90 + i * 48} fill="#64748b" fontSize="10">
            🕐 {m.time}
          </text>
        </g>
      ))}
      <defs>
        <linearGradient id="calGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Tasks & Deadlines — checklist + deadline card */
function IllustrationTasks() {
  const tasks = [
    { done: true, text: "Follow up with Priya on I-20 letter" },
    { done: true, text: "Upload Rahul's bank statements" },
    { done: false, text: "Schedule Sneha's mock interview" },
    { done: false, text: "Review Arjun's SOP draft" },
    { done: false, text: "Send reminder for deadline — Jun 30" },
  ];
  const deadlines = [
    { label: "UoT Application Deadline", date: "Jun 30", urgent: true },
    { label: "UK Tier 4 Visa Submission", date: "Jul 10", urgent: false },
    { label: "Germany Block Account", date: "Jul 18", urgent: false },
  ];
  return (
    <svg
      viewBox="0 0 720 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl border border-slate-100 shadow-sm"
    >
      <rect width="720" height="220" fill="#f8fafc" rx="12" />
      {/* Tasks panel */}
      <rect
        x="16"
        y="16"
        width="320"
        height="188"
        rx="14"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <text x="32" y="44" fill="#0f172a" fontSize="13" fontWeight="800">
        Tasks
      </text>
      <rect
        x="250"
        y="26"
        width="70"
        height="22"
        rx="8"
        fill="url(#btnGrad2)"
      />
      <text
        x="285"
        y="41"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="700"
      >
        + New Task
      </text>
      {tasks.map((t, i) => (
        <g key={i}>
          <rect
            x="32"
            y={56 + i * 26}
            width="14"
            height="14"
            rx="4"
            fill={t.done ? "#22c55e" : "white"}
            stroke={t.done ? "#22c55e" : "#cbd5e1"}
            strokeWidth="1.5"
          />
          {t.done && (
            <text
              x="39"
              y={67 + i * 26}
              textAnchor="middle"
              fill="white"
              fontSize="9"
              fontWeight="800"
            >
              ✓
            </text>
          )}
          <text
            x="54"
            y={67 + i * 26}
            fill={t.done ? "#94a3b8" : "#374151"}
            fontSize="10"
            textDecoration={t.done ? "line-through" : "none"}
          >
            {t.text}
          </text>
        </g>
      ))}
      {/* Deadlines panel */}
      <rect
        x="352"
        y="16"
        width="352"
        height="188"
        rx="14"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <text x="368" y="44" fill="#0f172a" fontSize="13" fontWeight="800">
        Upcoming Deadlines
      </text>
      {deadlines.map((d, i) => (
        <g key={i}>
          <rect
            x="368"
            y={56 + i * 46}
            width="320"
            height="38"
            rx="10"
            fill={d.urgent ? "#fff7ed" : "#f8fafc"}
            stroke={d.urgent ? "#fed7aa" : "#e2e8f0"}
            strokeWidth="1"
          />
          <rect
            x="376"
            y={64 + i * 46}
            width="4"
            height="22"
            rx="2"
            fill={d.urgent ? "#f97316" : "#94a3b8"}
          />
          <text
            x="388"
            y={72 + i * 46}
            fill="#1e293b"
            fontSize="11"
            fontWeight="700"
          >
            {d.label}
          </text>
          <text
            x="388"
            y={86 + i * 46}
            fill={d.urgent ? "#ea580c" : "#64748b"}
            fontSize="10"
          >
            {d.urgent ? "⚠ " : "📅 "}Due: {d.date}
          </text>
        </g>
      ))}
      <defs>
        <linearGradient id="btnGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Settings — branding preview */
function IllustrationSettings() {
  return (
    <svg
      viewBox="0 0 720 240"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl border border-slate-100 shadow-sm"
    >
      <rect width="720" height="240" fill="#060b17" rx="12" />
      {/* Nav tabs */}
      <rect x="0" y="0" width="720" height="44" fill="#0b1220" />
      {["Profile", "Branding", "Email", "Subscription"].map((tab, i) => (
        <g key={i}>
          <rect
            x={16 + i * 110}
            y="12"
            width="100"
            height="22"
            rx="8"
            fill={i === 1 ? "#1e40af22" : "transparent"}
            stroke={i === 1 ? "#3b82f6" : "transparent"}
          />
          <text
            x={66 + i * 110}
            y="27"
            textAnchor="middle"
            fill={i === 1 ? "#60a5fa" : "#475569"}
            fontSize="11"
            fontWeight={i === 1 ? "700" : "500"}
          >
            {tab}
          </text>
        </g>
      ))}
      {/* Branding form */}
      <rect
        x="16"
        y="56"
        width="340"
        height="168"
        rx="12"
        fill="#0f1829"
        stroke="#1a2744"
        strokeWidth="1"
      />
      <text x="32" y="80" fill="#c9d4e8" fontSize="12" fontWeight="700">
        Brand Name
      </text>
      <rect
        x="32"
        y="86"
        width="308"
        height="28"
        rx="8"
        fill="#172036"
        stroke="#1e3050"
        strokeWidth="1"
      />
      <text x="46" y="105" fill="#c9d4e8" fontSize="11">
        Global Study Advisors
      </text>
      <text x="32" y="132" fill="#c9d4e8" fontSize="12" fontWeight="700">
        Primary Color
      </text>
      <rect x="32" y="138" width="60" height="28" rx="8" fill="#22c55e" />
      <text x="104" y="158" fill="#4ade80" fontSize="10">
        #22c55e
      </text>
      <text x="32" y="184" fill="#c9d4e8" fontSize="12" fontWeight="700">
        Brand Logo
      </text>
      <rect
        x="32"
        y="190"
        width="308"
        height="28"
        rx="8"
        fill="#172036"
        stroke="#1e3050"
        strokeWidth="1"
        strokeDasharray="4"
      />
      <text x="186" y="209" textAnchor="middle" fill="#2e4570" fontSize="10">
        Click to upload logo
      </text>
      {/* Live preview */}
      <rect
        x="372"
        y="56"
        width="332"
        height="168"
        rx="12"
        fill="#0f1829"
        stroke="#1a2744"
        strokeWidth="1"
      />
      <text x="388" y="80" fill="#c9d4e8" fontSize="12" fontWeight="700">
        Live Preview
      </text>
      <rect
        x="388"
        y="88"
        width="300"
        height="128"
        rx="10"
        fill="#0a1422"
        stroke="#22c55e22"
        strokeWidth="1"
      />
      <rect x="388" y="88" width="300" height="28" rx="10" fill="#0a1422" />
      <rect x="388" y="104" width="300" height="12" fill="#0a1422" />
      <text x="404" y="107" fill="#22c55e" fontSize="9" fontWeight="700">
        Global Study Advisors
      </text>
      <text x="576" y="107" fill="#c9d4e8" fontSize="9">
        Dashboard
      </text>
      <text x="628" y="107" fill="#c9d4e8" fontSize="9">
        Profile
      </text>
      {/* Preview content */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={396 + i * 80}
          y="130"
          width="70"
          height="40"
          rx="8"
          fill="#172036"
          stroke="#22c55e22"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CounselorManualPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/dashboard/counselor-dashboard"
            className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 text-sm font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
              <BookOpen size={22} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                Counselor Dashboard Manual
              </h1>
              <p className="text-slate-500 mt-1 text-sm sm:text-base">
                A complete visual guide to everything available in your
                dashboard.
              </p>
            </div>
          </div>

          {/* ── Sticky anchor nav ──────────────────────────────────────── */}
          <nav className="flex gap-2 mt-6 overflow-x-auto pb-1 scrollbar-hide">
            {NAV.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 text-[12px] font-semibold whitespace-nowrap transition-all border border-transparent hover:border-sky-100"
              >
                <Icon size={13} strokeWidth={2} />
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 1 — Overview */}
        <Section
          id="overview"
          icon={LayoutDashboard}
          color="from-sky-500 to-indigo-600"
          title="Dashboard Overview"
          subtitle="Your command centre for all student activity"
        >
          <IllustrationOverview />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-2">
                What you see at a glance
              </h3>
              <ul className="space-y-1.5 text-slate-600 text-[13px]">
                <li className="flex gap-2">
                  <span className="text-sky-500 font-bold">→</span> KPI summary
                  cards at the top
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-500 font-bold">→</span> Monthly
                  analytics chart (applications, revenue)
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-500 font-bold">→</span> Application
                  pipeline funnel by stage
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-500 font-bold">→</span> Upcoming
                  deadlines and recent activity feed
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-500 font-bold">→</span> Tasks and
                  student table at the bottom
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-2">
                Sidebar navigation
              </h3>
              <ul className="space-y-1.5 text-slate-600 text-[13px]">
                <li className="flex gap-2">
                  <span className="text-indigo-500 font-bold">→</span> Hover to
                  expand the sidebar and see labels
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-500 font-bold">→</span> Active
                  page is highlighted with a sky-blue indicator
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-500 font-bold">→</span> On
                  mobile, tap the ☰ icon to open the drawer
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-500 font-bold">→</span> Logout
                  button is at the bottom of the sidebar
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 2 — KPI Cards */}
        <Section
          id="kpi"
          icon={BarChart3}
          color="from-violet-500 to-purple-600"
          title="KPI Cards"
          subtitle="Key performance indicators updated in real time"
        >
          <IllustrationKPI />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: "Total Students",
                desc: "Cumulative count of all leads + registered students assigned to you.",
              },
              {
                title: "Conversion Rate",
                desc: "Percentage of leads who progressed to 'Enrolled' in the past 90 days.",
              },
              {
                title: "Applications",
                desc: "Number of live Khizar Applications currently in progress.",
              },
              {
                title: "Revenue (est.)",
                desc: "Estimated revenue from active subscriptions and deposits logged this month.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white rounded-xl border border-slate-100 p-4"
              >
                <p className="font-bold text-slate-700 text-[12px] mb-1">
                  {c.title}
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
          <Tip>
            Click the <strong>Refresh</strong> button on the KPI card panel to
            force-recalculate stats from the database. Useful if you just
            enrolled a student and want the numbers to update immediately.
          </Tip>
        </Section>

        {/* 3 — Students */}
        <Section
          id="students"
          icon={GraduationCap}
          color="from-emerald-500 to-teal-600"
          title="Student Management"
          subtitle="Add, track and manage every student in your pipeline"
        >
          <IllustrationStudents />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">
                Adding a new student
              </h3>
              <Steps
                steps={[
                  "Go to Students from the sidebar.",
                  "Click the + Add Student button (top right).",
                  "Fill in the student's name, email, phone and preferred destination country.",
                  "Select the current stage (Lead / Prospecting / Applied etc.).",
                  "Click Save — the student appears in the table immediately.",
                ]}
              />
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">
                Student profile page
              </h3>
              <Steps
                steps={[
                  "Click View → on any student row to open their full profile.",
                  "The profile shows personal details, academic history, and test scores.",
                  "Tabs: Applications, Deadlines, Documents, Notes, Visa Progress.",
                  "Assign applications, upload documents and add counselor notes from here.",
                  "Stage changes here sync across the pipeline board automatically.",
                ]}
              />
            </div>
          </div>
          <Tip>
            Use the search bar at the top of the Students page to filter by
            name, country or stage. You can also sort columns by clicking the
            column headers.
          </Tip>
        </Section>

        {/* 4 — Pipeline */}
        <Section
          id="pipeline"
          icon={TrendingUp}
          color="from-sky-500 to-cyan-500"
          title="Application Pipeline Board"
          subtitle="Drag-and-drop Kanban view of where each student stands"
        >
          <IllustrationPipeline />
          <div className="mt-5 bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">
              Pipeline stages explained
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                {
                  stage: "Lead",
                  color: "bg-slate-100 text-slate-600",
                  desc: "Initial contact, no application yet.",
                },
                {
                  stage: "Prospecting",
                  color: "bg-amber-100 text-amber-700",
                  desc: "Interested, currently gathering docs.",
                },
                {
                  stage: "Applied",
                  color: "bg-blue-100 text-blue-700",
                  desc: "Application submitted to university.",
                },
                {
                  stage: "Interview",
                  color: "bg-purple-100 text-purple-700",
                  desc: "Interview scheduled or completed.",
                },
                {
                  stage: "Enrolled",
                  color: "bg-green-100 text-green-700",
                  desc: "Offer accepted, visa or enrollment confirmed.",
                },
              ].map((s) => (
                <div
                  key={s.stage}
                  className="text-center p-3 rounded-xl bg-slate-50"
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-2 ${s.color}`}
                  >
                    {s.stage}
                  </span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Tip>
            The pipeline funnel on the main dashboard counts students per stage.
            Moving a student to a new stage on their profile page updates the
            Kanban board and funnel in real time.
          </Tip>
        </Section>

        {/* 5 — Applications */}
        <Section
          id="applications"
          icon={FileCheck}
          color="from-indigo-500 to-violet-600"
          title="Khizar Applications"
          subtitle="Managed visa and university applications with full document tracking"
        >
          <IllustrationApplications />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">
                Creating a Khizar Application
              </h3>
              <Steps
                steps={[
                  "Go to Khizar Applications in the sidebar.",
                  "Click New Application and select the student.",
                  "Fill in the destination country, university, program and intake.",
                  "Upload required documents (passport, offer letter, SOP, financials).",
                  "Submit — the application enters the review queue.",
                ]}
              />
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">
                Application status timeline
              </h3>
              <Steps
                steps={[
                  "Form Submitted → your application is received.",
                  "Docs Uploaded → all documents are attached and verified.",
                  "Under Review → Khizar team is processing.",
                  "Visa Filed → visa application has been officially submitted.",
                  "Decision → outcome communicated (approved / rejected / waitlisted).",
                ]}
              />
            </div>
          </div>
          <Tip>
            You can upload multiple documents in one go using the bulk upload
            button on the Documents tab of any application. Supported formats:
            PDF, JPG, PNG (max 10 MB each).
          </Tip>
        </Section>

        {/* 6 — Meetings */}
        <Section
          id="meetings"
          icon={CalendarDays}
          color="from-sky-400 to-blue-600"
          title="Meetings"
          subtitle="Schedule and track counselor–student meetings"
        >
          <IllustrationMeetings />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">
                Scheduling a meeting
              </h3>
              <Steps
                steps={[
                  "Go to Meetings in the sidebar.",
                  "Click + Schedule Meeting.",
                  "Select the student from the dropdown.",
                  "Pick a date, time and meeting type (video / in-person / phone).",
                  "Add meeting notes or agenda items.",
                  "Save — meeting appears on the calendar and in the student's profile.",
                ]}
              />
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">
                Managing meetings
              </h3>
              <ul className="space-y-2 text-slate-600 text-[13px]">
                <li className="flex gap-2">
                  <span className="text-sky-500">→</span> Blue dots on the
                  mini-calendar mark days with meetings
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-500">→</span> Click a day to see all
                  meetings scheduled for that date
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-500">→</span> Mark a meeting as
                  Completed or Cancelled from the meeting card
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-500">→</span> Meeting history is
                  visible on the student's profile under Activity
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-500">→</span> Email reminders are
                  sent automatically 1 hour before each meeting
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 7 — Tasks */}
        <Section
          id="tasks"
          icon={CheckSquare}
          color="from-amber-500 to-orange-500"
          title="Tasks & Deadlines"
          subtitle="Stay on top of follow-ups and university deadlines"
        >
          <IllustrationTasks />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">
                Creating tasks
              </h3>
              <Steps
                steps={[
                  "From the main dashboard, find the Tasks panel.",
                  "Click + New Task and type a description.",
                  "Optionally link it to a student by typing their name.",
                  "Set a due date if there's a deadline.",
                  "Check the checkbox to mark it done — it moves to the completed list.",
                ]}
              />
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">
                Managing deadlines
              </h3>
              <Steps
                steps={[
                  "Deadlines are set per student on their profile under the Deadlines tab.",
                  "They also appear on the Upcoming Deadlines panel on the main dashboard.",
                  "Urgent deadlines (within 7 days) appear in orange with a ⚠ icon.",
                  "Automated email reminders are sent to you 7 days and 1 day before each deadline.",
                  "Mark a deadline as completed when the task is done.",
                ]}
              />
            </div>
          </div>
          <Tip>
            Deadlines set on a student's profile are separate from your personal
            task list. Student deadlines (e.g. visa submission dates) appear in
            the Upcoming Deadlines panel on your dashboard and trigger automated
            email reminders.
          </Tip>
        </Section>

        {/* 8 — Settings */}
        <Section
          id="settings"
          icon={Settings}
          color="from-slate-600 to-slate-800"
          title="Settings & Branding"
          subtitle="Customise your agency's presence on the platform"
        >
          <IllustrationSettings />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                tab: "Profile",
                desc: "Update your name, photo, phone number and bio that students see on their portal.",
              },
              {
                tab: "Branding",
                desc: "Set your agency name, logo, brand colors and tagline. Live preview updates in real time.",
              },
              {
                tab: "Email",
                desc: "Configure your reply-to email so student notification emails show your agency address.",
              },
              {
                tab: "Subscription",
                desc: "View your current plan, trial days remaining, and upgrade or cancel your subscription.",
              },
            ].map((t) => (
              <div
                key={t.tab}
                className="bg-white rounded-xl border border-slate-100 p-4"
              >
                <p className="font-bold text-slate-800 text-[12px] mb-1">
                  {t.tab}
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
          <Tip>
            After uploading a new logo, click <strong>Save Changes</strong> at
            the bottom of the Branding tab. Your students' portal will reflect
            the updated logo on their next page load.
          </Tip>
        </Section>

        {/* ── Quick reference ─────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-sky-500" strokeWidth={2} />
            <h2 className="text-base font-extrabold text-slate-800">
              Quick Reference
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                q: "How do I add a student?",
                a: "Students → + Add Student → fill form → Save.",
              },
              {
                q: "Where is the pipeline board?",
                a: "It's on the main Dashboard page, below the Analytics chart.",
              },
              {
                q: "How do I upload documents?",
                a: "Open a student → Khizar Applications → select application → Documents tab → Upload.",
              },
              {
                q: "How do I customise my brand?",
                a: "Settings → Branding tab → upload logo, set colors → Save Changes.",
              },
              {
                q: "How do KPI stats refresh?",
                a: "Automatically every 6 hours, or manually via the Refresh button on the KPI panel.",
              },
              {
                q: "Where are automated reminders sent?",
                a: "To your registered email. Set up in Settings → Email tab.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="bg-white rounded-xl p-4 border border-sky-100"
              >
                <p className="text-slate-700 font-semibold text-[12px] mb-1">
                  {q}
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer CTA ─────────────────────────────────────────────────── */}
        <div className="text-center pb-4">
          <Link
            href="/dashboard/counselor-dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:from-sky-600 hover:to-indigo-700 transition-all"
          >
            <LayoutDashboard size={16} strokeWidth={2} />
            Go to Dashboard
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
          <p className="text-slate-400 text-[11px] mt-3">
            Need more help? Email us at{" "}
            <a
              href="mailto:support@khizaroverseas.in"
              className="text-sky-500 hover:underline"
            >
              support@khizaroverseas.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
