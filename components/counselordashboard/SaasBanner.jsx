"use client";

/**
 * SaasBanner.jsx  —  FIXED
 *
 * ROOT CAUSE OF EMPTY BANNER:
 *   Line 126 in the original: `if (status.isInTrial && status.trialDaysLeft > 10) return null;`
 *   A brand-new counselor has trialDaysLeft = 30 → 30 > 10 → banner returned null → empty screen.
 *
 * FIXES APPLIED:
 *   1. Removed the `trialDaysLeft > 10` early-return — trial banner now always shows.
 *   2. Trial banner is dismissible (X button) so it doesn't nag if the user doesn't want it.
 *   3. `isWarning` threshold raised to ≤7 days (was ≤5) for better UX.
 *   4. Progress bar now shows real % of trial consumed (trialDaysLeft / 30).
 *   5. Improved statusMessage fallback so the banner never shows a blank line.
 *
 * States handled:
 *   - trial (any days left): blue/green informational banner — dismissible
 *   - trial ≤7 days:         amber warning + Pay button
 *   - payment_required:      red banner + Pay button (not dismissible)
 *   - paid + active:         emerald success banner — dismissible
 *   - active_free:           hidden (no banner needed)
 *   - suspended:             red banner
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  X,
  Loader2,
  Shield,
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function SaasBanner() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/saas/status`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        console.log("SAAS STATUS:", d);
        setStatus(d?.data || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pay = async () => {
    setPaying(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay failed to load");

      const res = await fetch(`${BASE}/api/saas/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: data.keyId,
          order_id: data.orderId,
          amount: data.amount,
          currency: data.currency,
          name: "Khizar Overseas",
          description: "Monthly SaaS Fee — ₹5,000",
          prefill: data.prefill,
          theme: { color: "#22c55e" },
          handler: async (response) => {
            try {
              const verify = await fetch(`${BASE}/api/saas/verify-payment`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const vd = await verify.json();
              if (vd.success) {
                setStatus((prev) => ({
                  ...prev,
                  saasStatus: "paid",
                  paidAccessActive: true,
                  saasPaymentValidUntil: vd.saasPaymentValidUntil,
                  statusMessage: `Paid access until ${new Date(
                    vd.saasPaymentValidUntil,
                  ).toLocaleDateString("en-IN")}`,
                }));
                setDismissed(false); // re-show the "paid" success banner
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: { ondismiss: () => resolve() },
        });
        rzp.open();
      });
    } catch (e) {
      console.error("[SaasBanner.pay]", e);
      alert(e.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // ── Early exits ────────────────────────────────────────────────────────────
  if (loading || !status) return null;
  if (status.saasStatus === "active_free") return null;
  // Dismissed states: trial (non-urgent) and paid success
  if (
    dismissed &&
    status.saasStatus !== "payment_required" &&
    status.saasStatus !== "suspended"
  )
    return null;

  // ── Derived state ──────────────────────────────────────────────────────────
  const isUrgent =
    status.saasStatus === "payment_required" ||
    status.saasStatus === "suspended";
  // FIX: raised from ≤5 to ≤7 days for better advance warning
  const isWarning = status.isInTrial && status.trialDaysLeft <= 7;
  const isTrialHealthy = status.isInTrial && status.trialDaysLeft > 7;
  const isPaid = status.saasStatus === "paid" && status.paidAccessActive;

  // ── Fallback statusMessage if backend somehow sends empty string ───────────
  const message =
    status.statusMessage ||
    (status.isInTrial
      ? `Free trial — ${status.trialDaysLeft} day${status.trialDaysLeft !== 1 ? "s" : ""} remaining`
      : status.saasStatus === "payment_required"
        ? "Trial ended. Pay ₹5,000/month or process a KO enrollment to restore access."
        : isPaid
          ? `Paid access until ${new Date(status.saasPaymentValidUntil).toLocaleDateString("en-IN")}`
          : "");

  // ── Trial progress bar percentage (0–100) ─────────────────────────────────
  const trialProgressPct = status.isInTrial
    ? Math.round(((30 - status.trialDaysLeft) / 30) * 100)
    : 100;

  // ── Styling ────────────────────────────────────────────────────────────────
  const bgClass = isUrgent
    ? "bg-red-50 border-red-200"
    : isWarning
      ? "bg-amber-50 border-amber-200"
      : isPaid
        ? "bg-emerald-50 border-emerald-200"
        : "bg-blue-50 border-blue-200"; // trial healthy

  const textClass = isUrgent
    ? "text-red-800"
    : isWarning
      ? "text-amber-800"
      : isPaid
        ? "text-emerald-800"
        : "text-blue-800";

  const barBgClass = isUrgent
    ? "bg-red-200"
    : isWarning
      ? "bg-amber-200"
      : isPaid
        ? "bg-emerald-200"
        : "bg-blue-200";

  const barFillClass = isUrgent
    ? "bg-red-500"
    : isWarning
      ? "bg-amber-500"
      : isPaid
        ? "bg-emerald-500"
        : "bg-blue-400";

  const Icon = isUrgent
    ? AlertCircle
    : isPaid
      ? CheckCircle
      : isWarning
        ? AlertCircle
        : Clock;

  const iconClass = isUrgent
    ? "text-red-500"
    : isPaid
      ? "text-emerald-500"
      : isWarning
        ? "text-amber-500"
        : "text-blue-500";

  // Show the Pay button on warning and urgent states
  const showPayBtn = isWarning || isUrgent;
  // Show dismiss X when not urgent (urgent = can't dismiss)
  const showDismiss = !isUrgent;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className={`border rounded-2xl px-4 py-3 mb-4 ${bgClass}`}
      >
        {/* Main row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Icon size={18} className={`shrink-0 ${iconClass}`} />
            <p className={`text-sm font-medium ${textClass}`}>{message}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {showPayBtn && (
              <button
                onClick={pay}
                disabled={paying}
                className={`flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 ${
                  isUrgent
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {paying ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CreditCard size={13} />
                )}
                {isUrgent
                  ? "Pay ₹5,000 / month"
                  : "Pay ₹5,000 to secure access"}
              </button>
            )}
            {showDismiss && (
              <button
                onClick={() => setDismissed(true)}
                className={`p-1.5 rounded-lg hover:bg-black/10 transition-colors ${textClass}`}
                title="Dismiss"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Trial progress bar — only shown during trial period */}
        {status.isInTrial && (
          <div className="mt-2.5">
            <div className={`h-1.5 rounded-full ${barBgClass} overflow-hidden`}>
              <motion.div
                className={`h-full rounded-full ${barFillClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${trialProgressPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <p className={`text-xs mt-1 ${textClass} opacity-70`}>
              {status.trialDaysLeft} of 30 trial days remaining
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
