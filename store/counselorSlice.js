import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─────────────────────────────────────────────────────────────
// FETCH COUNSELOR STUDENTS
// GET /api/counselor/students
// ─────────────────────────────────────────────────────────────
export const fetchCounselorStudents = createAsyncThunk(
  "counselor/fetchCounselorStudents",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API}/api/counselor/students?limit=100`,
        {
          withCredentials: true,
        },
      );

      return (response.data.data || []).map((lead) => ({
        id: lead.user || null,
        leadId: lead._id,

        name: lead.name,
        email: lead.email,
        phone: lead.phone,

        target: lead.preferredCountry,
        status: lead.counselorStage,

        counselor: lead.assignedCounselor || "Unassigned",

        created: lead.createdAt,

        profilePicture: lead.profilePicture,

        isRegistered: lead.isRegistered,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch counselor students",
      );
    }
  },
);

// ─────────────────────────────────────────────────────────────
// FETCH APPLICATION BY STUDENT ID
// GET /api/admin/applications/:id
// ─────────────────────────────────────────────────────────────
export const fetchApplicationById = createAsyncThunk(
  "counselor/fetchApplicationById",
  async (studentId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API}/api/admin/applications/${studentId}`,
        {
          withCredentials: true,
        },
      );

      return {
        applications: response.data.applications || [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch application",
      );
    }
  },
);

const initialState = {
  students: [],

  selectedStudent: null,

  selectedApplication: null,

  loadingStudents: false,

  loadingApplication: false,

  error: null,
};

const counselorSlice = createSlice({
  name: "counselor",

  initialState,

  reducers: {
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },

    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },

    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
    },

    resetCounselorState: (state) => {
      state.students = [];
      state.selectedStudent = null;
      state.selectedApplication = null;
      state.loadingStudents = false;
      state.loadingApplication = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ─────────────────────────────
      // FETCH COUNSELOR STUDENTS
      // ─────────────────────────────
      .addCase(fetchCounselorStudents.pending, (state) => {
        state.loadingStudents = true;
        state.error = null;
      })

      .addCase(fetchCounselorStudents.fulfilled, (state, action) => {
        state.loadingStudents = false;
        state.students = action.payload || [];
      })

      .addCase(fetchCounselorStudents.rejected, (state, action) => {
        state.loadingStudents = false;
        state.error = action.payload;
      })

      // ─────────────────────────────
      // FETCH APPLICATION
      // ─────────────────────────────
      .addCase(fetchApplicationById.pending, (state) => {
        state.loadingApplication = true;
        state.error = null;
      })

      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loadingApplication = false;
        state.selectedApplication = action.payload;
      })

      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loadingApplication = false;
        state.error = action.payload;
        state.selectedApplication = null;
      });
  },
});

export const {
  setSelectedStudent,
  clearSelectedStudent,
  clearSelectedApplication,
  resetCounselorState,
} = counselorSlice.actions;

export default counselorSlice.reducer;
