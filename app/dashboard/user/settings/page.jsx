"use client";

import { motion } from "framer-motion";
import SettingsPanel from "@/components/userdashboard/SettingsPanel";

export default function SettingsPage() {
  return (
    <div className="min-h-screen space-y-10 pt-16 sm:pt-5 text-white">
      <SettingsPanel />
    </div>
  );
}
