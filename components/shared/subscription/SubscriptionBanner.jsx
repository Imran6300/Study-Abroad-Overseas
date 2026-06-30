"use client";

/**
 * components/shared/subscription/SubscriptionBanner.jsx
 *
 * Contextual warning banner rendered at the top of both dashboard layouts.
 * Shows different content based on PartnerSubscription.status:
 *
 *   trial (≤7 days left)  — amber countdown, link to settings
 *   trial (>7 days left)  — hidden (no clutter during healthy trial)
 *   partner               — hidden (everything is fine)
 *   paid_monthly          — hidden (everything is fine)
 *   quarterly_due         — red/amber settlement warning with Pay Now CTA
 *   suspended             — red blocked banner (backup to middleware)
 *   need_selection        — hidden (PlanSelectionModal handles this)
 *
 * Unlike PlanSelectionModal this banner IS dismissible for low-urgency states,
 * but re-appears on next page load since it reads live Redux state.
 *
 * Uses the same dark glass aesthetic as the org-admin dashboard.
 * Works identically in counselor-dashboard and org-admin contexts.
 */

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  AlertCircle,
  CreditCard,
  X,
  Loader2,
  ChevronRight,
  Ban,
} from "lucide-react";

import {
  selectPartnerSubscription,
  selectCurrentQuarter,
  selectPlanConfig,
  selectActionLoading,
  selectActionError,
  createSettlementOrder,
  verifySettlementPayment,
  clearActionState,
} from "@/store/partnerSubscriptionSlice";

// ── Cashfree SDK loader (shared utility) ──────────────────────────────────────
function loadCashfreeSDK(environment) {
  return new Promise((resolve) => {
    if (window.Cashfree) return resolve(window.Cashfree);
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.onload = () => resolve(window.Cashfree);
    s.onerror = () => resolve(null);
    document.body.appendChild(s);
  });
}

function formatRupees(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Variant configs ────────────────────────────────────────────────────────────
// Maps each relevant state to visual and copy tokens
function getBannerConfig(sub, qt, planConfig) {
  const status = sub?.status;
  const now = new Date();

  if (status === "trial") {
    const trialEndsAt = new Date(sub.trialEndsAt);
    const msLeft = trialEndsAt - now;
    const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000));
    if (daysLeft > 7) return null; // silent — too much time left to bother
    return {
      variant: daysLeft <= 3 ? "urgent" : "warning",
      icon: Clock,
      title: `Trial ending in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
      message: `Your free trial expires on ${formatDate(sub.trialEndsAt)}. Select a plan now to avoid interruption.`,
      ctaLabel: "Choose a Plan",
      ctaAction: "navigate_settings",
      dismissible: true,
    };
  }

  if (status === "quarterly_due") {
    const deadline = sub.settlementDeadline
      ? new Date(sub.settlementDeadline)
      : null;
    const daysLeft = deadline
      ? Math.max(0, Math.ceil((deadline - now) / 86400000))
      : null;
    const isUrgent = daysLeft !== null && daysLeft <= 3;

    return {
      variant: isUrgent ? "critical" : "warning",
      icon: AlertTriangle,
      title: `Quarterly target missed — settlement due`,
      message:
        `You processed ${qt?.successfulCount ?? 0} of ${sub.quarterlyTarget ?? planConfig?.quarterlyTarget ?? 0} required students last quarter. ` +
        `A settlement fee of ${formatRupees(sub.settlementDue)} is due${
          daysLeft !== null
            ? ` in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
            : ""
        } (${formatDate(sub.settlementDeadline)}).`,
      ctaLabel: `Pay ${formatRupees(sub.settlementDue)} Settlement`,
      ctaAction: "pay_settlement",
      dismissible: false,
    };
  }

  if (status === "suspended" || status === "settlement_expired") {
    return {
      variant: "blocked",
      icon: Ban,
      title: "Account suspended",
      message:
        "Your CRM access has been suspended due to an unpaid settlement fee. Contact the Khizar Overseas team to reactivate your account.",
      ctaLabel: "Contact Support",
      ctaAction: "contact_support",
      dismissible: false,
    };
  }

  return null; // no banner needed
}

