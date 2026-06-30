// store/index.js  —  UPDATED: registers orgAdminReducer
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import universityReducer from "./universitySlice";
import courseReducer from "./courseSlice";
import leadReducer from "./leadSlice";
import brandingReducer from "./brandingSlice";

// dashboard slices
import applicationReducer from "./applicationSlice";
import profileReducer from "./profileSlice";
import deadlineReducer from "./deadlineSlice";
import visaReducer from "./visaSlice";
import counselorReducer from "./counselorSlice";
import khizarApplicationsReducer from "./KhizarApplicationslice";
import notificationReducer from "./notificationSlice";

// NEW: White-Label Admin (Organization) slice
import orgAdminReducer from "./orgAdminSlice";

// NEW: Partner Subscription Engine slice
import partnerSubscriptionReducer from "./partnerSubscriptionSlice";

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
    branding: brandingReducer,
    counselor: counselorReducer,
    khizarApplications: khizarApplicationsReducer,
    notifications: notificationReducer,
    // NEW
    orgAdmin: orgAdminReducer,
    // NEW: Partner Subscription Engine
    partnerSubscription: partnerSubscriptionReducer,
  },
});
