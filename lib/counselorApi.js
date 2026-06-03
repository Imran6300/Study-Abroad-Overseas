// lib/counselorApi.js
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const DEFAULT_TIMEOUT_MS = 15_000; // 15 seconds

/**
 * Custom error class that preserves the HTTP status code.
 * Callers can check: if (err instanceof ApiError && err.status === 401) { ... }
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Core fetch wrapper with timeout, credentials, and structured error.
 */
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
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out", 408);
    }
    throw err;
  }
};

/** Branding routes mounted at /api, not /api/counselor */
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

/** Multipart upload helper */
const callUpload = async (path, formData) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000); // uploads need more time

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
  getOverview: () => call("GET", "/overview"),
  updateProfile: (data) => call("PATCH", "/profile", data),
  getStudents: (params = {}) =>
    call("GET", `/students?${new URLSearchParams(params)}`),
  getStudentDetail: (leadId) => call("GET", `/students/${leadId}`),
  updateLeadStage: (leadId, data) =>
    call("PATCH", `/students/${leadId}/stage`, data),
  assignLead: (leadId, data) =>
    call("POST", `/students/${leadId}/assign`, data),
  getPipeline: () => call("GET", "/pipeline"),
  getApplications: (params = {}) =>
    call("GET", `/applications?${new URLSearchParams(params)}`),
  getDeadlines: (params = {}) =>
    call("GET", `/deadlines?${new URLSearchParams(params)}`),
  getNotes: (leadId) => call("GET", `/notes/${leadId}`),
  createNote: (leadId, data) => call("POST", `/notes/${leadId}`, data),
  updateNote: (noteId, data) => call("PATCH", `/notes/${noteId}`, data),
  deleteNote: (noteId) => call("DELETE", `/notes/${noteId}`),
  getActivity: (params = {}) =>
    call("GET", `/activity?${new URLSearchParams(params)}`),
  getMonthlyAnalytics: (months = 6) =>
    call("GET", `/analytics/monthly?months=${months}`),
  getCountryBreakdown: () => call("GET", "/analytics/countries"),
  search: (q) => call("GET", `/search?q=${encodeURIComponent(q)}`),
  forceRefreshStats: () => call("GET", "/stats/refresh"),

  // Branding
  getMyBranding: () => callBranding("GET", "/branding/me"),
  updateBranding: (data) => callBranding("PATCH", "/branding/me", data),
  uploadBrandingAsset: (field, file) => {
    const fd = new FormData();
    fd.append("field", field);
    fd.append("file", file);
    return callUpload("/branding/me/upload", fd);
  },
};
