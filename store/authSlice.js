import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,          // null = not logged in
  loading: false,
  error: null,
  authChecked: false,  // have we checked /auth/me ?
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;   // user object from backend
      state.authChecked = true;
    },
    authFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true;
    },
    logout(state) {
      state.user = null;
      state.authChecked = true;
    },
    authChecked(state) {
      state.authChecked = true;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFail,
  logout,
  authChecked,
} = authSlice.actions;

export default authSlice.reducer;
