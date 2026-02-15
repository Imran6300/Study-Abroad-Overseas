"use client";

import CircularGallery from "./CircularGalary";
import Card from "./Card";
import { useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchUniversities } from "@/store/universitySlice";

const Countries = () => {
  const dispatch = useDispatch();

  const scrollRef = useRef(null);
  const universities = useSelector((state) => state.universities.list);

  useEffect(() => {
    if (universities.length === 0) {
      dispatch(fetchUniversities());
    }
  }, [dispatch, universities.length]);

  // ✅ Top 10 inside component
  const Top10 = useMemo(() => {
    return universities
      .filter((uni) => uni.qsRanking && uni.qsRanking <= 10)

      .sort((a, b) => a.qsRanking - b.qsRanking);
  }, [universities]);

  // ✅ Infinite scroll items
  const infiniteItems = useMemo(() => {
    return [...Top10, ...Top10, ...Top10];
  }, [Top10]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
    }
  }, [Top10]);

  return (
    <div className="min-h-[90vh] w-full bg-[#f5f7ff] flex flex-col items-center pb-8 sm:pb-16">
      <div className="w-full text-center mb-5 sm:mb-8 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2B4FFF] pt-3 sm:pt-6">
          Top Universities
        </h1>

        <p className="mt-2 text-gray-700 text-xs sm:text-sm md:text-base font-medium">
          Partnered With World-Class Institutions Around the Globe
        </p>

        <div className="mx-auto mt-3 sm:mt-4 w-12 sm:w-16 h-1 rounded-full bg-[#2B4FFF]/80" />
      </div>

      {/* MOBILE */}
      <div
        ref={scrollRef}
        className="md:hidden w-full overflow-x-scroll no-scrollbar pb-8"
      >
        <div className="flex gap-4 px-4 w-max">
          {infiniteItems.map((item, index) => (
            <div
              key={`${item.slug}-${index}`}
              className="min-w-[280px] max-w-[280px] shrink-0"
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

      {/* DESKTOP */}
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
