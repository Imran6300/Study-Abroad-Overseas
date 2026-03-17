"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";

export default function UniversitiesSlider({ items }) {
  const scrollRef = useRef(null);

  // Duplicate items 3 times
  const duplicated = [...items, ...items, ...items];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const singleWidth = container.scrollWidth / 3;

    // Start from middle copy
    container.scrollLeft = singleWidth;
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.firstElementChild?.firstElementChild;
    const gap = 24;
    const cardWidth = card?.offsetWidth || 300;

    container.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const singleWidth = container.scrollWidth / 3;

    if (container.scrollLeft <= 0) {
      container.scrollLeft = singleWidth;
    }

    if (container.scrollLeft >= singleWidth * 2) {
      container.scrollLeft = singleWidth;
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute top-1/2 -translate-y-1/2 z-20
bg-white/90 backdrop-blur-md shadow-md rounded-full
p-2 sm:p-3
left-2 sm:left-0 hidden sm:flex "
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" size={24} />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto no-scrollbar scroll-smooth h-full"
      >
        <div className="flex gap-6 px-4 sm:px-8 md:px-12">
          {duplicated.map((item, index) => (
            <div
              key={`${item.slug}-${index}`}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[400px]
max-w-[280px] sm:max-w-[320px] md:max-w-[400px] shrink-0 h-full"
            >
              <Card
                slug={item.slug}
                image={item.images?.[0]?.url}
                logo={item.logo?.url} // ← add this line
                name={item.name}
                location={`${item.city ? item.city + ", " : ""}${item.country}`}
                rank={item.qsRanking}
                desc={item.description}
                students={item.totalStudents}
                acceptance={item.acceptanceRate}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 -translate-y-1/2 z-20
bg-white/90 backdrop-blur-md shadow-md rounded-full
p-2 sm:p-3
right-2 sm:right-0
hidden sm:flex 
"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" size={24} />
      </button>
    </div>
  );
}
