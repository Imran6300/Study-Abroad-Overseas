// store/brandingSlice.js
// ─────────────────────────────────────────────────────────────────────────────
// Manages counselor branding for the STUDENT dashboard.
//
// Flow:
//   1. Student logs in → auth sets user (user.counselorOwner = counselorId if
//      they belong to a counselor)
//   2. Student dashboard layout dispatches fetchCounselorBranding(counselorId)
//   3. This slice fetches GET /api/branding/:counselorId  (public endpoint)
//   4. Every component that needs theming reads from state.branding.*
//
// FIX SUMMARY:
//   - fetchCounselorBranding now correctly calls /api/branding/:counselorId
//     (this route was added to the backend — it was missing before)
//   - The fulfilled handler no longer re-checks plan/premium locally.
//     The backend already gates colors by plan in buildStudentBrandingResponse().
//     Redundant frontend re-gating was causing colors to always fall back to
//     defaults because the backend response doesn't include plan/premiumExpiresAt
//     in the student-facing endpoint.
//   - removeKhizarBranding and customEmailBranding are now read directly from
//     the top-level response (not from b.features.*) because the backend
//     flattens them before sending to the student.
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

// ── Default brand (fallback when no counselor / standard plan) ───────────────
export const DEFAULT_BRANDING = {
  brandName: "Khizar Overseas",
  tagline: "Study Abroad CRM & Student Management Platform",
  logo: "",
  favicon: "",
  primaryColor: "#22c55e",
  secondaryColor: "#0A192F",
  accentColor: "#ffffff",
  footerText: "Powered by Khizar Overseas",
  removeKhizarBranding: false,
  customEmailBranding: false,
  brandingEnabled: true,
  plan: "standard",
  isPremium: false,
  premiumExpiresAt: null,
};

