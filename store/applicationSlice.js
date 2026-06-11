import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

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
export const fetchStudentApplications = createAsyncThunk(
  "applications/fetchStudentApplications",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API}/api/admin/applications/${userId}`,
        { withCredentials: true },
      );
      return response.data.applications;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

// ─── Admin/Counselor creates an application for a student ────────────────────
export const createStudentApplication = createAsyncThunk(
  "applications/createStudentApplication",
  async ({ studentId, payload }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API}/api/admin/applications`,
        { ...payload, userId: studentId },
        { withCredentials: true },
      );
      return response.data.application;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create application",
      );
    }
  },
);

// ─── Admin/Counselor updates an application ──────────────────────────────────
export const updateStudentApplication = createAsyncThunk(
  "applications/updateStudentApplication",
  async ({ applicationId, payload }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API}/api/admin/applications/${applicationId}`,
        payload,
        { withCredentials: true },
      );
      return response.data.application;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update application",
      );
    }
  },
);

// ─── Admin/Counselor deletes an application ──────────────────────────────────
export const deleteStudentApplication = createAsyncThunk(
  "applications/deleteStudentApplication",
  async (applicationId, thunkAPI) => {
    try {
      await axios.delete(`${API}/api/admin/applications/${applicationId}`, {
        withCredentials: true,
      });
      return applicationId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete application",
      );
    }
  },
);

// ─── Admin/Counselor updates application status ──────────────────────────────
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ applicationId, payload }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API}/api/admin/applications/${applicationId}`,
        payload,
        { withCredentials: true },
      );
      return response.data.application;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update status",
      );
    }
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
