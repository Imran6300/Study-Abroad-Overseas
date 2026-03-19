import FloatingCard from "./FloatingCard";
import { memo } from "react";
import Image from "next/image";

function HeroVisual() {
  return (
    <div className="relative flex justify-center items-center max-[1200px]:flex-col">
      {/* HERO IMAGE BOX */}
      <div
        className="
          w-[clamp(300px,35vw,480px)]
          h-[clamp(350px,40vw,520px)]
          bg-[rgba(255,255,255,0.22)]
          rounded-[28px]
          shadow-[0_25px_60px_rgba(0,0,0,0.12)]
          overflow-hidden relative
          mt-20
        "
      >
        {/* Preload the image for instant load */}

        <Image
          src="/newHeroImage.webp" // Now served from /public → super fast
          alt="Student"
          fill
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, 480px"
          placeholder="blur"
          blurDataURL="/newHeroImage.webp"
          className="
             object-cover
            rounded-[28px]
            animate-imgFloat
          "
        />
      </div>

      {/* FLOATING CARDS */}
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

export default memo(HeroVisual);
