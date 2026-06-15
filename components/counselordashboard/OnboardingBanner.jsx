"use client";

/**
 * components/counselordashboard/OnboardingBanner.jsx
 *
 * Shown to a counselor on their first 2 logins, then never again.
 *
 * Tracking strategy — localStorage only, zero backend changes:
 *   Key: `ko_onboarding_logins_<userId>`
 *   Value: number of times the banner has been "seen" (incremented on each
 *          fresh mount, not on each page navigation within the session).
 *   Threshold: if count >= 2, banner is permanently hidden for this user.
 *
 * Session-level dismiss (X button):
 *   A separate sessionStorage flag `ko_onboarding_dismissed_<userId>` is set
 *   when the counselor clicks X. This hides the banner for the rest of the
 *   browser session without incrementing the seen count — so if they log out
 *   and back in it still counts as the same login number.
 *
 * The "increment seen" step fires once per authenticated mount:
 *   - Only when authChecked && user && role === counselor
 *   - Only when the persistent count is still < 2
 *   - Guards against React StrictMode double-mount via a ref flag
 */

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  FileCheck,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// ─── Quick-start feature cards shown inside the banner ────────────────────────
const FEATURES = [
  {
    icon: LayoutDashboard,
    color: "from-sky-500 to-indigo-600",
    title: "Dashboard Overview",
    desc: "KPI cards, analytics charts, pipeline funnel and recent activity — all at a glance.",
  },
  {
    icon: GraduationCap,
    color: "from-violet-500 to-purple-600",
    title: "Student Management",
    desc: "Add students, track their stage (lead → enrolled) and manage applications per student.",
  },
  {
    icon: FileCheck,
    color: "from-emerald-500 to-teal-600",
    title: "Khizar Applications",
    desc: "Submit and monitor managed visa applications with document uploads and status timelines.",
  },
  {
    icon: Settings,
    color: "from-amber-500 to-orange-500",
    title: "Settings & Branding",
    desc: "Set your agency logo, brand colors and manage your subscription plan.",
  },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────

function getSeenCount(userId) {
  try {
    return parseInt(
      localStorage.getItem(`ko_onboarding_logins_${userId}`) || "0",
      10,
    );
  } catch {
    return 0;
  }
}

function incrementSeenCount(userId) {
  try {
    const next = getSeenCount(userId) + 1;
    localStorage.setItem(`ko_onboarding_logins_${userId}`, String(next));
    return next;
  } catch {
    return 1;
  }
}

function isDismissedThisSession(userId) {
  try {
    return sessionStorage.getItem(`ko_onboarding_dismissed_${userId}`) === "1";
  } catch {
    return false;
  }
}

function dismissThisSession(userId) {
  try {
    sessionStorage.setItem(`ko_onboarding_dismissed_${userId}`, "1");
  } catch {}
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingBanner() {
  const { user, authChecked } = useSelector((s) => s.auth);
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [loginNumber, setLoginNumber] = useState(1); // 1 or 2
  const countedRef = useRef(false); // StrictMode guard

  useEffect(() => {
    if (!authChecked || !user || user.role !== "counselor") return;
    if (countedRef.current) return;
    countedRef.current = true;

    const userId = user._id;

    // If already dismissed in this browser session, stay hidden
    if (isDismissedThisSession(userId)) return;

    const seenBefore = getSeenCount(userId);

    // Already seen 2+ times → never show again
    if (seenBefore >= 2) return;

    // Increment the count for this login
    const newCount = incrementSeenCount(userId);
    setLoginNumber(newCount);
    setVisible(true);
  }, [authChecked, user]);

  const handleDismiss = () => {
    if (user?._id) dismissThisSession(user._id);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-2xl overflow-hidden shadow-xl border border-sky-200/60"
        >
          {/* ── Gradient header bar ─────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">
                  Welcome to your Counselor Dashboard
                  {loginNumber === 1 ? " 🎉" : " — quick reminder"}
                </p>
                <p className="text-sky-100 text-[11px] mt-0.5">
                  {loginNumber === 1
                    ? "Here's a quick tour of everything you can do here."
                    : "This guide won't appear again after this session."}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors shrink-0 ml-3"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>

          {/* ── Feature cards ───────────────────────────────────────────── */}
          <div className="bg-white px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <Icon size={16} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-800 font-semibold text-[12px] leading-tight">
                      {title}
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── CTA row ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100">
              <p className="text-slate-400 text-[11px]">
                Need the full walkthrough? Read the complete guide.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/counselor-dashboard/manual"
                  className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 text-[12px] font-semibold transition-colors"
                  onClick={handleDismiss}
                >
                  <BookOpen size={13} strokeWidth={2} />
                  Open Dashboard Manual
                  <ChevronRight size={12} strokeWidth={2.5} />
                </Link>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-slate-600 text-[12px] transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
