import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ================= FETCH DEADLINES =================

export const fetchMyDeadlines = createAsyncThunk(
  "deadline/fetchMyDeadlines",

  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/my-deadlines`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch deadlines",
      );
    }
  },
);

// ================= MARK COMPLETE =================

export const markDeadlineCompleteAsync = createAsyncThunk(
  "deadline/markComplete",

  async (id, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/user/my-deadline/${id}/mark-complete`,
        {},
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark complete",
      );
    }
  },
);

const initialState = {
  deadlines: {
    upcoming: [],
    overdue: [],
    completed: [],
    counts: {},
  },
  loading: false,
  error: null,
};

const deadlineSlice = createSlice({
  name: "deadline",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= FETCH =================

      .addCase(fetchMyDeadlines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyDeadlines.fulfilled, (state, action) => {
        state.loading = false;

        state.deadlines = action.payload?.deadlines || {
          upcoming: [],
          overdue: [],
          completed: [],
          counts: {},
        };
      })

      .addCase(fetchMyDeadlines.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      // ================= MARK COMPLETE =================

      .addCase(markDeadlineCompleteAsync.fulfilled, (state, action) => {
        const updatedDeadline = action.payload?.deadline;

        state.deadlines = state.deadlines.map((item) =>
          item._id === updatedDeadline._id ? updatedDeadline : item,
        );
      });
  },
});

export default deadlineSlice.reducer;
