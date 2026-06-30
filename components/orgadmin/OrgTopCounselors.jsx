"use client";

/**
 * components/orgadmin/OrgTopCounselors.jsx
 *
 * Top-performing counselors within this org, ranked by enrolled count.
 * Fetches from GET /api/org-admin/top-counselors (org-scoped, no super_admin
 * endpoint contamination).
 *
 * Shows: avatar, name, enrolled count, total leads, conversion rate bar.
 * "View all" link routes to the counselors management page.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3020";

// ─── Rank medal colours ───────────────────────────────────────────────────────
const RANK_STYLES = [
  { ring: "#f59e0b", dot: "#fbbf24", label: "#f59e0b" }, // gold
  { ring: "#94a3b8", dot: "#cbd5e1", label: "#94a3b8" }, // silver
  { ring: "#b45309", dot: "#d97706", label: "#cd7c3e" }, // bronze
];

function getRankStyle(i) {
  return (
    RANK_STYLES[i] ?? { ring: "#1a2f52", dot: "#2563eb", label: "#4a6e9a" }
  );
}

// ─── Conversion bar ───────────────────────────────────────────────────────────
function ConversionBar({ rate }) {
  const pct = Math.min(Math.max(rate ?? 0, 0), 100);
  const color = pct >= 50 ? "#10b981" : pct >= 25 ? "#f59e0b" : "#6a8ab0";

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}
    >
      <div
        style={{
          flex: 1,
          height: 3,
          borderRadius: 99,
          background: "#0e1d36",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 99,
            transition: "width .6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 10,
          color,
          fontWeight: 700,
          minWidth: 34,
          textAlign: "right",
        }}
      >
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 0",
        borderBottom: "1px solid #09111f",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#0e1d36",
          animation: "pulse 1.5s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 12,
            width: "55%",
            borderRadius: 5,
            background: "#0e1d36",
            marginBottom: 6,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 3,
            width: "80%",
            borderRadius: 99,
            background: "#0a1525",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
      <div
        style={{
          height: 24,
          width: 52,
          borderRadius: 7,
          background: "#0e1d36",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrgTopCounselors() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/org-admin/top-counselors`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCounselors(d.data ?? []))
      .catch(() => setCounselors([]))
      .finally(() => setLoading(false));
  }, []);

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

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Trophy size={14} color="#f59e0b" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#1e3454",
              textTransform: "uppercase",
              letterSpacing: ".12em",
            }}
          >
            Top Counselors
          </span>
        </div>
        <Link
          href="/dashboard/org-admin/counselors"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11.5,
            color: "#2563eb",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Body */}
      {loading ? (
        <div>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : counselors.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: "#1e3454",
          }}
        >
          <Trophy size={28} style={{ margin: "0 auto 10px", opacity: 0.25 }} />
          <div style={{ fontSize: 13 }}>No counselor data yet</div>
          <div style={{ fontSize: 11.5, marginTop: 4, color: "#142035" }}>
            Performance stats update nightly.
          </div>
        </div>
      ) : (
        <div>
          {counselors.map((c, i) => {
            const rank = getRankStyle(i);
            const initials = (c.name ?? "?")
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={c._id ?? i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 0",
                  borderBottom:
                    i < counselors.length - 1 ? "1px solid #09111f" : "none",
                }}
              >
                {/* Avatar with rank ring */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#1a3366,#2563eb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      boxShadow: `0 0 0 2px #090f1e, 0 0 0 3.5px ${rank.ring}`,
                    }}
                  >
                    {initials}
                  </div>
                  {/* Rank number badge for top 3 */}
                  {i < 3 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -3,
                        right: -3,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: rank.dot,
                        border: "1.5px solid #090f1e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                        fontWeight: 900,
                        color: "#fff",
                      }}
                    >
                      {i + 1}
                    </div>
                  )}
                </div>

                {/* Name + conversion bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#c9d4e8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name ?? "—"}
                  </div>
                  <ConversionBar rate={c.conversionRate} />
                </div>

                {/* Stats */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#e8f0ff",
                      lineHeight: 1.2,
                    }}
                  >
                    {c.enrolled ?? 0}
                  </div>
                  <div
                    style={{ fontSize: 10, color: "#2e4570", fontWeight: 600 }}
                  >
                    enrolled
                  </div>
                  <div style={{ fontSize: 10, color: "#1e3050", marginTop: 2 }}>
                    {c.totalAssigned ?? 0} leads
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
