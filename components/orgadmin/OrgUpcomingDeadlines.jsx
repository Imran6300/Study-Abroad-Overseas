"use client";

/**
 * components/orgadmin/OrgUpcomingDeadlines.jsx
 *
 * Real upcoming + overdue deadlines across ALL counselors in this org.
 * Fetches from GET /api/org-admin/upcoming-deadlines?days=14
 *
 * Two tabs: Upcoming | Overdue
 * Shows: title, student name, counselor name, due date, priority badge, days left chip.
 */

import { useEffect, useState } from "react";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3020";

// ─── Priority badge ───────────────────────────────────────────────────────────

const PRIORITY_META = {
  urgent: { label: "Urgent", bg: "#3b0000", color: "#f87171", dot: "#ef4444" },
  high: { label: "High", bg: "#2d1200", color: "#fb923c", dot: "#f97316" },
  medium: { label: "Medium", bg: "#1c1600", color: "#fbbf24", dot: "#f59e0b" },
  low: { label: "Low", bg: "#071a0e", color: "#4ade80", dot: "#22c55e" },
};

function PriorityBadge({ priority }) {
  const m = PRIORITY_META[priority] ?? PRIORITY_META.medium;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 700,
        background: m.bg,
        color: m.color,
        letterSpacing: ".04em",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: m.dot,
          flexShrink: 0,
        }}
      />
      {m.label}
    </span>
  );
}

// ─── Category icon map ────────────────────────────────────────────────────────

const CATEGORY_EMOJI = {
  visa: "🛂",
  application: "📋",
  payment: "💳",
  document: "📄",
  interview: "🎙️",
  scholarship: "🏅",
  sop: "✍️",
  lor: "📝",
  test: "📐",
  financial: "💰",
  university: "🎓",
  other: "📌",
};

// ─── Days-left chip ───────────────────────────────────────────────────────────

