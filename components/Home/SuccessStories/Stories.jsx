"use client";

import SuccessCard from "./SuccessCard";
import { Data } from "./SuccessData";
import FadeContent from "../../Animations/FadeContent";

const Stories = () => {
  return (
    <section className="min-h-screen w-full bg-[#f5f7ff] py-16 px-6 flex flex-col items-center">
      {/* Heading */}
      <FadeContent blur duration={500} easing="ease-out" initialOpacity={0}>
        <div className="text-center mb-14">
          <h1
            className="
      text-3xl md:text-4xl lg:text-5xl 
      font-extrabold text-[#4169E1]
    "
          >
            Success Stories
          </h1>

          <p className="text-[#2F4F4F] mt-2 text-base md:text-lg">
            Real journeys. Real transformations.
          </p>

          <div
            className="
      w-24 h-[3px] mt-3 rounded-full mx-auto
      bg-gradient-to-r from-[#4169E1] to-[#32CD32]
    "
          />
        </div>
      </FadeContent>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-[1200px] w-full">
        {Data.map((student) => (
          <FadeContent
            key={student.id}
            blur
            duration={600}
            easing="ease-out"
            initialOpacity={0}
          >
            <SuccessCard student={student} />
          </FadeContent>
        ))}
      </div>
    </section>
  );
};

export default Stories;
