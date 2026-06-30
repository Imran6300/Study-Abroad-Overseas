/**
 * store/orgAdminSlice.js
 *
 * Redux slice for White-Label Admin (Organization) dashboard state.
 * Covers: overview KPIs, counselors list, students list, applications list,
 * organization profile, and logo upload/delete.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─────────────────────────────────────────────────────────────────────────────
// API base
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────────────────────

export const fetchOrgOverview = createAsyncThunk(
  "orgAdmin/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/org-admin/overview");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchOrgPipeline = createAsyncThunk(
  "orgAdmin/fetchPipeline",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/org-admin/pipeline");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchOrgCounselors = createAsyncThunk(
  "orgAdmin/fetchCounselors",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/org-admin/counselors");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const inviteOrgCounselor = createAsyncThunk(
  "orgAdmin/inviteCounselor",
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/org-admin/counselors/invite", {
        method: "POST",
        body: JSON.stringify({ name, email }),
      });
      return data.counselor;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateCounselorStatus = createAsyncThunk(
  "orgAdmin/updateCounselorStatus",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      await apiFetch(`/api/org-admin/counselors/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      return { id, action };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const removeCounselor = createAsyncThunk(
  "orgAdmin/removeCounselor",
  async (id, { rejectWithValue }) => {
    try {
      await apiFetch(`/api/org-admin/counselors/${id}`, { method: "DELETE" });
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchOrgStudents = createAsyncThunk(
  "orgAdmin/fetchStudents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const data = await apiFetch(
        `/api/org-admin/students${qs ? `?${qs}` : ""}`,
      );
      return { data: data.data, pagination: data.pagination };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchOrgApplications = createAsyncThunk(
  "orgAdmin/fetchApplications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const data = await apiFetch(
        `/api/org-admin/applications${qs ? `?${qs}` : ""}`,
      );
      return { data: data.data, pagination: data.pagination };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchOrganization = createAsyncThunk(
  "orgAdmin/fetchOrganization",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/org-admin/organization");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateOrganization = createAsyncThunk(
  "orgAdmin/updateOrganization",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/org-admin/organization", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Upload org logo.
 * payload: File object (from <input type="file">)
 * Sends multipart/form-data — do NOT set Content-Type header manually.
 */
