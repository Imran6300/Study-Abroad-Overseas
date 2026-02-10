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

  const isAdmin = ["admin", "super_admin"].includes(user?.role);

  useEffect(() => {
    if (!authChecked) return;

    // 🚫 Admin & Super Admin should never access "/"
    if (isAdmin) {
      router.replace("/dashboard/admin-dashboard");
    }
  }, [authChecked, isAdmin, router]);

  // ⛔ Block rendering until auth is known
  if (!authChecked) {
    return null;
  }

  // ⛔ Prevent admin flash
  if (isAdmin) {
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
