"use client";

import { useEffect, useState, memo } from "react";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";
import FloatingOrb from "./FloatingOrb";
import MobileHero from "./MobileHero";
import { LazyMotion, domAnimation } from "framer-motion";

function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMouse({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div
        className="
          min-h-screen w-full overflow-hidden relative
          flex items-center justify-center
          bg-[radial-gradient(circle_at_20%_20%,#eef4ff,#e9f8ff,#f8f5ff)]
          font-[Poppins]
        "
      >
        {/* DESKTOP ORBS */}
        <div className="hidden md:block">
          <FloatingOrb type="blue" />
          <FloatingOrb type="green" />
          <FloatingOrb type="mixed" />
        </div>

        {/* DESKTOP MOUSE GLOW – Optimized with RAF */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background: `radial-gradient(
              550px at ${mouse.x}px ${mouse.y}px,
              rgba(65,105,225,0.18),
              transparent 65%
            )`,
          }}
        />

        {/* MOBILE HERO */}
        <div className="w-full block md:hidden relative z-[3]">
          <MobileHero />
        </div>

        {/* DESKTOP HERO – 90% Scale */}
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
    </LazyMotion>
  );
}

export default memo(Hero);
