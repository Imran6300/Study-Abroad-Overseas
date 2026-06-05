"use client";

import { useEffect, useState } from "react";

// ── icon map ────────────────────────────────────────────────────────────────
const ACTIVITY_ICONS = {
  application: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  ),

  visa: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
    </svg>
  ),

  deadline: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3" />
    </svg>
  ),

  note: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10" />
    </svg>
  ),
};

const getActionCategory = (action = "") => {
  if (action.startsWith("application")) return "application";
  if (action.startsWith("visa")) return "visa";
  if (action.startsWith("deadline")) return "deadline";
  if (action.startsWith("note")) return "note";
  return "application";
};

// ── colour map ───────────────────────────────────────────────────────────────
const ACTIVITY_COLORS = {
  application: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/40",
    icon: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  visa: {
    bg: "bg-purple-500/20",
    border: "border-purple-500/40",
    icon: "text-purple-400",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  deadline: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/40",
    icon: "text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  note: {
    bg: "bg-teal-500/20",
    border: "border-teal-500/40",
    icon: "text-teal-400",
    badge: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  },
};

const DEFAULT_COLOR = {
  bg: "bg-white/10",
  border: "border-white/20",
  icon: "text-gray-400",
  badge: "bg-white/10 text-gray-300 border-white/20",
};

// ── helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "application", label: "Applications" },
  { key: "visa", label: "Visa" },
  { key: "deadline", label: "Deadlines" },
  { key: "note", label: "Notes" },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function ApplicationActivityFeed({
  activities: propActivities,
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (propActivities) {
      setActivities(propActivities);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/activity/my`,
          { credentials: "include" },
        );
        const data = await res.json();
        if (data.success) {
          setActivities(data.logs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [propActivities]);

  const filtered =
    activeFilter === "all"
      ? activities
      : activities.filter((a) => a.action?.startsWith(activeFilter));

  const visible = showAll ? filtered : filtered.slice(0, 5);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-6">
        <div className="h-5 w-48 rounded bg-white/10 animate-pulse mb-6" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 mb-5">
            <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-white/10 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4169E1] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4169E1]" />
          </span>
          <h2 className="text-white font-semibold text-lg tracking-tight">
            Application Activity
          </h2>
          {activities.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#4169E1]/20 text-[#4169E1] border border-[#4169E1]/30">
              {activities.length} events
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 text-right sm:text-left">
          by your counselor
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 sm:px-6 pt-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setActiveFilter(f.key);
              setShowAll(false);
            }}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap ${
              activeFilter === f.key
                ? "bg-[#4169E1]/30 text-blue-300 border-[#4169E1]/50"
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="px-4 sm:px-6 py-4">
        {visible.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">
              No activity yet in this category.
            </p>
          </div>
        ) : (
          <ol className="relative">
            {visible.map((activity, idx) => {
              const category = getActionCategory(activity.action);
              const colors = ACTIVITY_COLORS[category] || DEFAULT_COLOR;
              const icon = ACTIVITY_ICONS[category];
              const isLast = idx === visible.length - 1;
              const isExpanded = expanded === activity._id;

              return (
                <li
                  key={activity._id}
                  className={`relative pl-9 sm:pl-10 ${isLast ? "pb-0" : "pb-6"}`}
                >
                  {/* vertical line */}
                  {!isLast && (
                    <div className="absolute left-[17px] top-8 bottom-0 w-px bg-white/10" />
                  )}

                  {/* icon circle */}
                  <div
                    className={`absolute left-0 top-0 w-9 h-9 rounded-full border ${colors.bg} ${colors.border} flex items-center justify-center ${colors.icon} shrink-0`}
                  >
                    {icon}
                  </div>

                  {/* card */}
                  <div
                    className={`rounded-xl border bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-200 cursor-pointer overflow-hidden ${
                      isExpanded ? "border-white/20" : "border-white/10"
                    }`}
                    onClick={() =>
                      setExpanded(isExpanded ? null : activity._id)
                    }
                  >
                    <div className="px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-3">
                      {/* Left Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors.badge} whitespace-nowrap`}
                          >
                            {activity.action
                              ?.replace(".", " ")
                              ?.replace("_", " ")
                              ?.toUpperCase()}
                          </span>
                          {activity.university && (
                            <span className="text-xs text-gray-500 truncate max-w-[180px] sm:max-w-[220px]">
                              {activity.university}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-200 font-medium leading-snug break-words">
                          {activity.message}
                        </p>
                      </div>

                      {/* Right: Time + Chevron */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 shrink-0">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {timeAgo(activity.createdAt)}
                        </span>
                        <svg
                          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="px-3 sm:px-4 pb-4 border-t border-white/10 pt-3">
                        {activity.entity?.label && (
                          <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                            Affected: {activity.entity?.label}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                          {activity.actor?.name && (
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              {activity.actor?.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {new Date(activity.createdAt).toLocaleString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {/* Show More / Less */}
        {filtered.length > 5 && (
          <button
            onClick={() => setShowAll((p) => !p)}
            className="mt-4 w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-400 hover:text-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {showAll ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Show {filtered.length - 5} More
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
