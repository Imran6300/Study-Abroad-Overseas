import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  applications: [],
  loading: false,
  saving: false,
  error: null,
};

// FETCH APPLICATIONS
export const fetchStudentApplications = createAsyncThunk(
  "applications/fetchStudentApplications",

  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/applications/${userId}`,
        {
          withCredentials: true,
        },
      );

      return response.data.applications;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

export const createStudentApplication = createAsyncThunk(
  "applications/createStudentApplication",

  async ({ studentId, payload }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/applications`,
        {
          ...payload,
          userId: studentId,
        },
        {
          withCredentials: true,
        },
      );

      return response.data.application;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create application",
      );
    }
  },
);

export const updateStudentApplication = createAsyncThunk(
  "applications/updateStudentApplication",

  async ({ applicationId, payload }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/applications/${applicationId}`,
        payload,
        {
          withCredentials: true,
        },
      );

      return response.data.application;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update application",
      );
    }
  },
);

export const deleteStudentApplication = createAsyncThunk(
  "applications/deleteStudentApplication",

  async (applicationId, thunkAPI) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/applications/${applicationId}`,
        {
          withCredentials: true,
        },
      );

      return applicationId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete application",
      );
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",

  async ({ applicationId, status }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/applications/${applicationId}/status`,
        { status },
        {
          withCredentials: true,
        },
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

      .addCase(updateStudentApplication.pending, (state) => {
        state.saving = true;
      })

      .addCase(updateStudentApplication.fulfilled, (state, action) => {
        state.saving = false;

        state.applications = state.applications.map((app) =>
          app._id === action.payload._id ? action.payload : app,
        );
      })

      .addCase(updateStudentApplication.rejected, (state, action) => {
        state.saving = false;

        state.error = action.payload;
      })

      .addCase(createStudentApplication.pending, (state) => {
        state.saving = true;
      })

      .addCase(createStudentApplication.fulfilled, (state, action) => {
        state.saving = false;

        state.applications.unshift(action.payload);
      })

      .addCase(createStudentApplication.rejected, (state, action) => {
        state.saving = false;

        state.error = action.payload;
      })

      .addCase(deleteStudentApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app._id !== action.payload,
        );
      })

      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.applications = state.applications.map((app) =>
          app._id === action.payload._id ? action.payload : app,
        );
      })

      // PENDING
      .addCase(fetchStudentApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // SUCCESS
      .addCase(fetchStudentApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })

      // FAILED
      .addCase(fetchStudentApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetApplications } = applicationSlice.actions;

export default applicationSlice.reducer;
