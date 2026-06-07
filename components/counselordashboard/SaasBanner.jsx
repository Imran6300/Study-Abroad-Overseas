"use client";

/**
 * SaasBanner.jsx
 *
 * Shows at the top of the counselor dashboard.
 * - Trial: shows days remaining, green bar
 * - Trial ending (≤5 days): amber warning
 * - payment_required: red banner + Razorpay payment button
 * - active_free: invisible (no banner)
 * - paid: shows validity date, subtle banner
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
    fetch(`${BASE}/api/saas/status`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStatus(d?.data || null))
      .catch(() => {})
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
                  statusMessage: `Paid access until ${new Date(vd.saasPaymentValidUntil).toLocaleDateString("en-IN")}`,
                }));
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

  if (loading || !status) return null;
  if (status.saasStatus === "active_free") return null;
  if (status.saasStatus === "paid" && status.paidAccessActive && dismissed)
    return null;

  // Trial — only show if ≤10 days left (don't nag throughout)
  if (status.isInTrial && status.trialDaysLeft > 10) return null;

  const isUrgent = status.saasStatus === "payment_required";
  const isWarning = status.isInTrial && status.trialDaysLeft <= 5;
  const isPaid = status.saasStatus === "paid" && status.paidAccessActive;

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

  const Icon = isUrgent ? AlertCircle : isPaid ? CheckCircle : Clock;
  const iconClass = isUrgent
    ? "text-red-500"
    : isPaid
      ? "text-emerald-500"
      : isWarning
        ? "text-amber-500"
        : "text-blue-500";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className={`border rounded-2xl px-4 py-3 mb-4 flex items-center justify-between gap-4 flex-wrap ${bgClass}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon size={18} className={`shrink-0 ${iconClass}`} />
          <p className={`text-sm font-medium ${textClass}`}>
            {status.statusMessage}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isUrgent && (
            <button
              onClick={pay}
              disabled={paying}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {paying ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <CreditCard size={13} />
              )}
              Pay ₹5,000 / month
            </button>
          )}
          {isWarning && (
            <button
              onClick={pay}
              disabled={paying}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {paying ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <CreditCard size={13} />
              )}
              Pay ₹5,000 to secure access
            </button>
          )}
          {(isPaid || (status.isInTrial && !isWarning)) && (
            <button
              onClick={() => setDismissed(true)}
              className={`p-1.5 rounded-lg hover:bg-black/10 transition-colors ${textClass}`}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
