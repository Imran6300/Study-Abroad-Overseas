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

export const uploadDeadlineDocumentAsync = createAsyncThunk(
  "deadline/uploadDocument",

  async ({ id, file }, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("document", file);

      const response = await axios.patch(
        `${BACKEND_URL}/user/my-deadline/${id}/upload-doc`,
        formData,
        {
          withCredentials: true,

          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Upload failed",
      );
    }
  },
);

export const deleteDeadlineDocumentAsync = createAsyncThunk(
  "deadline/deleteDocument",

  async (id, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/user/my-deadline/${id}/delete-doc`,
        {},
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete failed",
      );
    }
  },
);

export const fetchStudentDeadlines = createAsyncThunk(
  "deadline/fetchStudentDeadlines",

  async (studentId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/admin/deadlines/${studentId}`,
        {
          withCredentials: true,
        },
      );

      return response.data.deadlines;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch student deadlines",
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
  studentDeadlines: [],
  loading: false,
  error: null,
};

const deadlineSlice = createSlice({
  name: "deadline",

  initialState,

  reducers: {
    resetDeadlines: (state) => {
      state.studentDeadlines = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(uploadDeadlineDocumentAsync.pending, (state) => {
        state.loading = true;
      })

      .addCase(uploadDeadlineDocumentAsync.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(uploadDeadlineDocumentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markDeadlineCompleteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStudentDeadlines.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchStudentDeadlines.fulfilled, (state, action) => {
        state.loading = false;

        state.studentDeadlines = action.payload;
      })

      .addCase(fetchStudentDeadlines.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

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

      .addCase(deleteDeadlineDocumentAsync.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(markDeadlineCompleteAsync.pending, (state) => {
        state.loading = true;
      })

      .addCase(markDeadlineCompleteAsync.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { resetDeadlines } = deadlineSlice.actions;

export default deadlineSlice.reducer;
