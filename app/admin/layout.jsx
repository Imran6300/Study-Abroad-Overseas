"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const roleAccess = {
  editor: [
    "/admin/universities",
    "/admin/courses",
    "/admin/success-stories",
    "/admin/countries",
    "/admin/blog",
  ],
  counselor: [
    "/dashboard/counselor-dashboard",
    "/admin/applications",
    "/admin/visa",
    "/admin/deadlines",
  ],
};

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const role = user.role;

    // Full access roles
    if (role === "admin" || role === "super_admin") {
      return;
    }

    // Check restricted roles
    const allowedRoutes = roleAccess[role];

    if (!allowedRoutes) {
      router.replace("/dashboard/user");
      return;
    }

    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      router.replace("/dashboard/user");
    }
  }, [user, pathname, router]);

  if (!user) return null;

  const role = user.role;

  if (role === "admin" || role === "super_admin") {
    return <>{children}</>;
  }

  const allowedRoutes = roleAccess[role];

  if (!allowedRoutes) return null;

  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!isAllowed) return null;

  return <>{children}</>;
}
