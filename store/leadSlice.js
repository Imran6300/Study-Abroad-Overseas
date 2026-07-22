/**
 * store/leadSlice.js
 *
 * Refactor notes (see ARCHITECTURE_REVIEW.md §3, §8, §9): this slice used
 * raw `fetch()` directly against `process.env.NEXT_PUBLIC_BACKEND_URL` —
 * one of three different HTTP-calling conventions coexisting across the 17
 * store slices (the others being raw axios, and the shared apiClient).
 * Migrated to the shared `apiClient` + `createApiThunk` (already written,
 * already used elsewhere, just not adopted here) as the reference
 * implementation for rolling the same change out to the remaining slices.
 *
 * No behavior change: same action type ("lead/fetchMyLead"), same
 * endpoint ("/api/lead/me"), same fulfilled payload (`lead`), same
 * rejected payload ("Failed to fetch lead" on a non-2xx response, or the
 * underlying error message on a network failure), same reducers/state
 * shape.
 */
import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../lib/apiClient";
import { createApiThunk } from "../lib/createApiThunk";

export const fetchMyLead = createApiThunk(
  "lead/fetchMyLead",
  () => apiClient.get("/api/lead/me"),
  { select: (data) => data.lead, fallbackError: "Failed to fetch lead" },
);

const leadSlice = createSlice({
  name: "lead",
  initialState: {
    lead: null,
    loading: false,
    error: null,
    fetched: false,
  },
  reducers: {
    clearLead: (state) => {
      state.lead = null;
      state.loading = false;
      state.error = null;
      state.fetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLead.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyLead.fulfilled, (state, action) => {
        state.loading = false;
        state.lead = action.payload;
        state.fetched = true;
      })
      .addCase(fetchMyLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = true; // important
      });
  },
});

export const { clearLead } = leadSlice.actions;
export default leadSlice.reducer;
