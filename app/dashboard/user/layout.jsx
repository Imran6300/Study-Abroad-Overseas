"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/dashboard/user/layout.jsx
//
// Auth guard: only role === "user" can access this area.
// All other roles are redirected to their own dashboard via getDashboardPath().
//
// Also handles:
//   - Counselor branding fetch (for counselor-assigned students)
//   - CSS variable injection for brand colors
//   - Favicon swap (premium feature)
//   - Socket.IO room join for real-time notifications
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/lib/roleRouting";

import Header from "@/components/Header/nav-bar";
import BrandedSidebar from "@/components/userdashboard/DashboardSidebar";
import BrandedFooter from "@/components/userdashboard/BrandedFooter";

import {
  fetchCounselorBranding,
  selectActiveBranding,
  selectBrandingFetched,
  resetBranding,
} from "@/store/brandingSlice";
import { getSocket } from "@/lib/socket";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, authChecked } = useSelector((state) => state.auth);
  const branding = useSelector(selectActiveBranding);

  const brandingFetched = useSelector(selectBrandingFetched);

  const isCounselorStudent = !!user?.counselorOwner;

  // ── 1. Auth guard ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Only role === "user" is allowed here.
    // All other authenticated roles go to their own dashboard.
    if (user.role !== "user") {
      router.replace(getDashboardPath(user.role));
    }
  }, [authChecked, user, router]);

  // ── 2. Fetch counselor branding when user is confirmed ───────────────────
  // IMPORTANT: this must also handle the "no counselor" case. Without the
  // else branch, a plain Khizar Overseas student inherits whatever branding
  // is still sitting in the Redux store from a previous login in the same
  // browser session (e.g. someone logged out of a counselor-branded student
  // account and logged back in as a direct student without a full reload).
  useEffect(() => {
    if (!user) return;

    if (user.counselorOwner) {
      const counselorId = String(user.counselorOwner);
      dispatch(fetchCounselorBranding(counselorId));
    } else {
      dispatch(resetBranding());
    }
  }, [user?.counselorOwner, dispatch]);

  // ── 3. Apply CSS variables to <html> so they cascade everywhere ──────────
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--brand-primary",
      branding.primaryColor || "#22c55e",
    );
    root.style.setProperty("--brand-bg", branding.secondaryColor || "#0A192F");
    root.style.setProperty("--brand-accent", branding.accentColor || "#ffffff");

    return () => {
      root.style.setProperty("--brand-primary", "#22c55e");
      root.style.setProperty("--brand-bg", "#0A192F");
      root.style.setProperty("--brand-accent", "#ffffff");
    };
  }, [branding.primaryColor, branding.secondaryColor, branding.accentColor]);

  // ── 4. Favicon swap (premium feature) ────────────────────────────────────
  useEffect(() => {
    if (!branding.favicon) return;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = branding.favicon;
  }, [branding.favicon]);

  // ── 5. Socket room join ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;
    const socket = getSocket();
    socket.emit("join-dashboard", user._id);
  }, [user?._id]);

  // ── Render guards ─────────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div
        style={{ background: branding.secondaryColor || "#0A192F" }}
        className="min-h-screen flex items-center justify-center text-white"
      >
        Loading…
      </div>
    );
  }

  if (!user || user.role !== "user") return null;

  // ── Show a brief loading state while branding fetch is in-flight ──────────
  if (isCounselorStudent && !brandingFetched) {
    return (
      <div
        style={{ background: "#0A192F" }}
        className="min-h-screen flex items-center justify-center text-white"
      >
        Loading dashboard…
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: branding.secondaryColor || "#0A192F",
        color: branding.accentColor || "#ffffff",
      }}
    >
      {/* Main site nav — hidden for counselor students (they have a branded header) */}
      {!isCounselorStudent && <Header />}

      <div className="flex flex-1">
        {/* Branded sidebar reads from Redux branding state */}
        <BrandedSidebar isCounselorStudent={isCounselorStudent} />

        <main
          className={`flex-1 lg:ml-72 pb-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden ${
            isCounselorStudent ? "pt-6" : "pt-20"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Branded footer */}
      <BrandedFooter />
    </div>
  );
}
