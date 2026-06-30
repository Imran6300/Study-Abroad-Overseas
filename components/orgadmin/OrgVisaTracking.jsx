"use client";

/**
 * components/orgadmin/OrgVisaTracking.jsx
 *
 * Visa tracking dashboard widget for the White-Label Admin.
 * Data source: GET /api/org-admin/visa-stats (org-scoped, real backend)
 *
 * Three panels in one card:
 *   Left  — Status breakdown donut + status rows (mirrors super-admin VisaStatus)
 *   Mid   — Country breakdown bar chart (top 8)
 *   Right — Recent visa updates feed (last 6 students)
 */

import { useEffect, useState } from "react";
import { ShieldCheck, Globe, Clock, RefreshCw } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3020";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_META = {
  not_started: {
    label: "Not Started",
    color: "#4a6e9a",
    bg: "#0d1f3c",
    dot: "#4a6e9a",
  },
  in_progress: {
    label: "In Progress",
    color: "#60a5fa",
    bg: "#0d1f3c",
    dot: "#3b82f6",
  },
  approved: {
    label: "Approved",
    color: "#4ade80",
    bg: "#071a0e",
    dot: "#10b981",
  },
  rejected: {
    label: "Rejected",
    color: "#f87171",
    bg: "#2d0a0a",
    dot: "#ef4444",
  },
  on_hold: {
    label: "On Hold",
    color: "#fbbf24",
    bg: "#1c1200",
    dot: "#f59e0b",
  },
};

const OVERALL_STATUS_META = {
  not_started: { label: "Not Started", color: "#4a6e9a" },
  in_progress: { label: "In Progress", color: "#60a5fa" },
  approved: { label: "Approved", color: "#4ade80" },
  rejected: { label: "Rejected", color: "#f87171" },
  on_hold: { label: "On Hold", color: "#fbbf24" },
};

// ─── SVG Donut ────────────────────────────────────────────────────────────────

function Donut({ statusCounts, total }) {
  const SIZE = 120;
  const R = 44;
  const STROKE = 14;
  const C = SIZE / 2;
  const CIRC = 2 * Math.PI * R;

  const order = [
    "approved",
    "in_progress",
    "on_hold",
    "rejected",
    "not_started",
  ];

  let offset = 0;
  const slices = order
    .filter((k) => statusCounts[k] > 0)
    .map((k) => {
      const pct = statusCounts[k] / Math.max(total, 1);
      const dash = pct * CIRC;
      const gap = CIRC - dash;
      const slice = { key: k, dash, gap, offset, color: STATUS_META[k].dot };
      offset += dash;
      return slice;
    });

  if (total === 0) {
    return (
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="#0e1d36"
          strokeWidth={STROKE}
        />
        <text
          x={C}
          y={C + 5}
          textAnchor="middle"
          fill="#1e3454"
          fontSize="11"
          fontWeight="600"
        >
          No data
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      {/* Track */}
      <circle
        cx={C}
        cy={C}
        r={R}
        fill="none"
        stroke="#0a1422"
        strokeWidth={STROKE}
      />
      {/* Slices */}
      {slices.map((s) => (
        <circle
          key={s.key}
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke={s.color}
          strokeWidth={STROKE}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset}
          strokeLinecap="butt"
        />
      ))}
      {/* Center label */}
      <text
        x={C}
        y={C - 6}
        textAnchor="middle"
        fill="#e8f0ff"
        fontSize="20"
        fontWeight="800"
        style={{ transform: "rotate(90deg)", transformOrigin: `${C}px ${C}px` }}
      >
        {total}
      </text>
      <text
        x={C}
        y={C + 10}
        textAnchor="middle"
        fill="#2e4570"
        fontSize="9"
        fontWeight="700"
        style={{ transform: "rotate(90deg)", transformOrigin: `${C}px ${C}px` }}
      >
        TOTAL
      </text>
    </svg>
  );
}

// ─── Status row ───────────────────────────────────────────────────────────────

