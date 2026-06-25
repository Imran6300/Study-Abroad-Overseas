"use client";

import { memo } from "react";
import { useWelcomeModal } from "@/hooks/useWelcomeModal";
import WelcomeModal from "./WelcomeModal";

function WelcomeModalController() {
  const { isOpen, hasMounted, dismiss, markConverted } = useWelcomeModal();

  if (!hasMounted) return null;

  return (
    <WelcomeModal
      isOpen={isOpen}
      onDismiss={dismiss}
      onConverted={markConverted}
    />
  );
}

export default memo(WelcomeModalController);
