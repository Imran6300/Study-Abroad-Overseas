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
  // ✅ Fallbacks
  const fallbackImage = "https://placehold.co/600x400?text=University";
  const fallbackLogo = "https://placehold.co/100x100?text=Logo";

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
          src={image || fallbackImage}
          alt={name || "University"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        {/* Rank Badge */}
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md shadow-blue-300/40 flex items-center gap-1.5">
            <FaUniversity className="text-sm" />
            <span>#{rank || "N/A"}</span>
          </div>
        </div>

        {/* Logo */}
        <div className="absolute top-3 right-3 z-20">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-white p-1">
            <Image
              src={logo || fallbackLogo}
              alt={`${name || "University"} logo`}
              width={40}
              height={40}
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = fallbackLogo;
              }}
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-col flex-1 gap-3">
          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
            {name || "Unknown University"}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoLocationOutline className="text-blue-600 text-lg flex-shrink-0" />
            <span className="truncate">
              {location || "Location not available"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
            {desc || "No description available."}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-auto pt-2">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <MdOutlinePeopleOutline className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Students</p>
                <p className="font-semibold text-gray-900 text-base">
                  {students || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
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

        {/* CTA */}
        <Link
          href={slug ? `/programs/universities/${slug}` : "#"}
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
