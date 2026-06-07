"use client";

import NavBar from "@/components/Header/nav-bar";
import Footer from "@/components/Footer/Footer";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

import {
  selectIsCounselorStudent,
  selectAuthChecked,
  selectAuthUser,
} from "@/store/authSelectors";

import { selectActiveBranding } from "@/store/brandingSlice";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = useSelector(selectAuthUser);
  const authChecked = useSelector(selectAuthChecked);
  const isCounselorStudent = useSelector(selectIsCounselorStudent);

  const branding = useSelector(selectActiveBranding);

  const router = useRouter();

  const role = user?.role;

  const staffRoles = [
    "admin",
    "super_admin",
    "editor",
    "counselor",
  ];

  const isStaff = staffRoles.includes(role);

  useEffect(() => {
    if (!authChecked) return;
    if (!isStaff) return;

    if (role === "admin" || role === "super_admin") {
      router.replace("/dashboard/admin-dashboard");
    } else if (role === "counselor") {
      router.replace("/dashboard/counselor-dashboard");
    } else if (role === "editor") {
      router.replace("/admin/universities");
    }
  }, [authChecked, isStaff, role, router]);

  // Prevent render until auth check completes
  if (!authChecked) {
    return null;
  }

  // Prevent staff flash
  if (isStaff) {
    return null;
  }

  return (
    <>
      {isCounselorStudent ? (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] border-b backdrop-blur-md"
          style={{
            background:
              branding.secondaryColor || "#0A192F",
            borderColor: `${branding.accentColor || "#ffffff"
              }20`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/dashboard/user"
              className="inline-flex items-center gap-2 font-medium transition-all duration-200 hover:translate-x-[-2px]"
              style={{
                color:
                  branding.accentColor || "#ffffff",
              }}
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <NavBar />
      )}

      {children}

      {!isCounselorStudent && <Footer />}
    </>
  );
}