function StatusRow({ statusKey, count, total }) {
  const m = STATUS_META[statusKey];
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 0",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: m.dot,
          flexShrink: 0,
          boxShadow: `0 0 6px ${m.dot}88`,
        }}
      />
      <span
        style={{ fontSize: 12, color: "#8aa0c0", flex: 1, fontWeight: 500 }}
      >
        {m.label}
      </span>
      <span
        style={{
          fontSize: 11,
          color: "#1e3454",
          background: "#070c18",
          border: "1px solid #0e1d36",
          borderRadius: 5,
          padding: "1px 6px",
          fontWeight: 600,
          minWidth: 34,
          textAlign: "center",
        }}
      >
        {pct}%
      </span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: count > 0 ? m.color : "#1e3050",
          minWidth: 26,
          textAlign: "right",
        }}
      >
        {count}
      </span>
    </div>
  );
}

// ─── Country bar ──────────────────────────────────────────────────────────────

const COUNTRY_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

function CountryBar({ country, count, maxCount, idx }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span
        style={{
          fontSize: 11,
          color: "#4a6e9a",
          width: 90,
          flexShrink: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: 500,
        }}
      >
        {country}
      </span>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 99,
          background: "#0a1422",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 99,
            transition: "width .5s ease",
            boxShadow: `0 0 6px ${color}66`,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: count > 0 ? "#c9d4e8" : "#1e3050",
          minWidth: 22,
          textAlign: "right",
        }}
      >
        {count}
      </span>
    </div>
  );
}

// ─── Recent update row ────────────────────────────────────────────────────────