// ── Variant styles ─────────────────────────────────────────────────────────────
const VARIANT_STYLES = {
  warning: {
    bg: "bg-amber-500/10 border-amber-500/25",
    iconColor: "text-amber-400",
    titleColor: "text-amber-300",
    textColor: "text-amber-200/70",
    ctaClass: "bg-amber-500 hover:bg-amber-400 text-white",
  },
  urgent: {
    bg: "bg-orange-500/10 border-orange-500/25",
    iconColor: "text-orange-400",
    titleColor: "text-orange-300",
    textColor: "text-orange-200/70",
    ctaClass: "bg-orange-500 hover:bg-orange-400 text-white",
  },
  critical: {
    bg: "bg-red-500/10 border-red-500/25",
    iconColor: "text-red-400",
    titleColor: "text-red-300",
    textColor: "text-red-200/70",
    ctaClass: "bg-red-600 hover:bg-red-500 text-white",
  },
  blocked: {
    bg: "bg-red-900/20 border-red-700/40",
    iconColor: "text-red-500",
    titleColor: "text-red-300",
    textColor: "text-red-200/60",
    ctaClass: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
  },
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function SubscriptionBanner({ dashboardPath = "" }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const sub = useSelector(selectPartnerSubscription);
  const qt = useSelector(selectCurrentQuarter);
  const planConfig = useSelector(selectPlanConfig);
  const actionLoading = useSelector(selectActionLoading);

  const [dismissed, setDismissed] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const config = getBannerConfig(sub, qt, planConfig);

  // ── Settlement payment flow ────────────────────────────────────────────────
  const handlePaySettlement = useCallback(async () => {
    setPaymentLoading(true);
    setLocalError(null);
    dispatch(clearActionState());

    try {
      const orderData = await dispatch(createSettlementOrder()).unwrap();

      const CashfreeSDK = await loadCashfreeSDK(orderData.environment);
      if (!CashfreeSDK) throw new Error("Payment SDK failed to load.");

      const cashfree = CashfreeSDK({
        mode: orderData.environment === "PRODUCTION" ? "production" : "sandbox",
      });

      const result = await cashfree.checkout({
        paymentSessionId: orderData.paymentSessionId,
        returnUrl: `${window.location.origin}${window.location.pathname}?settlement=success&orderId=${orderData.orderId}`,
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      if (result.paymentDetails) {
        await dispatch(verifySettlementPayment(orderData.orderId)).unwrap();
        // Banner will auto-hide once status refreshes to "partner"
      }
    } catch (err) {
      setLocalError(err.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  }, [dispatch]);

  // ── CTA handler ───────────────────────────────────────────────────────────
  const handleCta = useCallback(() => {
    if (!config) return;
    switch (config.ctaAction) {
      case "navigate_settings":
        router.push(
          dashboardPath
            ? `${dashboardPath}/settings`
            : "/dashboard/counselor-dashboard/settings",
        );
        break;
      case "pay_settlement":
        handlePaySettlement();
        break;
      case "contact_support":
        window.open("mailto:support@khizaroverseas.in", "_blank");
        break;
      default:
        break;
    }
  }, [config, router, dashboardPath, handlePaySettlement]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (!sub || !config) return null;
  if (dismissed && config.dismissible) return null;

  const styles = VARIANT_STYLES[config.variant] || VARIANT_STYLES.warning;
  const Icon = config.icon;
  const isLoading = paymentLoading || actionLoading;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="px-4 sm:px-6 pt-3"
      >
        <div className={`border rounded-2xl px-4 py-3.5 ${styles.bg}`}>
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <Icon size={16} className={styles.iconColor} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${styles.titleColor}`}>
                    {config.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${styles.textColor}`}
                  >
                    {config.message}
                  </p>

                  {/* Local error from payment attempt */}
                  {localError && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} />
                      {localError}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleCta}
                    disabled={isLoading}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      ${styles.ctaClass}
                    `}
                  >
                    {isLoading ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <CreditCard size={11} />
                    )}
                    {isLoading ? "Processing…" : config.ctaLabel}
                  </button>

                  {config.dismissible && (
                    <button
                      onClick={() => setDismissed(true)}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${styles.iconColor}`}
                      title="Dismiss"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
