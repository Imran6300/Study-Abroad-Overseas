import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../lib/apiClient";
import { createApiThunk } from "../lib/createApiThunk";

/**
 * REFACTORED — see /refactor/README.md "Pattern 2".
 *
 * Every action type string, every request URL/method/body, every
 * fulfilled payload, and every rejected fallback message below is
 * unchanged from the original applicationSlice.js. extraReducers is
 * untouched byte-for-byte. What's gone is the 5x-repeated
 * `axios.<verb>(`${API}/...`, { withCredentials: true })` +
 * try/catch/rejectWithValue block — that's now one line per thunk.
 */

const initialState = {
  applications: [],
  loading: false,
  saving: false,
  error: null,
};

// ─── Counselor/Admin fetches a STUDENT's applications by userId ───────────────
// Uses the admin endpoint GET /api/admin/applications/:userId which returns
// fully-populated application documents with university name, country, etc.
// This is called from the counselor's student detail page.
export const fetchStudentApplications = createApiThunk(
  "applications/fetchStudentApplications",
  (userId) => apiClient.get(`/api/admin/applications/${userId}`),
  {
    select: (data) => data.applications,
    fallbackError: "Failed to fetch applications",
  },
);

// ─── Admin/Counselor creates an application for a student ────────────────────
export const createStudentApplication = createApiThunk(
  "applications/createStudentApplication",
  ({ studentId, payload }) =>
    apiClient.post("/api/admin/applications", {
      ...payload,
      userId: studentId,
    }),
  {
    select: (data) => data.application,
    fallbackError: "Failed to create application",
  },
);

// ─── Admin/Counselor updates an application ──────────────────────────────────
export const updateStudentApplication = createApiThunk(
  "applications/updateStudentApplication",
  ({ applicationId, payload }) =>
    apiClient.put(`/api/admin/applications/${applicationId}`, payload),
  {
    select: (data) => data.application,
    fallbackError: "Failed to update application",
  },
);

// ─── Admin/Counselor deletes an application ──────────────────────────────────
export const deleteStudentApplication = createApiThunk(
  "applications/deleteStudentApplication",
  (applicationId) =>
    apiClient.delete(`/api/admin/applications/${applicationId}`),
  {
    // original thunk ignored the response body and resolved with the id
    // it was called with — `select` receives (data, arg), so just echo arg.
    select: (_data, applicationId) => applicationId,
    fallbackError: "Failed to delete application",
  },
);

// ─── Admin/Counselor updates application status ──────────────────────────────
export const updateApplicationStatus = createApiThunk(
  "applications/updateApplicationStatus",
  ({ applicationId, payload }) =>
    apiClient.put(`/api/admin/applications/${applicationId}`, payload),
  {
    select: (data) => data.application,
    fallbackError: "Failed to update status",
  },
);

const applicationSlice = createSlice({
  name: "applications",
  initialState,

  reducers: {
    resetApplications: (state) => {
      state.applications = [];
      state.loading = false;
      state.saving = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchStudentApplications
      .addCase(fetchStudentApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload ?? [];
      })
      .addCase(fetchStudentApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createStudentApplication
      .addCase(createStudentApplication.pending, (state) => {
        state.saving = true;
      })
      .addCase(createStudentApplication.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) state.applications.unshift(action.payload);
      })
      .addCase(createStudentApplication.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // updateStudentApplication
      .addCase(updateStudentApplication.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateStudentApplication.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.applications = state.applications.map((app) =>
            app._id === action.payload._id
              ? { ...app, ...action.payload }
              : app,
          );
        }
      })
      .addCase(updateStudentApplication.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // deleteStudentApplication
      .addCase(deleteStudentApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app._id !== action.payload,
        );
      })

      // updateApplicationStatus
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.applications = state.applications.map((app) =>
            app._id === action.payload._id
              ? { ...app, ...action.payload }
              : app,
          );
        }
      });
  },
});

export const { resetApplications } = applicationSlice.actions;
export default applicationSlice.reducer;