// ── Async thunk: fetch branding for a specific counselor (called by student) ──
// FIX: Was calling /api/branding/:counselorId but the route /api/branding/:counselorId
// did not exist on the backend. Backend only had /api/branding (auth-based).
// Added the public /api/branding/:counselorId route to the backend.
export const fetchCounselorBranding = createAsyncThunk(
  "branding/fetchCounselorBranding",
  async (counselorId, thunkAPI) => {
    if (!counselorId) return DEFAULT_BRANDING;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/branding/${counselorId}`,
        {
          credentials: "include",
          // No auth header needed — this is a public endpoint
        },
      );
      if (!res.ok) {
        return DEFAULT_BRANDING;
      }
      const data = await res.json();
      return data.branding ?? DEFAULT_BRANDING;
    } catch {
      return DEFAULT_BRANDING;
    }
  },
);

// ── Async thunk: fetch COUNSELOR's OWN branding (used in settings page) ──────
export const fetchMyBranding = createAsyncThunk(
  "branding/fetchMyBranding",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/branding/me`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      return data.branding ?? DEFAULT_BRANDING;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ── Async thunk: save branding (called from counselor settings) ───────────────
export const saveBranding = createAsyncThunk(
  "branding/saveBranding",
  async (payload, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/branding/me`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.branding;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState = {
  // The resolved branding the student dashboard should render
  active: { ...DEFAULT_BRANDING },

  // Raw branding doc from backend (for counselor settings page)
  raw: null,

  loading: false,
  saving: false,
  error: null,
  fetched: false, // true once at least one fetch completed (avoids flash)
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const brandingSlice = createSlice({
  name: "branding",
  initialState,
  reducers: {
    // Optimistic update — counselor settings page calls this on every change
    setBrandingField(state, action) {
      const { field, value } = action.payload;
      state.active[field] = value;
      if (state.raw) state.raw[field] = value;
    },
    setBrandingFields(state, action) {
      Object.assign(state.active, action.payload);
      if (state.raw) Object.assign(state.raw, action.payload);
    },
    resetBranding(state) {
      state.active = { ...DEFAULT_BRANDING };
      state.raw = null;
      state.fetched = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Clear branding on logout ───────────────────────────────────────────
    // Defense-in-depth: the SPA reuses one Redux store across logins in the
    // same browser session, so any per-user state (like branding) has to be
    // explicitly cleared on logout or it silently carries over to whoever
    // logs in next. Listening for authSlice's logout action here means this
    // reset happens no matter which layout/page triggers the logout.
    builder.addCase(logout, (state) => {
      state.active = { ...DEFAULT_BRANDING };
      state.raw = null;
      state.fetched = false;
      state.loading = false;
      state.saving = false;
      state.error = null;
    });

    // ── fetchCounselorBranding (student side) ──────────────────────────────
    builder
      .addCase(fetchCounselorBranding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCounselorBranding.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        const b = action.payload;

        // If branding is disabled, fall back to defaults
        if (!b.brandingEnabled) {
          state.active = { ...DEFAULT_BRANDING };
          return;
        }

        // FIX: Do NOT re-check plan/isPremium here. The backend's
        // buildStudentBrandingResponse() already applies premium gating.
        // If the backend sends primaryColor: "#ff0000", it means the counselor
        // IS premium and that color is valid. Don't override it.
        //
        // Previously, this code re-checked b.plan === "premium" but the
        // student-facing endpoint never returns plan/premiumExpiresAt,
        // so isPremium was always false and colors always fell back to defaults.

        state.active = {
          brandName: b.brandName || DEFAULT_BRANDING.brandName,
          tagline: b.tagline || DEFAULT_BRANDING.tagline,
          logo: b.logo || "",
          favicon: b.favicon || "",
          primaryColor: b.primaryColor || DEFAULT_BRANDING.primaryColor,
          secondaryColor: b.secondaryColor || DEFAULT_BRANDING.secondaryColor,
          accentColor: b.accentColor || DEFAULT_BRANDING.accentColor,
          footerText: b.footerText || DEFAULT_BRANDING.footerText,
          // FIX: Backend flattens these from features.* to top-level fields.
          // Read them directly from b, not from b.features.*.
          removeKhizarBranding: b.removeKhizarBranding ?? false,
          customEmailBranding: b.customEmailBranding ?? false,
          brandingEnabled: b.brandingEnabled ?? true,
          plan: b.plan || "standard",
          isPremium: b.isPremium ?? false,
          premiumExpiresAt: b.premiumExpiresAt || null,
        };
      })
      .addCase(fetchCounselorBranding.rejected, (state) => {
        state.loading = false;
        state.fetched = true;
        state.active = { ...DEFAULT_BRANDING };
      });

    // ── fetchMyBranding (counselor settings page) ──────────────────────────
    builder
      .addCase(fetchMyBranding.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBranding.fulfilled, (state, action) => {
        state.loading = false;
        state.raw = action.payload;
        state.fetched = true;
      })
      .addCase(fetchMyBranding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── saveBranding (counselor settings) ─────────────────────────────────
    builder
      .addCase(saveBranding.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveBranding.fulfilled, (state, action) => {
        state.saving = false;
        state.raw = action.payload;
        // Also update active so live preview stays in sync
        if (action.payload) {
          Object.assign(state.active, action.payload);
        }
      })
      .addCase(saveBranding.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { setBrandingField, setBrandingFields, resetBranding } =
  brandingSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectActiveBranding = (state) => state.branding.active;
export const selectRawBranding = (state) => state.branding.raw;
export const selectBrandingLoading = (state) => state.branding.loading;
export const selectBrandingSaving = (state) => state.branding.saving;
export const selectBrandingFetched = (state) => state.branding.fetched;

// Convenience: resolved CSS vars for direct use in style props
export const selectBrandingCSSVars = (state) => {
  const b = state.branding.active;
  return {
    "--brand-primary": b.primaryColor,
    "--brand-bg": b.secondaryColor,
    "--brand-accent": b.accentColor,
  };
};

export default brandingSlice.reducer;
