// lib/counselorApi.js  —  RAZORPAY EDITION
//
// Changes from Stripe version:
//   REMOVED:  createCheckoutSession(), createPortalSession()
//   ADDED:    createOrder(), verifyPayment(), cancelSubscription()
//
// All other methods are unchanged.

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const DEFAULT_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const call = async (
  method,
  path,
  body = null,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}/api/counselor${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    clearTimeout(timer);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || `HTTP ${res.status}`, res.status);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new ApiError("Request timed out", 408);
    throw err;
  }
};

const callBranding = async (method, path, body = null) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/api${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    clearTimeout(timer);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || `HTTP ${res.status}`, res.status);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new ApiError("Request timed out", 408);
    throw err;
  }
};

const callSubscription = async (method, path, body = null) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/api/subscription${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    clearTimeout(timer);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || `HTTP ${res.status}`, res.status);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new ApiError("Request timed out", 408);
    throw err;
  }
};

const callUpload = async (path, formData) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(`${BASE}/api${path}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || `HTTP ${res.status}`, res.status);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new ApiError("Upload timed out", 408);
    throw err;
  }
};

export const counselorApi = {
  // Overview & profile
  getOverview: () => call("GET", "/overview"),
  updateProfile: (data) => call("PATCH", "/profile", data),
  forceRefreshStats: () => call("GET", "/stats/refresh"),

  // Students / leads
  getStudents: (params = {}) =>
    call("GET", `/students?${new URLSearchParams(params)}`),
  getStudentDetail: (leadId) => call("GET", `/students/${leadId}`),
  updateLeadStage: (leadId, data) =>
    call("PATCH", `/students/${leadId}/stage`, data),
  assignLead: (leadId, data) =>
    call("POST", `/students/${leadId}/assign`, data),
  createStudent: (data) => call("POST", "/student", data),

  // Pipeline & applications
  getPipeline: () => call("GET", "/pipeline"),
  getApplications: (params = {}) =>
    call("GET", `/applications?${new URLSearchParams(params)}`),

  // Deadlines
  getDeadlines: (params = {}) =>
    call("GET", `/deadlines?${new URLSearchParams(params)}`),

  // Notes
  getNotes: (leadId, params = {}) =>
    call("GET", `/notes/${leadId}?${new URLSearchParams(params)}`),
  createNote: (leadId, data) => call("POST", `/notes/${leadId}`, data),
  updateNote: (noteId, data) => call("PATCH", `/notes/${noteId}`, data),
  deleteNote: (noteId) => call("DELETE", `/notes/${noteId}`),

  // Activity
  getActivity: (params = {}) =>
    call("GET", `/activity?${new URLSearchParams(params)}`),

  // Analytics
  getMonthlyAnalytics: (months = 6) =>
    call("GET", `/analytics/monthly?months=${months}`),
  getCountryBreakdown: () => call("GET", "/analytics/countries"),

  // Search
  search: (q) => call("GET", `/search?q=${encodeURIComponent(q)}`),

  // Tasks (persisted, per-counselor)
  getTasks: (filter = "") =>
    call("GET", `/tasks${filter ? `?filter=${filter}` : ""}`),
  createTask: (data) => call("POST", "/tasks", data),
  updateTask: (taskId, data) => call("PATCH", `/tasks/${taskId}`, data),
  deleteTask: (taskId) => call("DELETE", `/tasks/${taskId}`),

  // Branding
  getMyBranding: () => callBranding("GET", "/branding/me"),
  updateBranding: (data) => callBranding("PATCH", "/branding/me", data),
  uploadBrandingAsset: (field, file) => {
    const fd = new FormData();
    fd.append("field", field);
    fd.append("file", file);
    return callUpload("/branding/me/upload", fd);
  },

  // ── Subscription / Razorpay ────────────────────────────────────────────────
  //
  // createOrder()   → POST /api/subscription/create-order
  //                   returns { subscriptionId, keyId, prefill }
  //
  // verifyPayment() → POST /api/subscription/verify
  //                   body: { razorpay_payment_id, razorpay_subscription_id, razorpay_signature }
  //                   returns { success, expiresAt }
  //
  // cancelSubscription() → POST /api/subscription/cancel
  //                        returns { success, message }
  //
  // getSubscriptionStatus() → GET /api/subscription/status
  //                           API contract identical to old Stripe version

  getSubscriptionStatus: () => callSubscription("GET", "/status"),
  createOrder: () => callSubscription("POST", "/create-order"),
  verifyPayment: (payload) => callSubscription("POST", "/verify", payload),
  cancelSubscription: () => callSubscription("POST", "/cancel"),
};
