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

  useEffect(() => {
    if (!authChecked) return;

    // 🚫 Admin should never access "/"
    if (user?.role === "admin") {
      router.replace("/dashboard/admin-dashboard");
    }
  }, [authChecked, user, router]);

  // ⛔ Wait until auth check is complete
  if (!authChecked) {
    return null;
  }
  
    if (user?.role === "admin") {
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
