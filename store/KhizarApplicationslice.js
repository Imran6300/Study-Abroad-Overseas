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
 *
 * ── Refactor note (no functional change) ────────────────────────────────
 * This file used to create its own local axios instance:
 *   const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, withCredentials: true })
 * — the exact duplication lib/apiClient.js's header comment documents
 * across 15+ slices (same baseURL env var, same withCredentials flag,
 * re-declared per file, no shared place to add e.g. a 401 interceptor).
 * This was also the one slice that didn't even go through the shared
 * `createApiThunk` try/catch/rejectWithValue factory that the other
 * migrated slices use — every thunk below hand-rolled that boilerplate.
 *
 * Both are swapped for the existing app/lib/apiClient.js instance and
 * app/lib/createApiThunk.js factory. Same base URL, same
 * withCredentials:true, same relative paths, same fulfilled payload shape
 * per thunk (see `select`), same rejected payload (a string message, same
 * fallback text as before). Reducers/initialState/selectors are untouched.
 */

import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../lib/apiClient";
import { createApiThunk } from "../lib/createApiThunk";

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * GET /api/khizar-applications/stats
 * Returns: { total, offersReceived, visaProcessing, visaApproved, enrolled, uniqueUniversities }
 */
export const fetchKhizarStats = createApiThunk(
  "khizarApplications/fetchStats",
  () => apiClient.get("/api/khizar-applications/stats"),
  { select: (data) => data.data, fallbackError: "Failed to fetch stats" },
);

/**
 * GET /api/khizar-applications/students
 * Returns counselor's students list for "New Application" dropdown.
 * Sourced from the counselor's Leads (same records as the main Students
 * table), so every student the counselor has added shows up here whether
 * or not they've created their own account yet.
 * Shape: [{ _id, name, email, phone, isRegistered, user }]
 */
export const fetchKhizarStudents = createApiThunk(
  "khizarApplications/fetchStudents",
  () => apiClient.get("/api/khizar-applications/students"),
  { select: (data) => data.data, fallbackError: "Failed to fetch students" },
);

/**
 * GET /api/khizar-applications
 * Query params: page, limit, status, counselorId
 * Returns: { data: [], pagination: { total, page, limit, totalPages } }
 */
export const fetchKhizarApplications = createApiThunk(
  "khizarApplications/fetchList",
  (params = {}) => apiClient.get("/api/khizar-applications", { params }),
  { fallbackError: "Failed to fetch applications" },
);

/**
 * GET /api/khizar-applications/:id
 * Returns single application (with statusHistory, populated student + counselor)
 */
export const fetchKhizarApplicationById = createApiThunk(
  "khizarApplications/fetchById",
  (id) => apiClient.get(`/api/khizar-applications/${id}`),
  { select: (data) => data.data, fallbackError: "Failed to fetch application" },
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
export const createKhizarApplication = createApiThunk(
  "khizarApplications/create",
  (payload) => apiClient.post("/api/khizar-applications", payload),
  {
    select: (data) => data.data,
    fallbackError: "Failed to create application",
  },
);

/**
 * PATCH /api/khizar-applications/:id/status
 * Body: { status, note?, internalNote? }
 * Admin / super_admin only.
 */
export const updateKhizarStatus = createApiThunk(
  "khizarApplications/updateStatus",
  ({ id, status, note, internalNote }) =>
    apiClient.patch(`/api/khizar-applications/${id}/status`, {
      status,
      note,
      internalNote,
    }),
  { select: (data) => data.data, fallbackError: "Failed to update status" },
);

/**
 * DELETE /api/khizar-applications/:id
 * Soft-delete. Admin / super_admin only.
 */
export const deleteKhizarApplication = createApiThunk(
  "khizarApplications/delete",
  (id) => apiClient.delete(`/api/khizar-applications/${id}`),
  { select: (_data, id) => id, fallbackError: "Failed to delete application" },
);

/**
 * POST /api/khizar-applications/upload
 * Multipart form: file + folder
 * Returns: { fileName, supabasePath }
 */
export const uploadKhizarDocument = createApiThunk(
  "khizarApplications/uploadDocument",
  ({ file, folder = "khizar-docs" }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return apiClient.post("/api/khizar-applications/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  { select: (data) => data.data, fallbackError: "Failed to upload document" },
);

/**
 * GET /api/khizar-applications/:applicationId/document/:documentIndex
 * Returns: { url: signedUrl }
 */
export const getDocumentUrl = createApiThunk(
  "khizarApplications/getDocumentUrl",
  ({ applicationId, documentIndex }) =>
    apiClient.get(
      `/api/khizar-applications/${applicationId}/document/${documentIndex}`,
    ),
  {
    select: (data, { applicationId, documentIndex }) => ({
      applicationId,
      documentIndex,
      url: data.url,
    }),
    fallbackError: "Failed to get document URL",
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
