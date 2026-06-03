/**
 * khizarApplicationSlice.js
 *
 * Redux slice for Khizar-managed applications.
 *
 * API base: /api/khizar-applications
 *
 * Thunks:
 *  - fetchKhizarStats            GET /stats
 *  - fetchKhizarStudents         GET /students
 *  - fetchKhizarApplications     GET /  (paginated + filtered)
 *  - fetchKhizarApplicationById  GET /:id
 *  - createKhizarApplication     POST /
 *  - updateKhizarStatus          PATCH /:id/status  (admin only)
 *  - deleteKhizarApplication     DELETE /:id        (admin only)
 *  - uploadKhizarDocument        POST /upload
 *  - getDocumentUrl              GET /:applicationId/document/:documentIndex
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  withCredentials: true,
});

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * GET /api/khizar-applications/stats
 * Returns: { total, offersReceived, visaProcessing, visaApproved, enrolled, uniqueUniversities }
 */
export const fetchKhizarStats = createAsyncThunk(
  "khizarApplications/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/khizar-applications/stats");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);

/**
 * GET /api/khizar-applications/students
 * Returns counselor's students list for "New Application" dropdown.
 * Shape: [{ _id, name, email }]
 */
export const fetchKhizarStudents = createAsyncThunk(
  "khizarApplications/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/khizar-applications/students");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch students",
      );
    }
  },
);

/**
 * GET /api/khizar-applications
 * Query params: page, limit, status, counselorId
 * Returns: { data: [], pagination: { total, page, limit, totalPages } }
 */
export const fetchKhizarApplications = createAsyncThunk(
  "khizarApplications/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/khizar-applications", { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

/**
 * GET /api/khizar-applications/:id
 * Returns single application (with statusHistory, populated student + counselor)
 */
export const fetchKhizarApplicationById = createAsyncThunk(
  "khizarApplications/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/khizar-applications/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch application",
      );
    }
  },
);

/**
 * POST /api/khizar-applications
 * Body shape matches KhizarApplication model exactly:
 * {
 *   studentId, universityName, country, course, intake, studyLevel,
 *   studentInfo: { studentName, email, phone, dob, gender, nationality, passportNo, currentCity },
 *   academicInfo: { qualification, institution, graduationYear, cgpa, backlogs, educationGap },
 *   testScores: { ielts, toefl, pte, duolingo, gre, gmat },
 *   preferences: { preferredCountry, preferredUniversities, preferredCourse, preferredIntake,
 *                  educationLevel, budgetRange, loanRequired, sponsorAvailable, serviceType },
 *   counselorData: { counselorNotes, studentWeaknesses, visaHistory, remarks },
 *   documents: [{ type, fileName, supabasePath }]
 * }
 */
export const createKhizarApplication = createAsyncThunk(
  "khizarApplications/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/khizar-applications", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create application",
      );
    }
  },
);

/**
 * PATCH /api/khizar-applications/:id/status
 * Body: { status, note?, internalNote? }
 * Admin / super_admin only.
 */
