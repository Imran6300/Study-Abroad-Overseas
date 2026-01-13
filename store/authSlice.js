import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
  authChecked: false
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
      state.isLoggedIn = true;
      state.user = action.payload;
      state.authChecked = true
    },
    authFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true

    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.authChecked = true

    },
  },
});

export const { authStart, authSuccess, authFail, logout } = authSlice.actions;
export default authSlice.reducer;