function fmtRelative(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function RecentRow({ item }) {
  const m =
    OVERALL_STATUS_META[item.overallStatus] ?? OVERALL_STATUS_META.not_started;
  const initials = item.studentName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 0",
        borderBottom: "1px solid #09111f",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#1a3366,#2563eb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 800,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#c9d4e8",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.studentName}
        </div>
        <div style={{ fontSize: 10.5, color: "#2e4570", marginTop: 1 }}>
          {item.country}
          {item.visaType ? ` · ${item.visaType}` : ""}
        </div>
      </div>

      {/* Status + progress + time */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: m.color,
            marginBottom: 3,
            whiteSpace: "nowrap",
          }}
        >
          {m.label}
        </div>
        {/* Mini progress bar */}
        <div
          style={{
            width: 52,
            height: 3,
            borderRadius: 99,
            background: "#0a1422",
            overflow: "hidden",
            marginBottom: 3,
            marginLeft: "auto",
          }}
        >
          <div
            style={{
              width: `${item.progressPercentage}%`,
              height: "100%",
              background: m.color,
              borderRadius: 99,
            }}
          />
        </div>
        <div style={{ fontSize: 9.5, color: "#1e3050" }}>
          {fmtRelative(item.updatedAt)}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skel({ w = "100%", h = 12 }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 6,
        background: "#0e1d36",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 14,
      }}
    >
      <Icon size={12} color="#2563eb" />
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#1e3454",
          textTransform: "uppercase",
          letterSpacing: ".12em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrgVisaTracking() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${BASE}/api/org-admin/visa-stats`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setData(d.data ?? null);
        setLastFetched(new Date());
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const sc = data?.statusCounts ?? {};
  const total = Object.values(sc).reduce((s, v) => s + (v ?? 0), 0);
  const maxCountry = Math.max(
    ...(data?.countryBreakdown ?? []).map((c) => c.count),
    1,
  );

  const successRate = data?.successRate;
  const inVisaStage = data?.totalsFromLeads?.inVisaStage ?? 0;
  const visaApplied = data?.totalsFromApps?.visaApplied ?? 0;
  const visaApproved = data?.totalsFromApps?.visaApproved ?? 0;

  return (
    <div
      style={{
        background: "#090f1e",
        border: "1px solid #0e1d36",
        borderRadius: 14,
        padding: "20px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}`}</style>

      {/* ── Card header ────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={15} color="#2563eb" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#1e3454",
              textTransform: "uppercase",
              letterSpacing: ".12em",
            }}
          >
            Visa Tracking
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Quick stats pills */}
          {!loading && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 99,
                  background: "#0d1f3c",
                  color: "#60a5fa",
                  border: "1px solid #1a2f52",
                  whiteSpace: "nowrap",
                }}
              >
                {inVisaStage} in visa stage
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 99,
                  background: "#071a0e",
                  color: "#4ade80",
                  border: "1px solid #0e3020",
                  whiteSpace: "nowrap",
                }}
              >
                {visaApproved} approved
              </span>
              {successRate !== null && (
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 99,
                    background: "#1c0e00",
                    color: "#f59e0b",
                    border: "1px solid #2e1a00",
                    whiteSpace: "nowrap",
                  }}
                >
                  {successRate}% success
                </span>
              )}
            </div>
          )}

          {/* Refresh */}
          <button
            onClick={load}
            disabled={loading}
            title={
              lastFetched
                ? `Last updated ${fmtRelative(lastFetched)}`
                : "Refresh"
            }
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#070c18",
              border: "1px solid #0f1c31",
              color: "#2e4570",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.5 : 1,
              transition: "all .15s",
              flexShrink: 0,
            }}
          >
            <RefreshCw
              size={12}
              style={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* ── Three-column grid ────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
        className="visa-grid"
      >
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (max-width: 900px) {
            .visa-grid { grid-template-columns: 1fr 1fr !important; }
            .visa-donut-col { grid-column: 1 / -1; display: flex; align-items: center; gap: 20px; }
          }
          @media (max-width: 560px) {
            .visa-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* ── Left: Donut + status rows ─────────────────────────────────────── */}
        <div className="visa-donut-col">
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                paddingBottom: 8,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "#0a1422",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Donut statusCounts={sc} total={total} />
            </div>
          )}

          <div>
            {loading ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[120, 100, 110, 80, 90].map((w, i) => (
                  <Skel key={i} w={w} />
                ))}
              </div>
            ) : (
              Object.keys(STATUS_META).map((k) => (
                <StatusRow
                  key={k}
                  statusKey={k}
                  count={sc[k] ?? 0}
                  total={total}
                />
              ))
            )}

            {!loading && successRate !== null && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid #0a1422",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 11, color: "#2e4570" }}>
                  Success Rate
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color:
                      successRate >= 70
                        ? "#4ade80"
                        : successRate >= 40
                          ? "#fbbf24"
                          : "#f87171",
                  }}
                >
                  {successRate}%
                </span>
              </div>
            )}

            {!loading && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "#070c18",
                  border: "1px solid #0f1c31",
                  borderRadius: 9,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span style={{ fontSize: 10.5, color: "#2e4570" }}>
                    Applied
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa" }}
                  >
                    {visaApplied}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: 10.5, color: "#2e4570" }}>
                    Approved
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#4ade80" }}
                  >
                    {visaApproved}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Mid: Country breakdown ────────────────────────────────────────── */}
        <div>
          <SectionLabel icon={Globe}>By Country</SectionLabel>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[80, 65, 90, 55, 70, 45].map((w, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <Skel w={80} h={10} />
                  <Skel w={`${w}%`} h={5} />
                  <Skel w={20} h={10} />
                </div>
              ))}
            </div>
          ) : data?.countryBreakdown?.length === 0 ? (
            <div
              style={{
                fontSize: 12,
                color: "#1e3454",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              No visa data yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(data?.countryBreakdown ?? []).map((c, i) => (
                <CountryBar
                  key={c.country}
                  country={c.country}
                  count={c.count}
                  maxCount={maxCountry}
                  idx={i}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Recent updates ─────────────────────────────────────────── */}
        <div>
          <SectionLabel icon={Clock}>Recent Updates</SectionLabel>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "#0e1d36",
                      animation: "pulse 1.5s ease-in-out infinite",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <Skel w="70%" />
                    <Skel w="45%" h={10} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      alignItems: "flex-end",
                    }}
                  >
                    <Skel w={52} h={10} />
                    <Skel w={52} h={3} />
                  </div>
                </div>
              ))}
            </div>
          ) : (data?.recentUpdates ?? []).length === 0 ? (
            <div
              style={{
                fontSize: 12,
                color: "#1e3454",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              No visa records yet
            </div>
          ) : (
            <div>
              {(data?.recentUpdates ?? []).map((item, i) => (
                <RecentRow key={item._id ?? i} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
