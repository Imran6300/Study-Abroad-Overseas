// lib/auth.js  — Frontend-only helpers (ESM)
// Used ONLY in React/Next.js components for UI-level role gating.
// NEVER used for real access control — that lives in middleware/auth.js on the server.

/**
 * Returns true if the provided user object (from Redux auth store)
 * has an admin-level role.
 *
 * Usage in a component:
 *   const { user } = useSelector((state) => state.auth);
 *   if (isAdminUser(user)) { ... }
 *
 * @param {object|null} user - the user object from state.auth.user
 * @returns {boolean}
 */
export function isAdminUser(user) {
  if (!user) return false;
  return ["admin", "super_admin"].includes(user.role);
}

/**
 * Returns true if the user has counselor-level or higher access.
 * @param {object|null} user
 * @returns {boolean}
 */
export function isCounselorOrAbove(user) {
  if (!user) return false;
  return ["counselor", "admin", "super_admin"].includes(user.role);
}

/**
 * Returns true if the user has the exact role provided.
 * @param {object|null} user
 * @param {string} role
 * @returns {boolean}
 */
export function hasRole(user, role) {
  if (!user) return false;
  return user.role === role;
}

/**
 * @deprecated Use isAdminUser(user) with user from Redux store instead.
 * This function is kept only for backward compatibility and always returns false.
 */
export function isAdmin() {
  if (typeof window === "undefined") return false;
  console.warn(
    "[auth.js] isAdmin() is deprecated and always returns false. " +
      "Use isAdminUser(user) with user from useSelector(state => state.auth.user).",
  );
  return false;
}
