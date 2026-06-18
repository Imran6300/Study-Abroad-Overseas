"use client";

/**
 * SaasBanner.jsx  —  CASHFREE EDITION
 *
 * Replaces Razorpay checkout with Cashfree JS SDK.
 * Cashfree Drop-in UI: load cashfree-js, call cashfree.checkout()
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
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

function loadCashfreeSDK(environment) {
  return new Promise((resolve) => {
    if (window.Cashfree) return resolve(window.Cashfree);
    const s = document.createElement("script");
    s.src =
      environment === "PRODUCTION"
        ? "https://sdk.cashfree.com/js/v3/cashfree.js"
        : "https://sdk.cashfree.com/js/v3/cashfree.js"; // same URL, mode set via init
    s.onload = () => resolve(window.Cashfree);
    s.onerror = () => resolve(null);
    document.body.appendChild(s);
  });
}

export default function SaasBanner() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchStatus = () => {
      fetch(`${BASE}/api/saas/status`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setStatus(d?.data || null))
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchStatus();
    window.addEventListener("focus", fetchStatus);
    const interval = setInterval(fetchStatus, 30 * 60 * 1000);
    return () => {
      window.removeEventListener("focus", fetchStatus);
      clearInterval(interval);
    };
  }, []);

  const pay = async () => {
    setPaying(true);
    try {
      // 1. Create order on backend
      const res = await fetch(`${BASE}/api/saas/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // 2. Load Cashfree JS SDK
      const CashfreeSDK = await loadCashfreeSDK(data.environment);
      if (!CashfreeSDK) throw new Error("Cashfree SDK failed to load");

      const cashfree = CashfreeSDK({
        mode: data.environment === "PRODUCTION" ? "production" : "sandbox",
      });

      // 3. Open Cashfree Drop-in checkout
      const checkoutOptions = {
        paymentSessionId: data.paymentSessionId,
        returnUrl: `${window.location.origin}/dashboard/counselor-dashboard/settings?payment=success&orderId=${data.orderId}`,
      };

      const result = await cashfree.checkout(checkoutOptions);

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      if (result.paymentDetails) {
        // Payment completed — verify on backend
        const verify = await fetch(`${BASE}/api/saas/verify-payment`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId }),
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
          setDismissed(false);
        }
      }
    } catch (e) {
      console.error("[SaasBanner.pay]", e);
      alert(e.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading || !status) return null;
  if (status.saasStatus === "active_free") return null;
  if (
    dismissed &&
    status.saasStatus !== "payment_required" &&
    status.saasStatus !== "suspended"
  )
    return null;

  const isUrgent =
    status.saasStatus === "payment_required" ||
    status.saasStatus === "suspended";
  const isWarning = status.isInTrial && status.trialDaysLeft <= 7;
  const isTrialHealthy = status.isInTrial && status.trialDaysLeft > 7;
  const isPaid = status.saasStatus === "paid" && status.paidAccessActive;

  const message =
    status.statusMessage ||
    (status.isInTrial
      ? `Free trial — ${status.trialDaysLeft} day${status.trialDaysLeft !== 1 ? "s" : ""} remaining`
      : status.saasStatus === "payment_required"
        ? "Trial ended. Pay ₹5,000/month or process a KO enrollment to restore access."
        : isPaid
          ? `Paid access until ${new Date(status.saasPaymentValidUntil).toLocaleDateString("en-IN")}`
          : "");

  const trialProgressPct = status.isInTrial
    ? Math.round(((30 - status.trialDaysLeft) / 30) * 100)
    : 100;

  const bgClass = isUrgent
    ? "bg-red-50 border-red-200"
    : isWarning
      ? "bg-amber-50 border-amber-200"
      : isPaid
        ? "bg-emerald-50 border-emerald-200"
        : "bg-blue-50 border-blue-200";

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

  const showPayBtn = isWarning || isUrgent;
  const showDismiss = !isUrgent;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className={`border rounded-2xl px-4 py-3 mb-4 ${bgClass}`}
      >
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
