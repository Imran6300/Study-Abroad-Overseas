"use client";
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { FaUniversity, FaPercentage } from "react-icons/fa";
import Image from "next/image";

export default function UniversityCard({
  rank,
  name,
  image,
  location,
  desc,
  students,
  acceptance,
  slug,
  logo,
}) {
  console.log(image);
  return (
    <div
      className="
        group relative 
        bg-white 
        border border-gray-200 
        rounded-2xl overflow-hidden 
        shadow-sm hover:shadow-xl
        transition-all duration-300 
        hover:-translate-y-1.5 hover:border-blue-200 
        flex flex-col
        h-[540px]
      "
    >
      {/* IMAGE SECTION */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <Image
          src={image || "https://placehold.net/600x600.png"}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 z-20">
          <div
            className="
              bg-blue-600 text-white 
              text-xs font-bold 
              px-3 py-1 rounded-full 
              shadow-md shadow-blue-300/40 
              flex items-center gap-1.5
            "
          >
            <FaUniversity className="text-sm" />
            <span>#{rank || "N/A"}</span>
          </div>
        </div>

        {logo && (
          <div className="absolute top-3 right-3 z-20">
            <div
              className="
                w-10 h-10 rounded-full overflow-hidden 
                border-2 border-white shadow-md bg-white p-1
              "
            >
              <Image
                src={logo}
                alt={`${name} logo`}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex flex-col flex-1 p-5">
        {/* Main text + stats, stretched to fill height */}
        <div className="flex flex-col flex-1 gap-3">
          <h3
            className="
              text-xl font-bold 
              text-gray-900 
              group-hover:text-blue-700 
              transition-colors duration-300 
              line-clamp-2
            "
          >
            {name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoLocationOutline className="text-blue-600 text-lg flex-shrink-0" />
            <span className="truncate">{location || "—"}</span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
            {desc || "No description available."}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-auto pt-2">
            <div
              className="
                flex items-center gap-3 
                bg-gray-50 rounded-xl p-3 border border-gray-100
              "
            >
              <MdOutlinePeopleOutline className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Students</p>
                <p className="font-semibold text-gray-900 text-base">
                  {students?.toLocaleString() || "—"}
                </p>
              </div>
            </div>

            <div
              className="
                flex items-center gap-3 
                bg-gray-50 rounded-xl p-3 border border-gray-100
              "
            >
              <FaPercentage className="text-green-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Acceptance</p>
                <p className="font-semibold text-gray-900 text-base">
                  {acceptance ? `${acceptance}%` : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA at absolute bottom of content area */}
        <Link
          href={`/universities/${slug}`}
          className="
            mt-5 inline-flex items-center justify-center gap-2 
            bg-blue-600 hover:bg-blue-700 
            text-white font-semibold 
            py-3 px-6 rounded-xl 
            transition-all duration-300 
            shadow-md hover:shadow-lg
            text-sm
          "
        >
          View Details
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
