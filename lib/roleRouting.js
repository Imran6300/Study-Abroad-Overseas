/**
 * lib/roleRouting.js
 *
 * SINGLE SOURCE OF TRUTH for role → dashboard mapping.
 *
 * Every component that needs to redirect based on role must import
 * getDashboardPath() from here. Never hardcode dashboard URLs elsewhere.
 *
 * Role map:
 *   super_admin  → /dashboard/admin-dashboard
 *   admin        → /dashboard/org-admin        (White-Label Org Admin)
 *   counselor    → /dashboard/counselor-dashboard
 *   editor       → /admin/universities
 *   user         → /dashboard/user
 *   (unknown)    → /login
 */

/**
 * Returns the canonical dashboard path for a given role string.
 * @param {string|null|undefined} role
 * @returns {string}
 */
export function getDashboardPath(role) {
  switch (role) {
    case "super_admin":
      return "/dashboard/admin-dashboard";
    case "admin":
      return "/dashboard/org-admin";
    case "counselor":
      return "/dashboard/counselor-dashboard";
    case "editor":
      return "/admin/universities";
    case "user":
      return "/dashboard/user";
    default:
      return "/login";
  }
}

/**
 * Returns true if the current pathname is allowed for the given role.
 * Used by dashboard layouts to decide whether to redirect.
 *
 * @param {string} role
 * @param {string} pathname
 * @returns {boolean}
 */
export function isAllowedPath(role, pathname) {
  if (!role || !pathname) return false;

  switch (role) {
    case "super_admin":
      return pathname.startsWith("/dashboard/admin-dashboard");
    case "admin":
      return pathname.startsWith("/dashboard/org-admin");
    case "counselor":
      return pathname.startsWith("/dashboard/counselor-dashboard");
    case "editor":
      return pathname.startsWith("/admin");
    case "user":
      return pathname.startsWith("/dashboard/user");
    default:
      return false;
  }
}
