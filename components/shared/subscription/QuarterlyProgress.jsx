"use client";

/**
 * components/shared/subscription/QuarterlyProgress.jsx
 *
 * Compact quarterly target progress widget for partner-plan entities.
 * Intended for embedding in the dashboard overview page or settings page.
 *
 * Shows:
 *   - Current quarter label (Q2 2026)
 *   - Successful students vs target (e.g. 2 / 3)
 *   - Animated progress bar
 *   - Days remaining in the quarter
 *   - Settlement info if in quarterly_due state
 *
 * Hidden if:
 *   - No subscription data loaded
 *   - Plan is paid_monthly (no target)
 *   - Status is trial or need_selection
 *
 * Usage:
 *   import QuarterlyProgress from "@/components/shared/subscription/QuarterlyProgress";
 *   <QuarterlyProgress />
 */

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import {
  selectPartnerSubscription,
  selectCurrentQuarter,
} from "@/store/partnerSubscriptionSlice";

function formatRupees(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function QuarterlyProgress({ compact = false }) {
  const sub = useSelector(selectPartnerSubscription);
  const qt = useSelector(selectCurrentQuarter);

  // Only show for partner plan entities with active quarterly tracking
  if (!sub || !qt) return null;
  if (sub.planType !== "partner") return null;
  if (!["partner", "quarterly_due"].includes(sub.status)) return null;

  const {
    successfulCount = 0,
    target = 3,
    quarterLabel,
    daysRemainingInQuarter,
  } = qt;

  // Compute progress
  const progressPct = Math.min(
    100,
    Math.round((successfulCount / target) * 100),
  );
  const remaining = Math.max(0, target - successfulCount);
  const isTargetMet = successfulCount >= target;
  const isSettlement = sub.status === "quarterly_due";

  // Colour palette
  const barColor = isTargetMet
    ? "bg-emerald-500"
    : isSettlement
      ? "bg-red-500"
      : progressPct >= 60
        ? "bg-blue-500"
        : "bg-amber-500";

  const textAccent = isTargetMet
    ? "text-emerald-400"
    : isSettlement
      ? "text-red-400"
      : "text-blue-400";

  if (compact) {
    // ── Compact variant: single line with progress bar ───────────────────────
    return (
      <div className="flex items-center gap-3">
        <Target size={13} className={textAccent} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/50 text-xs">{quarterLabel} target</span>
            <span className={`text-xs font-bold ${textAccent}`}>
              {successfulCount}/{target}
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Full variant ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#090f1e] border border-white/[0.08] rounded-2xl p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl ${isTargetMet ? "bg-emerald-500/15" : "bg-blue-500/15"}`}
          >
            <Target size={15} className={textAccent} />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">
              {quarterLabel} Progress
            </p>
            <p className="text-white/40 text-xs">Performance Partnership</p>
          </div>
        </div>

        {isTargetMet ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 rounded-xl">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold">
              Target met
            </span>
          </div>
        ) : isSettlement ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/15 rounded-xl">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-red-400 text-xs font-semibold">
              Settlement due
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-xl">
            <Clock size={12} className="text-white/40" />
            <span className="text-white/50 text-xs">
              {daysRemainingInQuarter ?? "–"} days left
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-end justify-between mb-1.5">
          <span className="text-white/40 text-xs">Students enrolled</span>
          <span className={`text-sm font-bold ${textAccent}`}>
            {successfulCount}
            <span className="text-white/30 font-normal">/{target}</span>
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-white/30 text-xs">
            {progressPct}% of target
          </span>
          {!isTargetMet && !isSettlement && (
            <span className="text-white/30 text-xs">
              {remaining} more student{remaining !== 1 ? "s" : ""} needed
            </span>
          )}
        </div>
      </div>

      {/* Settlement info */}
      {isSettlement && sub.settlementDue && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle
              size={13}
              className="text-red-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-red-300 text-xs font-semibold">
                Settlement fee: {formatRupees(sub.settlementDue)}
              </p>
              <p className="text-red-300/60 text-xs mt-0.5">
                Due by {formatDate(sub.settlementDeadline)} to maintain CRM
                access.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {isTargetMet && (
        <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-300 text-xs">
              🎉 Target achieved! Your CRM is free for the next quarter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
