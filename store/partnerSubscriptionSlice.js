/**
 * store/partnerSubscriptionSlice.js
 *
 * Redux slice for the Partner Subscription Engine.
 *
 * State shape:
 *   subscription   — PartnerSubscription document (null until loaded)
 *   currentQuarter — QuarterlyTracking document for the active quarter (null until loaded)
 *   planConfig     — PLAN_CONFIG entry for this entity type (fees, targets)
 *   loading        — true during fetchPartnerStatus
 *   error          — error message string or null
 *   actionLoading  — true during plan selection / payment actions
 *   actionError    — error from last action
 *
 * Follows the exact same pattern as orgAdminSlice.js (apiFetch helper, no
 * shared apiClient — this project uses per-slice fetch wrappers).
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3020";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ── Thunks ────────────────────────────────────────────────────────────────────

/**
 * Fetch the full partner subscription + current quarter status.
 * Called on dashboard mount and after any plan/payment action.
 */
export const fetchPartnerStatus = createAsyncThunk(
  "partnerSubscription/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/partner-subscription/status");
      return data.data; // { subscription, currentQuarter, planConfig } or null
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Select a plan. planType: "partner" | "paid_monthly"
 */
export const selectPartnerPlan = createAsyncThunk(
  "partnerSubscription/selectPlan",
  async (planType, { rejectWithValue, dispatch }) => {
    try {
      const data = await apiFetch("/api/partner-subscription/select-plan", {
        method: "POST",
        body: JSON.stringify({ planType }),
      });
      // Refresh status after selection
      dispatch(fetchPartnerStatus());
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Create a Cashfree payment order for the monthly SaaS fee.
 * Returns { orderId, paymentSessionId, amount, environment, appId }
 */
export const createMonthlyPaymentOrder = createAsyncThunk(
  "partnerSubscription/createMonthlyOrder",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/partner-subscription/create-payment-order",
        { method: "POST" },
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Verify the monthly payment after Cashfree checkout completes.
 */
export const verifyMonthlyPayment = createAsyncThunk(
  "partnerSubscription/verifyMonthlyPayment",
  async (orderId, { rejectWithValue, dispatch }) => {
    try {
      const data = await apiFetch("/api/partner-subscription/verify-payment", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      });
      dispatch(fetchPartnerStatus());
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Create a Cashfree payment order for the quarterly settlement penalty.
 */
export const createSettlementOrder = createAsyncThunk(
  "partnerSubscription/createSettlementOrder",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/partner-subscription/pay-settlement", {
        method: "POST",
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Verify the settlement payment after Cashfree checkout completes.
 */
export const verifySettlementPayment = createAsyncThunk(
  "partnerSubscription/verifySettlement",
  async (orderId, { rejectWithValue, dispatch }) => {
    try {
      const data = await apiFetch(
        "/api/partner-subscription/verify-settlement",
        {
          method: "POST",
          body: JSON.stringify({ orderId }),
        },
      );
      dispatch(fetchPartnerStatus());
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Fetch quarterly history (all past quarters for this entity).
 */
export const fetchQuarterlyHistory = createAsyncThunk(
  "partnerSubscription/fetchQuarterlyHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/partner-subscription/quarterly-history",
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  // Core subscription state
  subscription: null,
  currentQuarter: null,
  planConfig: null,

  // Async states
  loading: false,
  error: null,

  // For plan selection / payment actions
  actionLoading: false,
  actionError: null,
  actionSuccess: null,

  // Quarterly history
  quarterlyHistory: [],
  historyLoading: false,

  // Payment order data (transient — used by modal during checkout flow)
  pendingOrder: null,
};

const partnerSubscriptionSlice = createSlice({
  name: "partnerSubscription",
  initialState,
  reducers: {
    /**
     * Clear transient action state (call after modal closes or on error dismiss).
     */
    clearActionState(state) {
      state.actionLoading = false;
      state.actionError = null;
      state.actionSuccess = null;
      state.pendingOrder = null;
    },

    /**
     * Store a pending Cashfree order so the payment modal can access it.
     */
    setPendingOrder(state, action) {
      state.pendingOrder = action.payload;
    },

    /**
     * Clear pending order after checkout completes or is cancelled.
     */
    clearPendingOrder(state) {
      state.pendingOrder = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchPartnerStatus ──────────────────────────────────────────────────
    builder
      .addCase(fetchPartnerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.subscription = action.payload.subscription;
          state.currentQuarter = action.payload.currentQuarter;
          state.planConfig = action.payload.planConfig;
        } else {
          // null = entity not in new engine yet (legacy flow)
          state.subscription = null;
          state.currentQuarter = null;
          state.planConfig = null;
        }
      })
      .addCase(fetchPartnerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── selectPartnerPlan ───────────────────────────────────────────────────
    builder
      .addCase(selectPartnerPlan.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = null;
      })
      .addCase(selectPartnerPlan.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = action.payload.message;
      })
      .addCase(selectPartnerPlan.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // ── createMonthlyPaymentOrder ───────────────────────────────────────────
    builder
      .addCase(createMonthlyPaymentOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.pendingOrder = null;
      })
      .addCase(createMonthlyPaymentOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.pendingOrder = action.payload;
      })
      .addCase(createMonthlyPaymentOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // ── verifyMonthlyPayment ────────────────────────────────────────────────
    builder
      .addCase(verifyMonthlyPayment.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(verifyMonthlyPayment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = action.payload.message;
        state.pendingOrder = null;
      })
      .addCase(verifyMonthlyPayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // ── createSettlementOrder ───────────────────────────────────────────────
    builder
      .addCase(createSettlementOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.pendingOrder = null;
      })
      .addCase(createSettlementOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.pendingOrder = action.payload;
      })
      .addCase(createSettlementOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // ── verifySettlementPayment ─────────────────────────────────────────────
    builder
      .addCase(verifySettlementPayment.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(verifySettlementPayment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = action.payload.message;
        state.pendingOrder = null;
      })
      .addCase(verifySettlementPayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // ── fetchQuarterlyHistory ───────────────────────────────────────────────
    builder
      .addCase(fetchQuarterlyHistory.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(fetchQuarterlyHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.quarterlyHistory = action.payload || [];
      })
      .addCase(fetchQuarterlyHistory.rejected, (state) => {
        state.historyLoading = false;
      });
  },
});

export const { clearActionState, setPendingOrder, clearPendingOrder } =
  partnerSubscriptionSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectPartnerSubscription = (state) =>
  state.partnerSubscription.subscription;

export const selectCurrentQuarter = (state) =>
  state.partnerSubscription.currentQuarter;

export const selectPlanConfig = (state) => state.partnerSubscription.planConfig;

export const selectSubscriptionStatus = (state) =>
  state.partnerSubscription.subscription?.status ?? null;

export const selectSubscriptionLoading = (state) =>
  state.partnerSubscription.loading;

export const selectActionLoading = (state) =>
  state.partnerSubscription.actionLoading;

export const selectActionError = (state) =>
  state.partnerSubscription.actionError;

export const selectPendingOrder = (state) =>
  state.partnerSubscription.pendingOrder;

/**
 * Returns true if the subscription state requires a blocking modal.
 * need_selection: trial ended, must pick a plan before proceeding.
 */
export const selectNeedsBlockingModal = (state) => {
  const status = state.partnerSubscription.subscription?.status;
  return status === "need_selection" || status === "cancelled";
};

/**
 * Returns true if the account is in the settlement warning state
 * (quarterly target missed, in 15-day payment window).
 */
export const selectInSettlementWarning = (state) => {
  const status = state.partnerSubscription.subscription?.status;
  return status === "quarterly_due";
};

/**
 * Returns true if the account is fully suspended.
 */
export const selectIsSuspended = (state) => {
  const status = state.partnerSubscription.subscription?.status;
  return status === "suspended" || status === "settlement_expired";
};

export default partnerSubscriptionSlice.reducer;
