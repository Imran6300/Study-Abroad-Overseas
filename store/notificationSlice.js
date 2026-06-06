// store/notificationSlice.js
// ─────────────────────────────────────────────────────────────────────────────
// Manages notifications for BOTH student and counselor dashboards.
//
// Student  → hits  GET /user/notifications
// Counselor → hits GET /api/counselor/notifications
//
// Real-time updates arrive via Socket.IO and are handled by the header
// components directly (they call addNotification / setUnreadCount actions).
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC THUNKS — Student
// ─────────────────────────────────────────────────────────────────────────────

export const fetchStudentNotifications = createAsyncThunk(
  "notifications/fetchStudent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/user/notifications`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json(); // { success, notifications, unreadCount }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const markStudentNotifRead = createAsyncThunk(
  "notifications/markStudentRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/user/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { id, ...(await res.json()) };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const markAllStudentNotifsRead = createAsyncThunk(
  "notifications/markAllStudentRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/user/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteStudentNotif = createAsyncThunk(
  "notifications/deleteStudent",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/user/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { id, ...(await res.json()) };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC THUNKS — Counselor
// ─────────────────────────────────────────────────────────────────────────────

export const fetchCounselorNotifications = createAsyncThunk(
  "notifications/fetchCounselor",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/api/counselor/notifications`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const markCounselorNotifRead = createAsyncThunk(
  "notifications/markCounselorRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${BASE}/api/counselor/notifications/${id}/read`,
        { method: "PATCH", credentials: "include" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { id, ...(await res.json()) };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const markAllCounselorNotifsRead = createAsyncThunk(
  "notifications/markAllCounselorRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/api/counselor/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteCounselorNotif = createAsyncThunk(
  "notifications/deleteCounselor",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/api/counselor/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { id, ...(await res.json()) };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    // Student
    studentNotifs: [],
    studentUnread: 0,
    studentLoading: false,

    // Counselor
    counselorNotifs: [],
    counselorUnread: 0,
    counselorLoading: false,

    error: null,
  },
  reducers: {
    // Called by socket "new-notification" event (student)
    addStudentNotification(state, action) {
      state.studentNotifs.unshift(action.payload);
      state.studentUnread += 1;
    },
    // Called by socket "notification-count" event (student)
    setStudentUnreadCount(state, action) {
      state.studentUnread = action.payload;
    },

    // Called by socket "counselor-new-notification" event
    addCounselorNotification(state, action) {
      state.counselorNotifs.unshift(action.payload);
      state.counselorUnread += 1;
    },
    // Called by socket "counselor-notification-count" event
    setCounselorUnreadCount(state, action) {
      state.counselorUnread = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch Student ─────────────────────────────────────────────────────
    builder
      .addCase(fetchStudentNotifications.pending, (state) => {
        state.studentLoading = true;
      })
      .addCase(fetchStudentNotifications.fulfilled, (state, action) => {
        state.studentLoading = false;
        state.studentNotifs = action.payload.notifications || [];
        state.studentUnread = action.payload.unreadCount || 0;
      })
      .addCase(fetchStudentNotifications.rejected, (state, action) => {
        state.studentLoading = false;
        state.error = action.payload;
      });

    // ── Mark Student One Read ─────────────────────────────────────────────
    builder.addCase(markStudentNotifRead.fulfilled, (state, action) => {
      const notif = state.studentNotifs.find(
        (n) => n._id === action.payload.id,
      );
      if (notif) notif.isRead = true;
      state.studentUnread = action.payload.unreadCount;
    });

    // ── Mark All Student Read ─────────────────────────────────────────────
    builder.addCase(markAllStudentNotifsRead.fulfilled, (state) => {
      state.studentNotifs.forEach((n) => (n.isRead = true));
      state.studentUnread = 0;
    });

    // ── Delete Student ────────────────────────────────────────────────────
    builder.addCase(deleteStudentNotif.fulfilled, (state, action) => {
      state.studentNotifs = state.studentNotifs.filter(
        (n) => n._id !== action.payload.id,
      );
      state.studentUnread = action.payload.unreadCount;
    });

    // ── Fetch Counselor ───────────────────────────────────────────────────
    builder
      .addCase(fetchCounselorNotifications.pending, (state) => {
        state.counselorLoading = true;
      })
      .addCase(fetchCounselorNotifications.fulfilled, (state, action) => {
        state.counselorLoading = false;
        state.counselorNotifs = action.payload.notifications || [];
        state.counselorUnread = action.payload.unreadCount || 0;
      })
      .addCase(fetchCounselorNotifications.rejected, (state, action) => {
        state.counselorLoading = false;
        state.error = action.payload;
      });

    // ── Mark Counselor One Read ───────────────────────────────────────────
    builder.addCase(markCounselorNotifRead.fulfilled, (state, action) => {
      const notif = state.counselorNotifs.find(
        (n) => n._id === action.payload.id,
      );
      if (notif) notif.isRead = true;
      state.counselorUnread = action.payload.unreadCount;
    });

    // ── Mark All Counselor Read ───────────────────────────────────────────
    builder.addCase(markAllCounselorNotifsRead.fulfilled, (state) => {
      state.counselorNotifs.forEach((n) => (n.isRead = true));
      state.counselorUnread = 0;
    });

    // ── Delete Counselor ──────────────────────────────────────────────────
    builder.addCase(deleteCounselorNotif.fulfilled, (state, action) => {
      state.counselorNotifs = state.counselorNotifs.filter(
        (n) => n._id !== action.payload.id,
      );
      state.counselorUnread = action.payload.unreadCount;
    });
  },
});

export const {
  addStudentNotification,
  setStudentUnreadCount,
  addCounselorNotification,
  setCounselorUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
