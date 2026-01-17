// Countries.jsx
"use client";

import CircularGallery from "./CircularGalary";
import { universityItems } from "./TopUniversitiesData";
import Card from "./Card";
import { useEffect, useRef } from "react";

const Top10 = universityItems.filter((item) => item.rank <= 10);

const infiniteItems = [...Top10, ...Top10, ...Top10];

const Countries = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
    }
  }, []);

  return (
    <div
      className="
        min-h-[90vh] w-full bg-[#f5f7ff] 
        flex flex-col items-center 
        pb-8 sm:pb-16
      "
    >
      {/* Top Heading */}
      <div className="w-full text-center mb-5 sm:mb-8 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2B4FFF] pt-3 sm:pt-6">
          Top Universities
        </h1>

        <p className="mt-2 text-gray-700 text-xs sm:text-sm md:text-base font-medium">
          Partnered With World-Class Institutions Around the Globe
        </p>

        <div className="mx-auto mt-3 sm:mt-4 w-12 sm:w-16 h-1 rounded-full bg-[#2B4FFF]/80" />
      </div>

      {/* ✅ MOBILE: Horizontal Scroll */}
      {/* ✅ MOBILE: Infinite Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="md:hidden w-full overflow-x-scroll no-scrollbar pb-8"
      >
        <div
          className="
      flex gap-4 px-4
      w-max
    "
        >
          {infiniteItems.map((item, index) => (
            <div
              key={`${item.slug}-${index}`}
              className="min-w-[280px] max-w-[280px] shrink-0"
            >
              <Card {...item} />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ DESKTOP ONLY: Circular Gallery */}
      <div className="hidden md:block w-full px-4">
        <CircularGallery
          items={Top10}
          cardWidth={400}
          borderRadius={5}
          autoSpeed={1}
          scrollEase={0.8}
        />
      </div>
    </div>
  );
};

export default Countries;
