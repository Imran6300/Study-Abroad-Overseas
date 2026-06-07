"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import styles
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";

export default function UniversitiesSlider({ items }) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Custom Navigation Buttons */}
      <div className="swiper-button-prev-custom absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white p-3 rounded-full shadow-md hidden md:flex">
        <ChevronLeft />
      </div>

      <div className="swiper-button-next-custom absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white p-3 rounded-full shadow-md hidden md:flex">
        <ChevronRight />
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1.2}
        loop={true} // ✅ safe (Swiper handles internally, not SEO issue)
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.5,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 3.5,
          },
        }}
        className="px-4 sm:px-8  md:px-12 py-4 "
      >
        {items.map((item) => (
          <SwiperSlide key={item.slug}>
            <Card
              slug={item.slug}
              image={item.images?.[0]?.url}
              logo={item.logo?.url}
              name={item.name}
              location={`${item.city ? item.city + ", " : ""}${item.country?.name}`}
              rank={item.qsRanking}
              desc={item.description}
              students={item.totalStudents}
              acceptance={item.acceptanceRate}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
