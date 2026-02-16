import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ================= FETCH COURSES ================= */

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-courses`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch courses");
      }

      return data.courses; // return array
    } catch (error) {
      return rejectWithValue("Network error while fetching courses");
    }
  },
);

/* ================= SLICE ================= */

const courseSlice = createSlice({
  name: "courses",

  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