export const updateKhizarStatus = createAsyncThunk(
  "khizarApplications/updateStatus",
  async ({ id, status, note, internalNote }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/api/khizar-applications/${id}/status`,
        { status, note, internalNote },
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status",
      );
    }
  },
);

/**
 * DELETE /api/khizar-applications/:id
 * Soft-delete. Admin / super_admin only.
 */
export const deleteKhizarApplication = createAsyncThunk(
  "khizarApplications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/khizar-applications/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete application",
      );
    }
  },
);

/**
 * POST /api/khizar-applications/upload
 * Multipart form: file + folder
 * Returns: { fileName, supabasePath }
 */
export const uploadKhizarDocument = createAsyncThunk(
  "khizarApplications/uploadDocument",
  async ({ file, folder = "khizar-docs" }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const { data } = await api.post(
        "/api/khizar-applications/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return data.data; // { fileName, supabasePath }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to upload document",
      );
    }
  },
);

/**
 * GET /api/khizar-applications/:applicationId/document/:documentIndex
 * Returns: { url: signedUrl }
 */
export const getDocumentUrl = createAsyncThunk(
  "khizarApplications/getDocumentUrl",
  async ({ applicationId, documentIndex }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/khizar-applications/${applicationId}/document/${documentIndex}`,
      );
      return { applicationId, documentIndex, url: data.url };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get document URL",
      );
    }
  },
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  // Stats card data
  stats: {
    total: 0,
    offersReceived: 0,
    visaProcessing: 0,
    visaApproved: 0,
    enrolled: 0,
    uniqueUniversities: 0,
  },
  statsLoading: false,
  statsError: null,

  // Students dropdown for New Application form
  students: [],
  studentsLoading: false,
  studentsError: null,

  // Paginated application list
  applications: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  listLoading: false,
  listError: null,

  // Single application detail
  selectedApplication: null,
  detailLoading: false,
  detailError: null,

  // Create / submit
  createLoading: false,
  createError: null,
  createSuccess: false,
  lastCreated: null, // the newly created application

  // Status update (admin)
  statusUpdateLoading: false,
  statusUpdateError: null,

  // Delete (admin)
  deleteLoading: false,
  deleteError: null,

  // Document upload — track per-slot: { [slotKey]: { loading, error, fileName, supabasePath } }
  documentUploads: {},

  // Document signed URLs cache: { [`${appId}-${index}`]: url }
  documentUrls: {},
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const khizarApplicationSlice = createSlice({
  name: "khizarApplications",
  initialState,
  reducers: {
    /** Clear create success flag (call after toast shown) */
    clearCreateSuccess(state) {
      state.createSuccess = false;
      state.createError = null;
      state.lastCreated = null;
    },
    /** Clear detail */
    clearSelectedApplication(state) {
      state.selectedApplication = null;
      state.detailError = null;
    },
    /** Reset document upload state for a slot */
    resetDocumentUpload(state, action) {
      const key = action.payload;
      delete state.documentUploads[key];
    },
    /** Reset all document uploads */
    resetAllDocumentUploads(state) {
      state.documentUploads = {};
    },
    /** Clear errors */
    clearErrors(state) {
      state.listError = null;
      state.createError = null;
      state.statusUpdateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    // ── Stats ────────────────────────────────────────────────────────────────
    builder
      .addCase(fetchKhizarStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchKhizarStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchKhizarStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });

    // ── Students ─────────────────────────────────────────────────────────────
    builder
      .addCase(fetchKhizarStudents.pending, (state) => {
        state.studentsLoading = true;
        state.studentsError = null;
      })
      .addCase(fetchKhizarStudents.fulfilled, (state, action) => {
        state.studentsLoading = false;
        state.students = action.payload;
      })
      .addCase(fetchKhizarStudents.rejected, (state, action) => {
        state.studentsLoading = false;
        state.studentsError = action.payload;
      });

    // ── List Applications ─────────────────────────────────────────────────────
    builder
      .addCase(fetchKhizarApplications.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchKhizarApplications.fulfilled, (state, action) => {
        state.listLoading = false;
        state.applications = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchKhizarApplications.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      });

    // ── Single Application ────────────────────────────────────────────────────
    builder
      .addCase(fetchKhizarApplicationById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchKhizarApplicationById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedApplication = action.payload;
      })
      .addCase(fetchKhizarApplicationById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });

    // ── Create Application ────────────────────────────────────────────────────
    builder
      .addCase(createKhizarApplication.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createKhizarApplication.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.lastCreated = action.payload;
        // Prepend to list if already loaded
        if (state.applications.length > 0) {
          state.applications.unshift(action.payload);
          state.pagination.total += 1;
        }
        // Bump stats total
        state.stats.total += 1;
      })
      .addCase(createKhizarApplication.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      });

    // ── Update Status ─────────────────────────────────────────────────────────
    builder
      .addCase(updateKhizarStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.statusUpdateError = null;
      })
      .addCase(updateKhizarStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        const updated = action.payload;
        // Update in list
        const idx = state.applications.findIndex((a) => a._id === updated._id);
        if (idx !== -1) state.applications[idx] = updated;
        // Update detail if open
        if (state.selectedApplication?._id === updated._id) {
          state.selectedApplication = updated;
        }
      })
      .addCase(updateKhizarStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = action.payload;
      });

    // ── Delete Application ────────────────────────────────────────────────────
    builder
      .addCase(deleteKhizarApplication.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteKhizarApplication.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.applications = state.applications.filter(
          (a) => a._id !== action.payload,
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.stats.total = Math.max(0, state.stats.total - 1);
      })
      .addCase(deleteKhizarApplication.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });

    // ── Upload Document ───────────────────────────────────────────────────────
    builder
      .addCase(uploadKhizarDocument.pending, (state, action) => {
        const key = action.meta.arg.slotKey || "unknown";
        state.documentUploads[key] = { loading: true, error: null };
      })
      .addCase(uploadKhizarDocument.fulfilled, (state, action) => {
        const key = action.meta.arg.slotKey || "unknown";
        state.documentUploads[key] = {
          loading: false,
          error: null,
          fileName: action.payload.fileName,
          supabasePath: action.payload.supabasePath,
        };
      })
      .addCase(uploadKhizarDocument.rejected, (state, action) => {
        const key = action.meta.arg.slotKey || "unknown";
        state.documentUploads[key] = {
          loading: false,
          error: action.payload,
        };
      });

    // ── Get Document URL ──────────────────────────────────────────────────────
    builder.addCase(getDocumentUrl.fulfilled, (state, action) => {
      const cacheKey = `${action.payload.applicationId}-${action.payload.documentIndex}`;
      state.documentUrls[cacheKey] = action.payload.url;
    });
  },
});

export const {
  clearCreateSuccess,
  clearSelectedApplication,
  resetDocumentUpload,
  resetAllDocumentUploads,
  clearErrors,
} = khizarApplicationSlice.actions;

export default khizarApplicationSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectKhizarStats = (s) => s.khizarApplications.stats;
export const selectKhizarStatsLoading = (s) =>
  s.khizarApplications.statsLoading;
export const selectKhizarStudents = (s) => s.khizarApplications.students;
export const selectKhizarStudentsLoading = (s) =>
  s.khizarApplications.studentsLoading;
export const selectKhizarApplications = (s) =>
  s.khizarApplications.applications;
export const selectKhizarPagination = (s) => s.khizarApplications.pagination;
export const selectKhizarListLoading = (s) => s.khizarApplications.listLoading;
export const selectKhizarListError = (s) => s.khizarApplications.listError;
export const selectKhizarSelectedApplication = (s) =>
  s.khizarApplications.selectedApplication;
export const selectKhizarDetailLoading = (s) =>
  s.khizarApplications.detailLoading;
export const selectKhizarCreateLoading = (s) =>
  s.khizarApplications.createLoading;
export const selectKhizarCreateError = (s) => s.khizarApplications.createError;
export const selectKhizarCreateSuccess = (s) =>
  s.khizarApplications.createSuccess;
export const selectKhizarLastCreated = (s) => s.khizarApplications.lastCreated;
export const selectDocumentUploads = (s) =>
  s.khizarApplications.documentUploads;
export const selectDocumentUrls = (s) => s.khizarApplications.documentUrls;
export const selectKhizarDeleteLoading = (s) =>
  s.khizarApplications.deleteLoading;
export const selectKhizarStatusUpdateLoading = (s) =>
  s.khizarApplications.statusUpdateLoading;
