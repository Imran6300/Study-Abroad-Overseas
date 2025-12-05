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
          absolute top-3 left-3 z-20 bg-black text-white text-sm
          px-3 py-1.5 rounded-full shadow
        "
      >
        #{rank}
      </span>

      {/* Bigger Image */}
      <img
        src={image}
        alt={name}
        className="w-full object-cover pointer-events-none"
        style={{
          height: "190px", // ⬅ Increased height
          objectPosition: "center",
        }}
      />

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-5">
        <div>
          {/* Logo + Name */}
          <div className="flex items-center mb-4 pointer-events-none">
            <img
              src={logo}
              className="
                w-14 h-14 rounded-full object-cover bg-white
                border-2 border-indigo-500 shadow-sm mr-3
              "
            />
            <h5 className="text-indigo-900 font-semibold text-xl">{name}</h5>
          </div>

          {/* Location */}
          <div className="flex items-center mb-3">
            <IoLocationOutline className="mr-2 text-indigo-500 text-xl" />
            <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded text-sm">
              {location}
            </span>
          </div>

          {/* Bigger Description */}
          <p
            className="text-gray-600 text-sm leading-snug"
            style={{
              WebkitLineClamp: 4,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxHeight: "4.8rem",
            }}
          >
            {desc}
          </p>
        </div>

        {/* Stats + CTA */}
        <div className="mt-5">
          <div className="flex items-center gap-6 mb-4">
            {/* Students */}
            <span className="flex items-center text-sm">
              <MdOutlinePeopleOutline className="text-indigo-500 mr-1 text-xl" />
              <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded">
                {students} students
              </span>
            </span>

            {/* Acceptance */}
            <span className="flex items-center text-sm">
              <CiStar className="text-yellow-400 mr-1 text-xl" />
              <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded">
                {acceptance} acceptance
              </span>
            </span>
          </div>

          {/* Button */}
          <a
            href="#"
            className="
              block w-full text-center font-semibold text-white 
              py-2.5 rounded-full shadow-md transition-all duration-200
              hover:brightness-110
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
