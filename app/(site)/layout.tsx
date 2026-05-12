"use client";

import NavBar from "@/components/Header/nav-bar";
import Footer from "@/components/Footer/Footer";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { user, authChecked } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const role = user?.role;

  const staffRoles = ["admin", "super_admin", "editor", "counselor"];
  const isStaff = staffRoles.includes(role);

  useEffect(() => {
    if (!authChecked) return;

    if (!isStaff) return;

    // 🔥 Role-based redirect
    if (role === "admin" || role === "super_admin") {
      router.replace("/dashboard/admin-dashboard");
    } else if (role === "counselor") {
      router.replace("/dashboard/counselor-dashboard");
    } else if (role === "editor") {
      router.replace("/admin/universities");
    }
  }, [authChecked, isStaff, role, router]);

  // ⛔ Block rendering until auth check is complete
  if (!authChecked) {
    return null;
  }

  // ⛔ Prevent staff flash on "/"
  if (isStaff) {
    return null;
  }

  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
