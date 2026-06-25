"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ko_welcome_seen";
const COOLDOWN_DAYS = 30;

export function useWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      }

      const stored = JSON.parse(raw);

      if (stored.converted) return;

      if (stored.dismissedAt) {
        const daysSince =
          (Date.now() - stored.dismissedAt) / (1000 * 60 * 60 * 24);
        if (daysSince >= COOLDOWN_DAYS) {
          const timer = setTimeout(() => setIsOpen(true), 800);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ dismissedAt: Date.now(), converted: false }),
      );
    } catch {}
  }, []);

  const markConverted = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ convertedAt: Date.now(), converted: true }),
      );
    } catch {}
  }, []);

  return { isOpen, hasMounted, dismiss, markConverted };
}
