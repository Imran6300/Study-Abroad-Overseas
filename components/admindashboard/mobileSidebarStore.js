"use client";

// Lightweight external store (no Context/Provider needed) so the
// hamburger button in DashboardHeader can open/close the drawer
// rendered by AdminSidebar, even though they are sibling components
// mounted independently on every admin page.
import { useEffect, useState } from "react";

let isOpen = false;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener(isOpen));
}

export function openMobileSidebar() {
  isOpen = true;
  emit();
}

export function closeMobileSidebar() {
  isOpen = false;
  emit();
}

export function toggleMobileSidebar() {
  isOpen = !isOpen;
  emit();
}

export function useMobileSidebarOpen() {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    listeners.add(setOpen);
    return () => listeners.delete(setOpen);
  }, []);

  return open;
}
