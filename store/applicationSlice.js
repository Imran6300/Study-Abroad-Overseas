import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  applications: [],
  loading: false,
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

const applicationSlice = createSlice({
  name: "applications",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

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

export default applicationSlice.reducer;
