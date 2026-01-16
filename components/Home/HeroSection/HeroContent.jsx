"use client";

import HeroSearch from "./HeroSearch";
import TextType from "../../Animations/TextType";
import { LazyMotion, m } from "framer-motion";
import { memo } from "react";
import Link from "next/link";

// Faster, snappier transition
const transition = { duration: 0.5, ease: "easeOut" };

function HeroContent() {
  return (
    <LazyMotion
      features={() => import("framer-motion").then((mod) => mod.domAnimation)}
    >
      <div
        className="
          flex flex-col gap-[1rem] z-[5]
          pt-[6rem]
          max-[1200px]:items-center
          max-[1200px]:pt-[5rem]
          max-[768px]:pt-[4.5rem]
          max-[480px]:pt-[4rem]
        "
      >
        {/* SEARCH BAR */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="my-[1.5rem] w-full max-w-[560px] max-[768px]:max-w-full"
        >
          <HeroSearch />
        </m.div>

        {/* TITLE */}
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="
            font-extrabold text-[#111]
            leading-[1.15]
            text-[clamp(2.5rem,5vw,4rem)]
            max-[768px]:text-center
          "
        >
          Build Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4169e1] to-[#32cd32]">
            International Future
          </span>
          <br />
          with Confidence.
        </m.h1>

        {/* SUBTITLE */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.3 }}
          className="
            text-[#444] leading-[1.7]
            w-[85%]
            text-[clamp(1rem,1.2vw,1.3rem)]
            max-[1200px]:w-full
            max-[768px]:text-center
            max-[480px]:text-[0.95rem] max-[480px]:leading-[1.5]
          "
        >
          Your trusted partner for admissions, student visas, scholarships,
          career planning, and global opportunities — all in one place.
        </m.p>

        {/* ROTATING TEXT */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.4 }}
          className="
            text-[#4169e1] font-semibold
            text-[clamp(1rem,1.2vw,1.4rem)]
            max-[768px]:text-center
          "
        >
          <TextType
            text={[
              "Study in 100+ Countries",
              "5000+ Students Placed Successfully",
              "Top 200 University Partners",
              "$75M+ Scholarship Grants Approved",
            ]}
            typingSpeed={40}
            pauseDuration={1600}
            showCursor={true}
            cursorCharacter="▋"
          />
        </m.div>

        {/* BUTTONS */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.5 }}
          className="
            flex gap-[1rem] mt-[0.8rem]
            flex-wrap justify-start
            max-[1200px]:justify-center
            max-[480px]:flex-col max-[480px]:gap-[0.8rem]
          "
        >
          <Link
            href={"/assessment"}
            className="
              py-[0.95rem] px-[2.2rem]
              rounded-[14px] font-bold text-white
              bg-gradient-to-r from-[#4169e1] to-[#32cd32]
              shadow-[0_10px_28px_rgba(65,105,225,0.2)]
              transition-all duration-300
              hover:-translate-y-[3px] hover:shadow-[0_15px_30px_rgba(65,105,225,0.3)]
              max-[480px]:w-full
            "
          >
            Get Free Consultation
          </Link>

          <button
            className="
              py-[0.95rem] px-[2.2rem]
              rounded-[14px] font-semibold
              border-2 border-[#4169e1] text-[#4169e1]
              transition-all duration-300
              hover:bg-[#4169e1] hover:text-white
              max-[480px]:w-full
            "
          >
            <a href="/all-countries">Explore Destinations</a>
          </button>
        </m.div>
      </div>
    </LazyMotion>
  );
}

export default memo(HeroContent);
