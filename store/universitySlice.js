import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ================= FETCH UNIVERSITIES ================= */

export const fetchUniversities = createAsyncThunk(
  "universities/fetchUniversities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-universities`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch universities");
      }

      return data.universities; // only return the array
    } catch (error) {
      return rejectWithValue("Network error while fetching universities");
    }
  },
);

/* ================= SLICE ================= */

const universitySlice = createSlice({
  name: "universities",

  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUniversities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      .addCase(fetchUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default universitySlice.reducer;
