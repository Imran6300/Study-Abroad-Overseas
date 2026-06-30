"use client";

/**
 * components/shared/subscription/PlanSelectionModal.jsx
 *
 * Blocking modal displayed when PartnerSubscription.status === "need_selection"
 * or "cancelled". Cannot be dismissed — the user must select a plan to proceed.
 *
 * Two plans presented side by side:
 *   Left  — Performance Partnership (free CRM, quarterly target)
 *   Right — Monthly SaaS Subscription (fixed fee, no target)
 *
 * Cashfree payment flow (for paid_monthly):
 *   1. User clicks "Pay Monthly"
 *   2. Dispatch createMonthlyPaymentOrder → get paymentSessionId
 *   3. Load Cashfree SDK → open drop-in checkout
 *   4. On success → dispatch verifyMonthlyPayment → fetch updated status
 *
 * For partner plan:
 *   1. User clicks "Join Partnership"
 *   2. Dispatch selectPartnerPlan("partner") → modal closes on success
 *
 * Design: dark glass-morphism matching the org-admin dark theme.
 * Works identically in both counselor-dashboard and org-admin contexts.
 */

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CreditCard,
  CheckCircle,
  Loader2,
  Zap,
  Target,
  TrendingUp,
  Shield,
  AlertCircle,
  X,
} from "lucide-react";

import {
  selectPartnerSubscription,
  selectPlanConfig,
  selectActionLoading,
  selectActionError,
  selectNeedsBlockingModal,
  selectPendingOrder,
  selectPartnerPlan as selectPlanThunk,
  createMonthlyPaymentOrder,
  verifyMonthlyPayment,
  clearActionState,
} from "@/store/partnerSubscriptionSlice";

// Separate named import to avoid collision with state selector
import { selectPartnerPlan } from "@/store/partnerSubscriptionSlice";

