import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMyLead = createAsyncThunk(
  "lead/fetchMyLead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/me`,
        { credentials: "include" },
      );

      if (!res.ok) {
        return rejectWithValue("Failed to fetch lead");
      }

      const data = await res.json();
      return data.lead;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
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
