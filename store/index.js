import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import universityReducer from "./universitySlice";
import courseReducer from "./courseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    universities: universityReducer,
    courses: courseReducer,
  },
});
