"use client";

import { useSelector } from "react-redux";
import type { ReactNode } from "react";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { authChecked } = useSelector((state: any) => state.auth);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
