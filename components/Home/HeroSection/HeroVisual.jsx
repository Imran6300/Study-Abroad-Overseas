"use client";

import FloatingCard from "./FloatingCard";

export default function HeroVisual() {
  return (
    <div
      className="
        relative flex justify-center items-center
        max-[1200px]:flex-col
      "
    >
      {/* HERO IMAGE BOX */}
      <div
        className="
          w-[clamp(300px,35vw,480px)]
          h-[clamp(350px,40vw,520px)]
          bg-[rgba(255,255,255,0.22)]
          backdrop-blur-[20px]
          rounded-[28px]
          shadow-[0_25px_60px_rgba(0,0,0,0.12)]
          overflow-hidden relative
          mt-20
        "
      >
        <img
          src="HeroImage.png"
          alt="Student"
          className="
            absolute top-0 left-0 w-full h-full object-cover
            rounded-[28px]
            animate-imgFloat
          "
        />
      </div>

      {/* FLOATING CARDS — hidden on <=1200px exactly like original */}
      <FloatingCard
        position="top-[12%] left-[-5%]"
        strong="98.7%"
        text="Visa Approval Rate"
      />

      <FloatingCard
        position="bottom-[15%] right-[-3%]"
        strong="4.9★"
        text="Student Satisfaction"
      />

      <FloatingCard
        position="top-[45%] left-[-10%]"
        strong="24/7"
        text="Expert Guidance"
      />
    </div>
  );
}
