"use client";

import { useEffect, useState } from "react";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";
import FloatingOrb from "./FloatingOrb";
import MobileHero from "./MobileHero";

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="
        min-h-screen w-full overflow-hidden relative flex items-center justify-center
        bg-[radial-gradient(circle_at_20%_20%,#eef4ff,#e9f8ff,#f8f5ff)]
        font-[Poppins]
      "
    >
      {/* ⭐ DESKTOP ONLY ORBS */}
      <div className="hidden md:block">
        <FloatingOrb type="blue" />
        <FloatingOrb type="green" />
        <FloatingOrb type="mixed" />
      </div>

      {/* ⭐ DESKTOP ONLY MOUSE GLOW */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300 hidden md:block"
        style={{
          background: `radial-gradient(
            550px at ${mouse.x}px ${mouse.y}px,
            rgba(65,105,225,0.18),
            transparent 65%
          )`,
        }}
      />

      {/* ⭐ MOBILE HERO SECTION */}
      <div className="w-full block md:hidden relative z-[3]">
        <MobileHero />
      </div>

      {/* ⭐ DESKTOP GRID HERO */}
      <div
        className="
          hidden md:grid 
          w-[90%] max-w-[1500px]
          grid-cols-[1.1fr_1fr] gap-[3rem]
          items-center relative z-[3]
        "
      >
        <HeroContent />
        <HeroVisual />
      </div>
    </div>
  );
}
