/**
 * lib/counselorApi.js  —  CASHFREE EDITION
 *
 * Subscription calls updated from Razorpay → Cashfree flow.
 * createOrder() now returns { orderId, paymentSessionId, appId, environment }
 * verifyPayment() now takes { orderId } instead of Razorpay triple
 * cancelSubscription() unchanged (POST /cancel)
 */

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const DEFAULT_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const apiFetch = async (
  method,
  basePath,
  path,
  body = null,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const isFormData = body instanceof FormData;

  try {
    const res = await fetch(`${BASE}${basePath}${path}`, {
      method,
      credentials: "include",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      signal: controller.signal,
      ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
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

const counselorCall = (method, path, body = null) =>
  apiFetch(method, "/api/counselor", path, body);

const brandingCall = (method, path, body = null) =>
  apiFetch(method, "/api", path, body);

const subscriptionCall = (method, path, body = null, timeoutMs = 30_000) =>
  apiFetch(method, "/api/subscription", path, body, timeoutMs);

export const counselorApi = {
  // ── Overview & profile ─────────────────────────────────────────────────────
  getOverview: () => counselorCall("GET", "/overview"),
  updateProfile: (data) => counselorCall("PATCH", "/profile", data),
  forceRefreshStats: () => counselorCall("GET", "/stats/refresh"),

  // ── Students / leads ───────────────────────────────────────────────────────
  getStudents: (params = {}) =>
    counselorCall("GET", `/students?${new URLSearchParams(params)}`),
  getStudentDetail: (leadId) => counselorCall("GET", `/students/${leadId}`),
  updateLeadStage: (leadId, d) =>
    counselorCall("PATCH", `/students/${leadId}/stage`, d),
  assignLead: (leadId, d) =>
    counselorCall("POST", `/students/${leadId}/assign`, d),
  createStudent: (data) => counselorCall("POST", "/student", data),

  // ── Pipeline & applications ────────────────────────────────────────────────
  getPipeline: () => counselorCall("GET", "/pipeline"),
  getApplications: (params = {}) =>
    counselorCall("GET", `/applications?${new URLSearchParams(params)}`),

  // ── Deadlines ──────────────────────────────────────────────────────────────
  getDeadlines: (params = {}) =>
    counselorCall("GET", `/deadlines?${new URLSearchParams(params)}`),

  // ── Notes ──────────────────────────────────────────────────────────────────
  getNotes: (leadId, params = {}) =>
    counselorCall("GET", `/notes/${leadId}?${new URLSearchParams(params)}`),
  createNote: (leadId, data) => counselorCall("POST", `/notes/${leadId}`, data),
  updateNote: (noteId, data) =>
    counselorCall("PATCH", `/notes/${noteId}`, data),
  deleteNote: (noteId) => counselorCall("DELETE", `/notes/${noteId}`),

  // ── Activity ───────────────────────────────────────────────────────────────
  getActivity: (params = {}) =>
    counselorCall("GET", `/activity?${new URLSearchParams(params)}`),

  // ── Analytics ──────────────────────────────────────────────────────────────
  getMonthlyAnalytics: (months = 6) =>
    counselorCall("GET", `/analytics/monthly?months=${months}`),
  getCountryBreakdown: () => counselorCall("GET", "/analytics/countries"),

  // ── Search ─────────────────────────────────────────────────────────────────
  search: (q) => counselorCall("GET", `/search?q=${encodeURIComponent(q)}`),

  // ── Tasks ──────────────────────────────────────────────────────────────────
  getTasks: (filter = "") =>
    counselorCall("GET", `/tasks${filter ? `?filter=${filter}` : ""}`),
  createTask: (data) => counselorCall("POST", "/tasks", data),
  updateTask: (id, data) => counselorCall("PATCH", `/tasks/${id}`, data),
  deleteTask: (id) => counselorCall("DELETE", `/tasks/${id}`),

  // ── Meetings ───────────────────────────────────────────────────────────────
  getMeetings: (params = {}) =>
    counselorCall("GET", `/meetings?${new URLSearchParams(params)}`),
  createMeeting: (data) => counselorCall("POST", "/meetings", data),
  updateMeeting: (id, data) => counselorCall("PATCH", `/meetings/${id}`, data),
  deleteMeeting: (id) => counselorCall("DELETE", `/meetings/${id}`),

  // ── Deposit ────────────────────────────────────────────────────────────────
  getDeposit: (leadId) => counselorCall("GET", `/leads/${leadId}/deposit`),
  updateDeposit: (leadId, d) =>
    counselorCall("PATCH", `/leads/${leadId}/deposit`, d),
  clearDeposit: (leadId) => counselorCall("DELETE", `/leads/${leadId}/deposit`),

  // ── Offer Letter ───────────────────────────────────────────────────────────
  getOfferLetter: (leadId) =>
    counselorCall("GET", `/leads/${leadId}/offer-letter`),
  deleteOfferLetter: (leadId) =>
    counselorCall("DELETE", `/leads/${leadId}/offer-letter`),
  uploadOfferLetter: (leadId, file, university = "") => {
    const fd = new FormData();
    fd.append("file", file);
    if (university) fd.append("university", university);
    return apiFetch(
      "POST",
      "/api/counselor",
      `/leads/${leadId}/offer-letter`,
      fd,
      60_000,
    );
  },

  // ── Counselor-uploaded student documents (upload on behalf of student) ─────
  getLeadDocuments: (leadId) =>
    counselorCall("GET", `/leads/${leadId}/documents`),
  uploadLeadDocument: (
    leadId,
    file,
    { title = "", category = "other" } = {},
  ) => {
    const fd = new FormData();
    fd.append("file", file);
    if (title) fd.append("title", title);
    if (category) fd.append("category", category);
    return apiFetch(
      "POST",
      "/api/counselor",
      `/leads/${leadId}/documents`,
      fd,
      60_000,
    );
  },
  deleteLeadDocument: (leadId, docId) =>
    counselorCall("DELETE", `/leads/${leadId}/documents/${docId}`),

  // ── Branding ───────────────────────────────────────────────────────────────
  getMyBranding: () => brandingCall("GET", "/branding/me"),
  updateBranding: (data) => brandingCall("PATCH", "/branding/me", data),
  uploadBrandingAsset: (field, file) => {
    const fd = new FormData();
    fd.append("field", field);
    fd.append("file", file);
    return apiFetch("PATCH", "/api", "/branding/me/upload", fd, 60_000);
  },

  // ── Subscription (Cashfree) ────────────────────────────────────────────────
  getSubscriptionStatus: () => subscriptionCall("GET", "/status"),

  /**
   * Creates a Cashfree Order
   * Returns { orderId, paymentSessionId, appId, environment, prefill }
   */
  createOrder: () => subscriptionCall("POST", "/create-order", null, 30_000),

  /**
   * Verifies Cashfree payment after checkout completes
   * Payload: { orderId }
   */
  verifyPayment: (payload) =>
    subscriptionCall("POST", "/verify", payload, 30_000),

  /** Cancels premium — downgrades to standard immediately */
  cancelSubscription: () => subscriptionCall("POST", "/cancel"),
};
