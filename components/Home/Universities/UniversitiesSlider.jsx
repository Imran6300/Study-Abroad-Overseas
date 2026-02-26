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

    const cardWidth = 420;
    const gap = 24;
    const amount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
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
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
        bg-white shadow-lg rounded-full p-3 
        hover:bg-gray-100 transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto no-scrollbar scroll-smooth h-full"
      >
        <div className="flex gap-6 px-12">
          {duplicated.map((item, index) => (
            <div
              key={`${item.slug}-${index}`}
              className="min-w-[400px] max-w-[400px] shrink-0 h-full"
            >
              <Card
                slug={item.slug}
                image={item.images?.[0]?.url || item.logo?.url}
                logo={item.logo?.url}
                name={item.name}
                location={`${item.city}, ${item.country}`}
                rank={item.qsRanking}
                desc={item.description}
                students={item.totalStudents?.toLocaleString() || "—"}
                acceptance={
                  item.acceptanceRate ? `${item.acceptanceRate}%` : "—"
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
        bg-white shadow-lg rounded-full p-3 
        hover:bg-gray-100 transition"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