export const uploadOrgLogo = createAsyncThunk(
  "orgAdmin/uploadOrgLogo",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${BASE}/api/org-admin/organization/logo`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      return data.data; // updated org doc
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Delete org logo — sets branding.logo to "".
 */
export const deleteOrgLogo = createAsyncThunk(
  "orgAdmin/deleteOrgLogo",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/org-admin/organization/logo", {
        method: "DELETE",
      });
      return data.data; // updated org doc
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────

const initialState = {
  overview: null,
  pipeline: null,
  counselors: [],
  students: [],
  studentsPagination: null,
  applications: [],
  applicationsPagination: null,
  organization: null,
  loading: {
    overview: false,
    pipeline: false,
    counselors: false,
    students: false,
    applications: false,
    organization: false,
    invite: false,
    logo: false,
  },
  error: null,
};

const orgAdminSlice = createSlice({
  name: "orgAdmin",
  initialState,
  reducers: {
    clearOrgAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Overview ─────────────────────────────────────────────────────────────
    builder
      .addCase(fetchOrgOverview.pending, (state) => {
        state.loading.overview = true;
        state.error = null;
      })
      .addCase(fetchOrgOverview.fulfilled, (state, action) => {
        state.loading.overview = false;
        state.overview = action.payload;
      })
      .addCase(fetchOrgOverview.rejected, (state, action) => {
        state.loading.overview = false;
        state.error = action.payload;
      });

    // ── Pipeline ─────────────────────────────────────────────────────────────
    builder
      .addCase(fetchOrgPipeline.pending, (state) => {
        state.loading.pipeline = true;
      })
      .addCase(fetchOrgPipeline.fulfilled, (state, action) => {
        state.loading.pipeline = false;
        state.pipeline = action.payload;
      })
      .addCase(fetchOrgPipeline.rejected, (state, action) => {
        state.loading.pipeline = false;
        state.error = action.payload;
      });

    // ── Counselors ────────────────────────────────────────────────────────────
    builder
      .addCase(fetchOrgCounselors.pending, (state) => {
        state.loading.counselors = true;
      })
      .addCase(fetchOrgCounselors.fulfilled, (state, action) => {
        state.loading.counselors = false;
        state.counselors = action.payload;
      })
      .addCase(fetchOrgCounselors.rejected, (state, action) => {
        state.loading.counselors = false;
        state.error = action.payload;
      });

    // ── Invite counselor ──────────────────────────────────────────────────────
    builder
      .addCase(inviteOrgCounselor.pending, (state) => {
        state.loading.invite = true;
        state.error = null;
      })
      .addCase(inviteOrgCounselor.fulfilled, (state) => {
        state.loading.invite = false;
      })
      .addCase(inviteOrgCounselor.rejected, (state, action) => {
        state.loading.invite = false;
        state.error = action.payload;
      });

    // ── Suspend / Activate counselor ──────────────────────────────────────────
    builder.addCase(updateCounselorStatus.fulfilled, (state, action) => {
      const { id, action: act } = action.payload;
      const counselor = state.counselors.find((c) => c._id === id);
      if (counselor) {
        counselor.isActive = act === "activate";
        counselor.isSuspended = act === "suspend";
      }
    });

    // ── Remove counselor ──────────────────────────────────────────────────────
    builder.addCase(removeCounselor.fulfilled, (state, action) => {
      state.counselors = state.counselors.filter(
        (c) => c._id !== action.payload,
      );
    });

    // ── Students ──────────────────────────────────────────────────────────────
    builder
      .addCase(fetchOrgStudents.pending, (state) => {
        state.loading.students = true;
      })
      .addCase(fetchOrgStudents.fulfilled, (state, action) => {
        state.loading.students = false;
        state.students = action.payload.data;
        state.studentsPagination = action.payload.pagination;
      })
      .addCase(fetchOrgStudents.rejected, (state, action) => {
        state.loading.students = false;
        state.error = action.payload;
      });

    // ── Applications ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchOrgApplications.pending, (state) => {
        state.loading.applications = true;
      })
      .addCase(fetchOrgApplications.fulfilled, (state, action) => {
        state.loading.applications = false;
        state.applications = action.payload.data;
        state.applicationsPagination = action.payload.pagination;
      })
      .addCase(fetchOrgApplications.rejected, (state, action) => {
        state.loading.applications = false;
        state.error = action.payload;
      });

    // ── Organization ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchOrganization.pending, (state) => {
        state.loading.organization = true;
      })
      .addCase(fetchOrganization.fulfilled, (state, action) => {
        state.loading.organization = false;
        state.organization = action.payload;
      })
      .addCase(fetchOrganization.rejected, (state, action) => {
        state.loading.organization = false;
        state.error = action.payload;
      })
      .addCase(updateOrganization.pending, (state) => {
        state.loading.organization = true;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading.organization = false;
        state.organization = action.payload;
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading.organization = false;
        state.error = action.payload;
      });

    // ── Logo upload ───────────────────────────────────────────────────────────
    builder
      .addCase(uploadOrgLogo.pending, (state) => {
        state.loading.logo = true;
        state.error = null;
      })
      .addCase(uploadOrgLogo.fulfilled, (state, action) => {
        state.loading.logo = false;
        state.organization = action.payload;
      })
      .addCase(uploadOrgLogo.rejected, (state, action) => {
        state.loading.logo = false;
        state.error = action.payload;
      });

    // ── Logo delete ───────────────────────────────────────────────────────────
    builder
      .addCase(deleteOrgLogo.pending, (state) => {
        state.loading.logo = true;
      })
      .addCase(deleteOrgLogo.fulfilled, (state, action) => {
        state.loading.logo = false;
        state.organization = action.payload;
      })
      .addCase(deleteOrgLogo.rejected, (state, action) => {
        state.loading.logo = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrgAdminError } = orgAdminSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectOrgOverview = (state) => state.orgAdmin.overview;
export const selectOrgPipeline = (state) => state.orgAdmin.pipeline;
export const selectOrgCounselors = (state) => state.orgAdmin.counselors;
export const selectOrgStudents = (state) => state.orgAdmin.students;
export const selectOrgStudentsPagination = (state) =>
  state.orgAdmin.studentsPagination;
export const selectOrgApplications = (state) => state.orgAdmin.applications;
export const selectOrganization = (state) => state.orgAdmin.organization;
export const selectOrgAdminLoading = (state) => state.orgAdmin.loading;
export const selectOrgAdminError = (state) => state.orgAdmin.error;

export default orgAdminSlice.reducer;
