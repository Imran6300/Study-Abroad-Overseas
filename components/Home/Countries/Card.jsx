// Card.jsx
"use client";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { CiStar } from "react-icons/ci";

export default function Card({
  rank,
  name,
  logo,
  image,
  location,
  desc,
  students,
  acceptance,
}) {
  return (
    <div
      className="
        relative bg-white rounded-2xl shadow-xl overflow-hidden
        w-full h-full flex flex-col
      "
    >
      {/* Rank Badge */}
      <span
        className="
          absolute top-2 sm:top-3 left-2 sm:left-3 z-20 bg-black text-white text-xs sm:text-sm
          px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow
        "
      >
        #{rank}
      </span>

      {/* Bigger Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-32 sm:h-40 md:h-48 object-cover pointer-events-none"
      />

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-3 sm:p-5">
        <div>
          {/* Logo + Name */}
          <div className="flex items-center mb-3 sm:mb-4 pointer-events-none">
            <img
              src={logo}
              className="
                w-10 sm:w-14 h-10 sm:h-14 rounded-full object-cover bg-white
                border-2 border-indigo-500 shadow-sm mr-2 sm:mr-3 flex-shrink-0
              "
            />
            <h5 className="text-indigo-900 font-semibold text-base sm:text-lg md:text-xl line-clamp-2 flex-1">
              {name}
            </h5>
          </div>

          {/* Location */}
          <div className="flex items-center mb-2 sm:mb-3">
            <IoLocationOutline className="mr-1 sm:mr-2 text-indigo-500 text-base sm:text-lg flex-shrink-0" />
            <span className="bg-gray-100 text-gray-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm truncate flex-1">
              {location}
            </span>
          </div>

          {/* Bigger Description */}
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
            {desc}
          </p>
        </div>

        {/* Stats + CTA */}
        <div className="mt-3 sm:mt-5 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            {/* Students */}
            <span className="flex items-center text-xs sm:text-sm w-full sm:w-auto">
              <MdOutlinePeopleOutline className="text-indigo-500 mr-1 text-base sm:text-lg flex-shrink-0" />
              <span className="bg-gray-100 text-gray-900 px-2 sm:px-3 py-1 rounded min-w-0 truncate flex-1 sm:flex-none">
                {students} students
              </span>
            </span>

            {/* Acceptance */}
            <span className="flex items-center text-xs sm:text-sm w-full sm:w-auto">
              <CiStar className="text-yellow-400 mr-1 text-base sm:text-lg flex-shrink-0" />
              <span className="bg-gray-100 text-gray-900 px-2 sm:px-3 py-1 rounded min-w-0 truncate flex-1 sm:flex-none">
                {acceptance} acceptance
              </span>
            </span>
          </div>

          {/* Button */}
          <a
            href="#"
            className="
              block w-full text-center font-semibold text-white 
              py-2 sm:py-2.5 rounded-full shadow-md transition-all duration-200
              hover:brightness-110 text-sm sm:text-base
            "
            style={{
              background: "linear-gradient(90deg, #6366f1, #818cf8)",
              pointerEvents: "auto",
            }}
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