// ── Cashfree SDK loader ────────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatRupees(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PlanCard({ plan, isSelected, onSelect, disabled }) {
  const isPartner = plan.id === "partner";

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      onClick={!disabled ? onSelect : undefined}
      className={`
        relative rounded-2xl p-6 cursor-pointer transition-all duration-200 border-2
        ${
          isSelected
            ? isPartner
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-blue-500 bg-blue-500/10"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {/* Recommended badge */}
      {isPartner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
            Recommended
          </span>
        </div>
      )}

      {/* Selection indicator */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            isSelected
              ? isPartner
                ? "border-emerald-500 bg-emerald-500"
                : "border-blue-500 bg-blue-500"
              : "border-white/30"
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-white"
            />
          )}
        </div>
        <div
          className={`p-2 rounded-xl ${
            isPartner ? "bg-emerald-500/20" : "bg-blue-500/20"
          }`}
        >
          {isPartner ? (
            <TrendingUp
              size={20}
              className={isPartner ? "text-emerald-400" : "text-blue-400"}
            />
          ) : (
            <Shield size={20} className="text-blue-400" />
          )}
        </div>
      </div>

      {/* Plan name & price */}
      <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
      <div className="mb-3">
        {plan.price === 0 ? (
          <span className="text-emerald-400 text-2xl font-black">FREE</span>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-white text-2xl font-black">
              {formatRupees(plan.price)}
            </span>
            <span className="text-white/40 text-sm">/month</span>
          </div>
        )}
      </div>

      <p className="text-white/50 text-sm mb-5 leading-relaxed">
        {plan.description}
      </p>

      {/* Features */}
      <ul className="space-y-2.5">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle
              size={14}
              className={`mt-0.5 flex-shrink-0 ${
                isPartner ? "text-emerald-400" : "text-blue-400"
              }`}
            />
            <span className="text-white/70 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PlanSelectionModal() {
  const dispatch = useDispatch();
  const sub = useSelector(selectPartnerSubscription);
  const planConfig = useSelector(selectPlanConfig);
  const actionLoading = useSelector(selectActionLoading);
  const actionError = useSelector(selectActionError);
  const needsModal = useSelector(selectNeedsBlockingModal);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const isOrgAdmin = sub?.entityType === "org_admin";

  // Build plan definitions from planConfig (live values from backend)
  const monthlyFee =
    planConfig?.monthlyFeeRupees ?? (isOrgAdmin ? 30000 : 2500);
  const quarterlyTarget = planConfig?.quarterlyTarget ?? (isOrgAdmin ? 15 : 3);
  const quarterlyPenalty =
    planConfig?.quarterlyFeeOnFailure ?? (isOrgAdmin ? 90000 : 7500);

  const plans = [
    {
      id: "partner",
      name: "Performance Partnership",
      price: 0,
      description:
        "Keep your CRM completely free by processing students through Khizar Overseas. We handle everything — docs, applications, visa tracking.",
      features: [
        `Process ${quarterlyTarget} successful students per quarter`,
        "CRM stays 100% free while target is met",
        "Khizar Overseas manages full application workflow",
        "Status updates sync to all dashboards in real time",
        "40% commission on successful enrollments",
        `If target missed: ${formatRupees(quarterlyPenalty)} quarterly fee (15-day grace period)`,
      ],
    },
    {
      id: "paid_monthly",
      name: "Monthly Subscription",
      price: monthlyFee,
      description:
        "Pay a fixed monthly fee for complete CRM freedom. No enrollment targets, no Khizar Overseas obligations. Work with any universities.",
      features: [
        "No quarterly student targets",
        "Process students through your own university partnerships",
        "Full CRM access — unlimited students and applications",
        isOrgAdmin
          ? "Includes white-label student portal"
          : "White-label add-on available for ₹999/month",
        "Cancel or switch plans anytime",
        "Priority support",
      ],
    },
  ];

  // ── Cashfree payment flow ──────────────────────────────────────────────────
  const handleMonthlyPayment = useCallback(async () => {
    setPaymentLoading(true);
    setLocalError(null);

    try {
      // Step 1: select paid_monthly plan first (sets monthlyFeeRupees on sub)
      const planResult = await dispatch(
        selectPartnerPlan("paid_monthly"),
      ).unwrap();

      // Step 2: create Cashfree order
      const orderData = await dispatch(createMonthlyPaymentOrder()).unwrap();

      // Step 3: load Cashfree SDK
      const CashfreeSDK = await loadCashfreeSDK(orderData.environment);
      if (!CashfreeSDK)
        throw new Error("Payment SDK failed to load. Please try again.");

      const cashfree = CashfreeSDK({
        mode: orderData.environment === "PRODUCTION" ? "production" : "sandbox",
      });

      // Step 4: open drop-in checkout
      const result = await cashfree.checkout({
        paymentSessionId: orderData.paymentSessionId,
        returnUrl: `${window.location.origin}${window.location.pathname}?payment=success&orderId=${orderData.orderId}`,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Payment failed. Please try again.",
        );
      }

      if (result.paymentDetails) {
        // Step 5: verify on backend
        await dispatch(verifyMonthlyPayment(orderData.orderId)).unwrap();
        setSuccessMessage(
          "Payment successful! Your monthly subscription is now active.",
        );
      }
    } catch (err) {
      setLocalError(err.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  }, [dispatch]);

  // ── Partner plan selection ─────────────────────────────────────────────────
  const handlePartnerSelect = useCallback(async () => {
    setLocalError(null);
    try {
      await dispatch(selectPartnerPlan("partner")).unwrap();
      setSuccessMessage(
        "You've joined the Performance Partnership! Your CRM access is now active.",
      );
    } catch (err) {
      setLocalError(err.message || "Something went wrong. Please try again.");
    }
  }, [dispatch]);

  // ── Confirm action ────────────────────────────────────────────────────────
  const handleConfirm = useCallback(async () => {
    if (!selectedPlan) return;
    dispatch(clearActionState());
    setLocalError(null);

    if (selectedPlan === "partner") {
      await handlePartnerSelect();
    } else {
      await handleMonthlyPayment();
    }
  }, [selectedPlan, dispatch, handlePartnerSelect, handleMonthlyPayment]);

  const isLoading = actionLoading || paymentLoading;
  const displayError = localError || actionError;

  if (!needsModal) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(6,11,23,0.92)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Success state */}
          {successMessage ? (
            <div className="bg-[#090f1e] border border-emerald-500/30 rounded-3xl p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-emerald-400" />
              </motion.div>
              <h2 className="text-white text-2xl font-bold mb-3">
                You&apos;re all set!
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                {successMessage}
              </p>
            </div>
          ) : (
            <div className="bg-[#090f1e] border border-white/10 rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Zap size={16} className="text-blue-400" />
                  </div>
                  <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
                    Plan Required
                  </span>
                </div>
                <h1 className="text-white text-2xl font-bold mb-2">
                  Choose Your Plan to Continue
                </h1>
                <p className="text-white/50 text-sm leading-relaxed">
                  Your 30-day free trial has ended. Select a plan to maintain
                  access to your CRM.{" "}
                  {isOrgAdmin
                    ? "As an organisation, you can process up to 15 counselors and unlimited students."
                    : "Your student data and applications are safely preserved."}
                </p>
              </div>

              {/* Plan cards */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      isSelected={selectedPlan === plan.id}
                      onSelect={() => setSelectedPlan(plan.id)}
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {displayError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4"
                    >
                      <AlertCircle
                        size={15}
                        className="text-red-400 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-red-300 text-sm">{displayError}</p>
                      <button
                        onClick={() => {
                          setLocalError(null);
                          dispatch(clearActionState());
                        }}
                        className="ml-auto text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA */}
                <button
                  onClick={handleConfirm}
                  disabled={!selectedPlan || isLoading}
                  className={`
                    w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200
                    flex items-center justify-center gap-2
                    ${
                      !selectedPlan
                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                        : selectedPlan === "partner"
                          ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                    }
                    ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {selectedPlan === "paid_monthly"
                        ? "Processing payment…"
                        : "Activating plan…"}
                    </>
                  ) : selectedPlan === "partner" ? (
                    <>
                      <Target size={16} />
                      Join Performance Partnership — Free CRM
                    </>
                  ) : selectedPlan === "paid_monthly" ? (
                    <>
                      <CreditCard size={16} />
                      Pay {formatRupees(monthlyFee)} / month &amp; Activate
                    </>
                  ) : (
                    "Select a plan to continue"
                  )}
                </button>

                {/* Fine print */}
                <p className="text-white/25 text-xs text-center mt-4">
                  By selecting a plan you agree to the Khizar Overseas Partner
                  Terms. Plans can be changed from your Settings page.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
