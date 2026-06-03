"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/dashboard/user/layout.jsx
//
// WHAT THIS DOES:
//   1. Guards the route (redirect to /login if not authenticated)
//   2. Detects if the student belongs to a counselor (user.counselorOwner)
//   3. If yes → dispatches fetchCounselorBranding(counselorOwner) from Redux
//      which hits GET /api/branding/:counselorId and loads colors/logo/name
//   4. Injects the resolved brand colors as CSS variables on the root element
//      so EVERY child component can use var(--brand-primary) etc.
//   5. Joins the Socket.IO room for real-time notifications
//   6. Renders branded sidebar + branded footer
//
// FIX: counselorOwner is a Mongoose ObjectId. When passed to Redux it may be
// an object or string depending on how the auth response serializes it.
// We now coerce it to string with String() to ensure the URL is clean.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import Header from "@/components/Header/nav-bar";
import BrandedSidebar from "@/components/userdashboard/DashboardSidebar";
import BrandedFooter from "@/components/userdashboard/BrandedFooter";

import {
  fetchCounselorBranding,
  selectActiveBranding,
  selectBrandingFetched,
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
    if (authChecked && !user) {
      router.replace("/login");
    }
  }, [authChecked, user, router]);

  // ── 2. Fetch counselor branding when user is confirmed ───────────────────
  useEffect(() => {
    if (!user) return;

    if (user.counselorOwner) {
      // FIX: Coerce counselorOwner to string in case it's a Mongo ObjectId object.
      // The URL /api/branding/:counselorId requires a plain string.
      const counselorId = String(user.counselorOwner);
      dispatch(fetchCounselorBranding(counselorId));
    }
    // If no counselorOwner, the slice keeps DEFAULT_BRANDING — no fetch needed
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

    // Cleanup: reset to defaults on unmount
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

  if (!user) return null;

  // ── Show a brief loading state while branding fetch is in-flight ──────────
  // This prevents a flash of default colors before counselor branding loads.
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
