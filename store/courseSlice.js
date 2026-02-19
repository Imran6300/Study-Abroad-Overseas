import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { env } from "process";

/* ===============================
   1️⃣ FETCH ALL COURSES
================================= */
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await res.json();
      return data.courses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/* ===============================
   2️⃣ FETCH SINGLE COURSE BY SLUG
================================= */
export const fetchCourseBySlug = createAsyncThunk(
  "courses/fetchCourseBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${slug}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch course details");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/* ===============================
   3️⃣ SLICE
================================= */
const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    selectedCourse: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===============================
         FETCH ALL COURSES
      ================================ */
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         FETCH SINGLE COURSE
      ================================ */
      .addCase(fetchCourseBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;
