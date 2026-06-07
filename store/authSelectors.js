export const selectAuthUser = (state) => state.auth.user;
export const selectAuthChecked = (state) => state.auth.authChecked;

export const selectIsCounselorStudent = (state) =>
  Boolean(state.auth.user?.counselorOwner);

export const selectIsPublicBrandingHidden = (state) =>
  state.auth.authChecked && Boolean(state.auth.user?.counselorOwner);