function DaysChip({ daysLeft, isOverdue }) {
  if (isOverdue) {
    const n = Math.abs(daysLeft);
    return (
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#f87171",
          background: "#2d0a0a",
          borderRadius: 6,
          padding: "2px 7px",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {n}d overdue
      </span>
    );
  }

  const color =
    daysLeft <= 1
      ? { fg: "#f87171", bg: "#2d0a0a" }
      : daysLeft <= 3
        ? { fg: "#fb923c", bg: "#2d1200" }
        : daysLeft <= 7
          ? { fg: "#fbbf24", bg: "#1c1600" }
          : { fg: "#4ade80", bg: "#071a0e" };

  const label =
    daysLeft === 0
      ? "Today"
      : daysLeft === 1
        ? "Tomorrow"
        : `${daysLeft}d left`;

  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: color.fg,
        background: color.bg,
        borderRadius: 6,
        padding: "2px 7px",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ─── Single deadline row ──────────────────────────────────────────────────────

function DeadlineRow({ item, isOverdue }) {
  const emoji = CATEGORY_EMOJI[item.category] ?? "📌";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 11,
        padding: "11px 0",
        borderBottom: "1px solid #09111f",
      }}
    >
      {/* Category emoji circle */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: isOverdue ? "#2d0a0a" : "#0a1322",
          border: `1px solid ${isOverdue ? "#3b1010" : "#0e1d36"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: "#c9d4e8",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 3,
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#2e4570",
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#3d5a7e" }}>{item.studentName}</span>
          <span style={{ color: "#142035" }}>·</span>
          <span>{item.counselorName}</span>
        </div>
      </div>

      {/* Right: days chip + priority */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <DaysChip daysLeft={item.daysLeft} isOverdue={isOverdue} />
        <PriorityBadge priority={item.priority} />
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      style={{
        display: "flex",
        gap: 11,
        padding: "11px 0",
        borderBottom: "1px solid #09111f",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "#0e1d36",
          flexShrink: 0,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 12,
            width: "65%",
            borderRadius: 5,
            background: "#0e1d36",
            marginBottom: 7,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 10,
            width: "40%",
            borderRadius: 5,
            background: "#0a1525",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
      <div
        style={{
          height: 20,
          width: 54,
          borderRadius: 6,
          background: "#0e1d36",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────

function Tab({ label, count, active, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 7,
        fontSize: 11.5,
        fontWeight: 700,
        cursor: "pointer",
        border: "none",
        background: active ? (danger ? "#2d0a0a" : "#0f1c31") : "transparent",
        color: active ? (danger ? "#f87171" : "#c9d4e8") : "#2e4570",
        display: "flex",
        alignItems: "center",
        gap: 5,
        transition: "all .15s",
        fontFamily: "inherit",
      }}
    >
      {label}
      {count > 0 && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            padding: "1px 5px",
            borderRadius: 99,
            background: active ? (danger ? "#f87171" : "#2563eb") : "#0e1d36",
            color: active ? "#fff" : "#2e4570",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrgUpcomingDeadlines() {
  const [data, setData] = useState({ upcoming: [], overdue: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming"); // "upcoming" | "overdue"
  const [days, setDays] = useState(14);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE}/api/org-admin/upcoming-deadlines?days=${days}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setData(d.data ?? { upcoming: [], overdue: [] }))
      .catch(() => setData({ upcoming: [], overdue: [] }))
      .finally(() => setLoading(false));
  }, [days]);

  const list = tab === "upcoming" ? data.upcoming : data.overdue;
  const isEmpty = !loading && list.length === 0;

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
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={14} color="#2563eb" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#1e3454",
              textTransform: "uppercase",
              letterSpacing: ".12em",
            }}
          >
            Deadlines
          </span>
        </div>

        {/* Window selector */}
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{
            background: "#070c18",
            border: "1px solid #0f1c31",
            borderRadius: 7,
            padding: "4px 8px",
            color: "#6a8ab0",
            fontSize: 11,
            fontFamily: "inherit",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value={7}>Next 7 days</option>
          <option value={14}>Next 14 days</option>
          <option value={30}>Next 30 days</option>
        </select>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 14,
          background: "#070c18",
          borderRadius: 9,
          padding: 3,
          border: "1px solid #0a1422",
        }}
      >
        <Tab
          label="Upcoming"
          count={data.upcoming.length}
          active={tab === "upcoming"}
          onClick={() => setTab("upcoming")}
        />
        <Tab
          label="Overdue"
          count={data.overdue.length}
          active={tab === "overdue"}
          onClick={() => setTab("overdue")}
          danger
        />
      </div>

      {/* List */}
      {loading ? (
        <div>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: "#1e3454",
          }}
        >
          {tab === "upcoming" ? (
            <>
              <CheckCircle
                size={28}
                style={{ margin: "0 auto 10px", opacity: 0.25 }}
              />
              <div style={{ fontSize: 13 }}>No upcoming deadlines</div>
              <div style={{ fontSize: 11.5, marginTop: 4, color: "#142035" }}>
                All clear for the next {days} days.
              </div>
            </>
          ) : (
            <>
              <CheckCircle
                size={28}
                style={{
                  margin: "0 auto 10px",
                  color: "#10b981",
                  opacity: 0.4,
                }}
              />
              <div style={{ fontSize: 13, color: "#4ade80" }}>
                No overdue deadlines
              </div>
              <div style={{ fontSize: 11.5, marginTop: 4, color: "#142035" }}>
                Your team is on track.
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          {list.map((item, i) => (
            <DeadlineRow
              key={item._id ?? i}
              item={item}
              isOverdue={tab === "overdue"}
            />
          ))}

          {/* Truncation note */}
          {tab === "upcoming" && data.upcoming.length === 20 && (
            <div
              style={{
                fontSize: 11,
                color: "#1e3454",
                textAlign: "center",
                paddingTop: 10,
              }}
            >
              Showing 20 most urgent — expand window to see more.
            </div>
          )}
        </div>
      )}

      {/* Overdue alert banner */}
      {!loading && data.overdue.length > 0 && tab === "upcoming" && (
        <button
          onClick={() => setTab("overdue")}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "9px 14px",
            borderRadius: 9,
            background: "#1a0808",
            border: "1px solid #3b1010",
            color: "#f87171",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            fontFamily: "inherit",
            transition: "background .15s",
          }}
        >
          <AlertTriangle size={13} />
          {data.overdue.length} overdue deadline
          {data.overdue.length !== 1 ? "s" : ""} need attention
        </button>
      )}
    </div>
  );
}
