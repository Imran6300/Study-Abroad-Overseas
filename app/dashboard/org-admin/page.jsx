"use client";

/**
 * app/dashboard/org-admin/page.jsx
 *
 * White-Label Admin overview dashboard — dark-themed to match the sidebar.
 * Sections:
 *   1. KPI cards  (students, enrolled, counselors, applications)
 *   2. Stat strip (conversion rate, pending apps, active students)
 *   3. Student Pipeline funnel
 *   4. Visa Status breakdown
 *   5. Top Counselors leaderboard (from counselors[].stats)
 *   6. Recent Applications snapshot
 */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  FileText,
  ArrowUpRight,
  CheckCircle,
  TrendingUp,
  Clock,
  AlertCircle,
  ShieldCheck,
  Hourglass,
  XCircle,
  Trophy,
  Activity,
} from "lucide-react";
import {
  fetchOrgOverview,
  fetchOrgPipeline,
  fetchOrgCounselors,
  fetchOrgApplications,
  selectOrgOverview,
  selectOrgPipeline,
  selectOrgCounselors,
  selectOrgApplications,
  selectOrgAdminLoading,
  fetchOrganization,
} from "@/store/orgAdminSlice";

// ─── Shared skeleton block ────────────────────────────────────────────────────

function Skeleton({ className = "" }) {
  return (
    <div className={`bg-white/[0.04] rounded-lg animate-pulse ${className}`} />
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, accent = "emerald", href }) {
  const a = {
    emerald: {
      icon: "text-emerald-400",
      bg: "bg-emerald-400/10",
      bar: "bg-emerald-400",
    },
    blue: { icon: "text-blue-400", bg: "bg-blue-400/10", bar: "bg-blue-400" },
    purple: {
      icon: "text-purple-400",
      bg: "bg-purple-400/10",
      bar: "bg-purple-400",
    },
    amber: {
      icon: "text-amber-400",
      bg: "bg-amber-400/10",
      bar: "bg-amber-400",
    },
  }[accent];

  const card = (
    <div className="relative bg-[#0d2137] border border-white/[0.06] rounded-2xl p-5 overflow-hidden hover:border-white/[0.14] transition-all duration-200 group cursor-pointer">
      <div
        className={`absolute top-0 left-5 right-5 h-[2px] ${a.bar} opacity-40 rounded-full`}
      />
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${a.bg}`}>
          <Icon className={`w-4 h-4 ${a.icon}`} />
        </div>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white/50 transition-colors" />
        )}
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">
        {value != null ? value : <span className="text-white/20">—</span>}
      </p>
      <p className="text-[10px] text-white/40 mt-0.5 font-semibold uppercase tracking-widest">
        {label}
      </p>
      {sub && <p className="text-xs text-white/25 mt-1.5">{sub}</p>}
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

function KpiSkeleton() {
  return (
    <div className="bg-[#0d2137] border border-white/[0.06] rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-9 h-9 rounded-xl" />
        <Skeleton className="w-6 h-4 rounded" />
      </div>
      <Skeleton className="w-16 h-7 mb-2" />
      <Skeleton className="w-28 h-3" />
    </div>
  );
}

// ─── Stat Strip ───────────────────────────────────────────────────────────────

function StatStrip({ overview }) {
  const items = [
    {
      label: "Conversion Rate",
      value:
        overview?.conversionRate != null ? `${overview.conversionRate}%` : "0%",
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Pending Applications",
      value: overview?.pendingApplications ?? 0,
      icon: Clock,
      color: "text-amber-400",
    },
    {
      label: "Active Students",
      value: overview?.activeStudents ?? 0,
      icon: AlertCircle,
      color: "text-blue-400",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {items.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-[#0d2137] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <Icon className={`w-4 h-4 shrink-0 ${color}`} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white tabular-nums">{value}</p>
            <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider truncate">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Student Pipeline ─────────────────────────────────────────────────────────

const STAGE_CFG = [
  { key: "lead", label: "Lead", color: "bg-slate-500", text: "text-slate-400" },
  {
    key: "contacted",
    label: "Contacted",
    color: "bg-blue-500",
    text: "text-blue-400",
  },
  {
    key: "qualified",
    label: "Qualified",
    color: "bg-indigo-500",
    text: "text-indigo-400",
  },
  {
    key: "application_started",
    label: "App Started",
    color: "bg-violet-500",
    text: "text-violet-400",
  },
  {
    key: "application_submitted",
    label: "Submitted",
    color: "bg-purple-500",
    text: "text-purple-400",
  },
  {
    key: "offer_received",
    label: "Offer",
    color: "bg-amber-500",
    text: "text-amber-400",
  },
  {
    key: "visa_process",
    label: "Visa",
    color: "bg-orange-500",
    text: "text-orange-400",
  },
  {
    key: "enrolled",
    label: "Enrolled",
    color: "bg-emerald-500",
    text: "text-emerald-400",
  },
  { key: "lost", label: "Lost", color: "bg-red-500", text: "text-red-400" },
];

function PipelineFunnel({ pipeline, loading }) {
  return (
    <div className="bg-[#0d2137] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white/80">
            Student Pipeline
          </h2>
          <p className="text-xs text-white/30 mt-0.5">All students by stage</p>
        </div>
        {!loading && pipeline && (
          <span className="text-xs text-white/25 tabular-nums font-medium">
            {Object.values(pipeline).reduce((s, v) => s + v, 0)} total
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-20 h-3" />
              <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full" />
              <Skeleton className="w-5 h-3" />
            </div>
          ))}
        </div>
      ) : !pipeline || Object.values(pipeline).every((v) => v === 0) ? (
        <div className="text-center py-10">
          <TrendingUp className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-sm text-white/25">No students in pipeline yet</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {STAGE_CFG.map(({ key, label, color, text }) => {
            const total = Object.values(pipeline).reduce((s, v) => s + v, 0);
            const count = pipeline[key] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key} className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-medium w-24 text-right shrink-0 ${count > 0 ? text : "text-white/15"}`}
                >
                  {label}
                </span>
                <div className="flex-1 bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${count > 0 ? color : ""}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-semibold w-7 text-right shrink-0 tabular-nums ${count > 0 ? "text-white/60" : "text-white/15"}`}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Visa Status ──────────────────────────────────────────────────────────────

function VisaStatus({ pipeline, applications, loading }) {
  // Derive visa data from pipeline + applications
  // pipeline.visa_process = in-progress, pipeline.enrolled = approved (visa done)
  // We approximate "pending" from pipeline, "approved" from enrolled, "rejected" from lost
  const visaInProgress = pipeline?.visa_process ?? 0;
  const visaApproved = pipeline?.enrolled ?? 0;
  const visaLost = pipeline?.lost ?? 0;
  const total = visaInProgress + visaApproved + visaLost;

  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const segments = [
    {
      label: "Approved",
      value: visaApproved,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      icon: ShieldCheck,
      dotColor: "bg-emerald-500",
    },
    {
      label: "In Progress",
      value: visaInProgress,
      color: "bg-amber-500",
      textColor: "text-amber-400",
      icon: Hourglass,
      dotColor: "bg-amber-500",
    },
    {
      label: "Lost",
      value: visaLost,
      color: "bg-red-500",
      textColor: "text-red-400",
      icon: XCircle,
      dotColor: "bg-red-500",
    },
  ];

  return (
    <div className="bg-[#0d2137] border border-white/[0.06] rounded-2xl p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white/80">Visa Status</h2>
        <p className="text-xs text-white/30 mt-0.5">
          Current visa pipeline breakdown
        </p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <Skeleton className="w-full h-3 rounded-full" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-8 h-4" />
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <div className="text-center py-10">
          <ShieldCheck className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-sm text-white/25">No visa data yet</p>
        </div>
      ) : (
        <>
          {/* Stacked progress bar */}
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-5">
            {segments.map(({ label, value, color }) =>
              value > 0 ? (
                <div
                  key={label}
                  className={`${color} transition-all duration-700`}
                  style={{ width: `${pct(value)}%` }}
                  title={`${label}: ${value}`}
                />
              ) : null,
            )}
          </div>

          {/* Legend rows */}
          <div className="space-y-2">
            {segments.map(
              ({ label, value, textColor, icon: Icon, dotColor }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${dotColor} opacity-80`}
                    />
                    <span className="text-xs text-white/50">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold tabular-nums ${value > 0 ? textColor : "text-white/20"}`}
                    >
                      {value}
                    </span>
                    <span className="text-[10px] text-white/20 w-8 text-right tabular-nums">
                      {pct(value)}%
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-xs text-white/30">
              Total in visa pipeline
            </span>
            <span className="text-sm font-bold text-white tabular-nums">
              {total}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Top Counselors ───────────────────────────────────────────────────────────

function TopCounselors({ counselors, loading }) {
  // Sort by stats.totalStudents desc, take top 5
  const ranked = [...counselors]
    .sort(
      (a, b) => (b.stats?.totalStudents ?? 0) - (a.stats?.totalStudents ?? 0),
    )
    .slice(0, 5);

  const maxStudents = ranked[0]?.stats?.totalStudents ?? 1;

  return (
    <div className="bg-[#0d2137] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white/80">
            Top Counselors
          </h2>
          <p className="text-xs text-white/30 mt-0.5">
            Ranked by total students
          </p>
        </div>
        <Link
          href="/dashboard/org-admin/counselors"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-6 h-4 shrink-0" />
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="w-24 h-3" />
                <Skeleton className="w-full h-1.5 rounded-full" />
              </div>
              <Skeleton className="w-6 h-4 shrink-0" />
            </div>
          ))}
        </div>
      ) : ranked.length === 0 ||
        ranked.every((c) => !c.stats?.totalStudents) ? (
        <div className="text-center py-10">
          <Trophy className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-sm text-white/25">No counselor data yet</p>
          <Link
            href="/dashboard/org-admin/counselors"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors mt-2 inline-block"
          >
            Invite counselors →
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {ranked.map((c, i) => {
            const students = c.stats?.totalStudents ?? 0;
            const enrolled = c.stats?.enrolled ?? 0;
            const conversion =
              students > 0 ? Math.round((enrolled / students) * 100) : 0;
            const barPct =
              maxStudents > 0 ? Math.round((students / maxStudents) * 100) : 0;

            const rankColors = [
              "text-amber-400",
              "text-slate-300",
              "text-amber-600",
              "text-white/30",
              "text-white/30",
            ];
            const rankBg = [
              "bg-amber-400/10",
              "bg-slate-400/10",
              "bg-amber-700/10",
              "bg-white/5",
              "bg-white/5",
            ];

            return (
              <div key={c._id} className="flex items-center gap-3 group">
                {/* Rank */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${rankBg[i]} ${rankColors[i]}`}
                >
                  {i + 1}
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>

                {/* Bar + name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="text-xs font-semibold text-white/80 truncate pr-2">
                      {c.name}
                    </p>
                    <span className="text-[10px] text-white/30 shrink-0 tabular-nums">
                      {conversion}% conv.
                    </span>
                  </div>
                  <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>

                {/* Count */}
                <span className="text-sm font-bold text-white/70 tabular-nums shrink-0 w-6 text-right">
                  {students}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Recent Applications ──────────────────────────────────────────────────────

const APP_STATUS_MAP = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10" },
  reviewing: {
    label: "Reviewing",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  accepted: {
    label: "Accepted",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-400/10" },
  enrolled: {
    label: "Enrolled",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  completed: {
    label: "Completed",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
  },
};

function RecentApplications({ applications, loading }) {
  const recent = applications.slice(0, 5);

  return (
    <div className="bg-[#0d2137] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white/80">
            Recent Applications
          </h2>
          <p className="text-xs text-white/30 mt-0.5">Latest across your org</p>
        </div>
        <Link
          href="/dashboard/org-admin/applications"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="w-32 h-3" />
                <Skeleton className="w-20 h-2.5" />
              </div>
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-sm text-white/25">No applications yet</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {recent.map((app) => {
            const s = APP_STATUS_MAP[app.status] ?? {
              label: app.status,
              color: "text-white/40",
              bg: "bg-white/5",
            };
            const studentName = app.studentSnapshot?.name ?? "Student";
            const counselorName = app.counselorId?.name ?? null;
            const dateStr = app.createdAt
              ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "";
            return (
              <div
                key={app._id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate">
                    {studentName}
                    <span className="text-white/30 font-normal">
                      {" "}
                      · {app.university ?? "University"}
                    </span>
                  </p>
                  <p className="text-[10px] text-white/30 truncate mt-0.5">
                    {counselorName ? `${counselorName} · ` : ""}
                    {dateStr}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.bg} ${s.color}`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Counselor Quick List ─────────────────────────────────────────────────────

function CounselorQuickList({ counselors, loading }) {
  const shown = counselors.slice(0, 5);
  return (
    <div className="bg-[#0d2137] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white/80">
            Your Counselors
          </h2>
          <p className="text-xs text-white/30 mt-0.5">
            {counselors.filter((c) => c.isActive).length} of {counselors.length}{" "}
            active
          </p>
        </div>
        <Link
          href="/dashboard/org-admin/counselors"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Manage →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="w-24 h-3" />
                <Skeleton className="w-36 h-2.5" />
              </div>
              <Skeleton className="w-14 h-5 rounded-full" />
            </div>
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-10">
          <Users className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-sm text-white/25 mb-3">No counselors yet</p>
          <Link
            href="/dashboard/org-admin/counselors"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Invite your first counselor →
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {shown.map((c) => (
            <div
              key={c._id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
                {c.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/80 truncate leading-none mb-0.5">
                  {c.name}
                </p>
                <p className="text-[10px] text-white/30 truncate">{c.email}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    c.isActive
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-white/5 text-white/25"
                  }`}
                >
                  {c.isActive ? "Active" : "Suspended"}
                </span>
                {c.stats?.totalStudents > 0 && (
                  <span className="text-[10px] text-white/25 tabular-nums">
                    {c.stats.totalStudents} students
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrgAdminOverviewPage() {
  const dispatch = useDispatch();
  const overview = useSelector(selectOrgOverview);
  const pipeline = useSelector(selectOrgPipeline);
  const counselors = useSelector(selectOrgCounselors);
  const applications = useSelector(selectOrgApplications);
  const loading = useSelector(selectOrgAdminLoading);

  useEffect(() => {
    dispatch(fetchOrgOverview());
    dispatch(fetchOrgPipeline());
    dispatch(fetchOrgCounselors());
    dispatch(fetchOrgApplications({ limit: 10 }));
    dispatch(fetchOrganization());
  }, [dispatch]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Page heading ───────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Overview</h1>
        <p className="text-sm text-white/40 mt-0.5">
          Organization performance at a glance
        </p>
      </div>

      {/* ── KPI cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {loading.overview ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              icon={GraduationCap}
              label="Total Students"
              value={overview?.totalStudents ?? 0}
              sub={`${overview?.activeStudents ?? 0} active`}
              accent="blue"
              href="/dashboard/org-admin/students"
            />
            <KpiCard
              icon={CheckCircle}
              label="Enrolled"
              value={overview?.enrolled ?? 0}
              sub={
                overview?.conversionRate != null
                  ? `${overview.conversionRate}% conversion`
                  : "0% conversion"
              }
              accent="emerald"
            />
            <KpiCard
              icon={Users}
              label="Counselors"
              value={overview?.totalCounselors ?? 0}
              sub={`${overview?.activeCounselors ?? 0} active`}
              accent="purple"
              href="/dashboard/org-admin/counselors"
            />
            <KpiCard
              icon={FileText}
              label="Applications"
              value={overview?.totalApplications ?? 0}
              sub={`${overview?.pendingApplications ?? 0} pending`}
              accent="amber"
              href="/dashboard/org-admin/applications"
            />
          </>
        )}
      </div>

      {/* ── Stat strip ─────────────────────────────────────────── */}
      <StatStrip overview={overview} />

      {/* ── Row 1: Pipeline + Visa Status ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <PipelineFunnel pipeline={pipeline} loading={loading.pipeline} />
        <VisaStatus
          pipeline={pipeline}
          applications={applications}
          loading={loading.pipeline}
        />
      </div>

      {/* ── Row 2: Top Counselors + Recent Applications ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <TopCounselors counselors={counselors} loading={loading.counselors} />
        <RecentApplications
          applications={applications}
          loading={loading.applications}
        />
      </div>

      {/* ── Row 3: Counselor quick list ─────────────────────────── */}
      <CounselorQuickList
        counselors={counselors}
        loading={loading.counselors}
      />
    </div>
  );
}
