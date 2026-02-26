"use client";
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import Image from "next/image";

export default function UniversityCard({
  rank,
  name,
  logo,
  image,
  location,
  desc,
  students,
  acceptance,
  slug,
}) {
  return (
    <div
      className="
        group relative bg-white rounded-2xl overflow-hidden
    shadow-md hover:shadow-xl transition-shadow duration-300
    flex flex-col h-full  mb-3
      "
    >
      {/* Rank badge */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <span
          className="
            bg-black/90 text-white text-xs sm:text-sm font-medium
            px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm
          "
        >
          #{rank}
        </span>
      </div>

      {/* Hero image – prevents layout shift with aspect ratio */}
      <div className="relative aspect-[4/3] sm:aspect-[5/3] md:aspect-[16/9] bg-gray-100">
        <Image
          src={image}
          alt={name}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="
            absolute inset-0 size-full object-cover
            transition-transform duration-500 group-hover:scale-105
          "
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Logo + Name */}
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0">
            <img
              src={logo}
              alt={`${name} logo`}
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              className="
                size-12 sm:size-14 rounded-full object-cover
                bg-white border-2 border-indigo-400/50 shadow-sm
              "
            />
          </div>
          <h3 className="font-semibold text-indigo-950 text-lg sm:text-xl leading-tight line-clamp-2">
            {name}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
          <IoLocationOutline className="text-indigo-500 shrink-0 text-lg" />
          <span className="bg-gray-100/80 px-2.5 py-1 rounded text-xs sm:text-sm truncate max-w-[180px] sm:max-w-none">
            {location}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
          {desc}
        </p>

        {/* Stats + CTA – pushed to bottom with mt-auto */}
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5">
              <MdOutlinePeopleOutline className="text-indigo-500 text-lg" />
              <span className="bg-gray-50 px-2.5 py-1 rounded text-xs font-medium">
                {students} Students
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CiStar className="text-amber-400 text-lg" />
              <span className="bg-gray-50 px-2.5 py-1 rounded text-xs font-medium">
                {acceptance} Acceptance Rate
              </span>
            </div>
          </div>

          <Link
            href={`/universities/${slug}`}
            className="
              block w-full text-center font-semibold text-white
              py-2.5 rounded-xl text-sm sm:text-base
              bg-gradient-to-r from-indigo-500 to-indigo-600
              hover:from-indigo-600 hover:to-indigo-700
              transition-all duration-200 shadow-md hover:shadow-lg
              active:scale-98
            "
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
