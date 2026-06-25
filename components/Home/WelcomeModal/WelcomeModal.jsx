"use client";

import { useEffect, useRef, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuthUser } from "@/store/authSelectors";
import UserTypeCard from "./UserTypeCard";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.97,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const STUDENT_CARD = {
  icon: "🎓",
  eyebrow: "Student",
  headline: "Track Your Study Abroad Journey",
  description:
    "Get a free dashboard to manage applications, documents, visas, and scholarships — all in one place.",
  benefits: [
    "Free account — no credit card",
    "Track applications in real time",
    "Upload & organise documents",
    "Monitor visa progress",
    "Receive scholarship updates",
  ],
  ctaLabel: "Create Free Account →",
  ctaSubtext: "Takes less than 60 seconds",
  accentFrom: "#4169e1",
  accentTo: "#32cd32",
  badgeLabel: "Free Forever",
  badgeColor: "#32cd32",
};

const CONSULTANT_CARD = {
  icon: "🏢",
  eyebrow: "Education Consultant / Agency",
  headline: "Grow Your Consultancy with a CRM",
  description:
    "Apply to become a Khizar Overseas partner and get a branded CRM dashboard to manage your students and agencies.",
  benefits: [
    "Dedicated CRM dashboard",
    "Manage multiple students & pipelines",
    "White-labelled for your agency",
    "Access to exclusive partner network",
    "Approval-gated — quality assured",
  ],
  ctaLabel: "Apply to Become a Partner →",
  ctaSubtext: "Reviewed within 48 hours",
  accentFrom: "#7c3aed",
  accentTo: "#db2777",
  badgeLabel: "Apply to Join",
  badgeColor: "#7c3aed",
};

function WelcomeModal({ isOpen, onDismiss, onConverted }) {
  const router = useRouter();
  const user = useSelector(selectAuthUser);
  const dialogRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onDismiss]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      firstFocusRef.current?.focus();
    });

    const trapFocus = (e) => {
      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", trapFocus);
    };
  }, [isOpen]);

  const handleStudentClick = useCallback(() => {
    onConverted();
    if (user) {
      router.push("/dashboard/user");
    } else {
      router.push("/signup");
    }
  }, [user, router, onConverted]);

  const handleConsultantClick = useCallback(() => {
    onConverted();
    router.push("/partners");
  }, [router, onConverted]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onDismiss();
    },
    [onDismiss],
  );

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-label="Welcome to Khizar Overseas — who are you?"
        >
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />

          <motion.div
            ref={dialogRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full bg-[#FAFAFA] rounded-t-3xl sm:rounded-2xl sm:max-w-3xl sm:w-full max-h-[92svh] sm:max-h-[90vh] overflow-y-auto outline-none"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#FAFAFA]/95 backdrop-blur-md px-6 sm:px-8 pt-6 pb-4 border-b border-gray-200/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full mb-3">
                    <span className="text-green-500 text-xs">●</span>
                    <span className="text-[11px] font-semibold text-green-700 tracking-wide">
                      Trusted by 50,000+ students across India
                    </span>
                  </div>
                  <h2
                    ref={firstFocusRef}
                    className="text-[1.45rem] sm:text-[1.65rem] font-extrabold text-gray-900 leading-tight tracking-tight"
                    tabIndex={-1}
                  >
                    Welcome to Khizar Overseas
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Tell us who you are so we can show you the right experience.
                  </p>
                </div>
                <button
                  onClick={onDismiss}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 1L13 13M13 1L1 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="px-6 sm:px-8 pt-5 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UserTypeCard
                {...STUDENT_CARD}
                index={0}
                onSelect={handleStudentClick}
              />
              <UserTypeCard
                {...CONSULTANT_CARD}
                index={1}
                onSelect={handleConsultantClick}
              />
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 text-center">
              <button
                onClick={onDismiss}
                className="text-[12px] text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 rounded"
              >
                I&apos;m just browsing, continue to site →
              </button>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="flex -space-x-1.5">
                  {["🧑🏽‍🎓", "👩🏻‍🎓", "🧑🏾‍🎓", "👩🏼‍💼"].map((emoji, i) => (
                    <span
                      key={i}
                      className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[11px] select-none"
                      aria-hidden="true"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-600">1,200+</span>{" "}
                  students joined this month
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default memo(WelcomeModal);
