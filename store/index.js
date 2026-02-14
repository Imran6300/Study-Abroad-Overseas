import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import universityReducer from "./universitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    universities: universityReducer,
  },
});
