/**
 * store/authSelectors.js  —  UPDATED: White-Label Org role selectors
 *
 * NEW SELECTORS:
 *   selectIsOrgCounselor   — true when counselor belongs to a White-Label Org
 *   selectIsOrgAdmin       — true when user is a White-Label Admin (role === "admin")
 *   selectIsIndependentCounselor — true when counselor has no org affiliation
 *   selectAdminId          — the adminId of an org counselor (or null)
 *
 * All existing selectors are retained unchanged.
 */

// ─── Existing selectors (unchanged) ──────────────────────────────────────────

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthChecked = (state) => state.auth.authChecked;

export const selectIsCounselorStudent = (state) =>
  Boolean(state.auth.user?.counselorOwner);

export const selectIsPublicBrandingHidden = (state) =>
  state.auth.authChecked && Boolean(state.auth.user?.counselorOwner);

// ─── New role selectors ───────────────────────────────────────────────────────

/**
 * True when the logged-in counselor belongs to a White-Label Org.
 * Drives conditional rendering: hide pricing/billing, show org branding.
 */
export const selectIsOrgCounselor = (state) =>
  state.auth.user?.role === "counselor" && Boolean(state.auth.user?.adminId);

/**
 * True when the logged-in user is a White-Label Admin (org owner).
 * Drives access to the /dashboard/org-admin route.
 */
export const selectIsOrgAdmin = (state) => state.auth.user?.role === "admin";

/**
 * True when the counselor is NOT affiliated with any org.
 * Independent counselors see the SaaS/billing/pricing UI.
 */
export const selectIsIndependentCounselor = (state) =>
  state.auth.user?.role === "counselor" && !state.auth.user?.adminId;

/**
 * The adminId of the org this counselor belongs to.
 * null for independent counselors and all other roles.
 */
export const selectAdminId = (state) => state.auth.user?.adminId ?? null;

/**
 * Convenience: the role string of the logged-in user.
 */
export const selectUserRole = (state) => state.auth.user?.role ?? null;
