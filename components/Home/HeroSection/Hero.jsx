import { memo } from "react";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";
import FloatingOrb from "./FloatingOrb";
import MobileHero from "./MobileHero";
import WelcomeModalController from "../WelcomeModal/WelcomeModalController";

function Hero() {
  return (
    <div
      className="
          min-h-screen w-full overflow-hidden relative
          flex items-center justify-center
          bg-[radial-gradient(circle_at_20%_20%,#eef4ff,#e9f8ff,#f8f5ff)]
          font-[Poppins]
        "
    >
      {/* Welcome modal — portal-rendered, only fires on first visit */}
      <WelcomeModalController />

      <div className="hidden md:block">
        <FloatingOrb type="blue" />
        <FloatingOrb type="green" />
        <FloatingOrb type="mixed" />
      </div>

      <div className="w-full block md:hidden relative z-[3]">
        <MobileHero />
      </div>

      <div className="hidden md:flex justify-center w-full relative z-[3]">
        <div
          style={{
            transform: "scale(0.9)",
            transformOrigin: "center top",
          }}
          className="
              grid
              w-[90%] max-w-[1500px]
              grid-cols-[1.1fr_1fr]
              gap-[3rem]
              items-center
            "
        >
          <HeroContent />
          <HeroVisual />
        </div>
      </div>
    </div>
  );
}

export default memo(Hero);
