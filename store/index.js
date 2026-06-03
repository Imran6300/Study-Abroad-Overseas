// store/index.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import universityReducer from "./universitySlice";
import courseReducer from "./courseSlice";
import leadReducer from "./leadSlice";
import brandingReducer from "./brandingSlice"; // ← NEW

// dashboard slices
import applicationReducer from "./applicationSlice";
import profileReducer from "./profileSlice";
import deadlineReducer from "./deadlineSlice";
import visaReducer from "./visaSlice";
import counselorReducer from "./counselorSlice";
import khizarApplicationsReducer from "./KhizarApplicationslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    universities: universityReducer,
    courses: courseReducer,
    lead: leadReducer,
    deadline: deadlineReducer,
    visa: visaReducer,
    profile: profileReducer,
    applications: applicationReducer,
    branding: brandingReducer, // ← NEW — counselor branding applied to student dashboard
    counselor: counselorReducer,
    khizarApplications: khizarApplicationsReducer,
  },
});
