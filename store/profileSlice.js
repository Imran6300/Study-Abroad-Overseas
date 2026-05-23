import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// FETCH PROFILE
export const fetchStudentProfile = createAsyncThunk(
  "profile/fetchStudentProfile",

  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/${userId}`,
        {
          withCredentials: true,
        },
      );

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // PENDING
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // SUCCESS
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })

      // FAILED
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
