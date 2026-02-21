"use client";

import { useState } from "react";
import Image from "next/image";
import { FaUserGraduate } from "react-icons/fa6";

const SuccessCard = ({ student }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective w-full max-w-[550px] mx-auto h-[420px] sm:h-[500px]">
      <div
        className={`relative preserve-3d transition-transform duration-700 h-full ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ================= FRONT ================= */}
        <div className="backface-hidden bg-white rounded-2xl p-5 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.08)] flex flex-col items-center h-full overflow-hidden">
          {/* Image */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-lg mb-4 sm:mb-6 bg-gray-100 flex items-center justify-center">
            {student.photo?.url ? (
              <Image
                src={student.photo.url}
                alt={student.studentName}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserGraduate className="text-[#4169E1] text-4xl sm:text-6xl" />
            )}
          </div>

          {/* Name */}
          <h3 className="text-lg sm:text-2xl font-semibold text-[#2F4F4F] text-center">
            {student.studentName}
          </h3>

          {/* University */}
          <h5 className="text-sm sm:text-lg mt-1 font-semibold bg-gradient-to-r from-[#4169E1] to-[#32CD32] bg-clip-text text-transparent text-center">
            {student.university}
          </h5>

          {/* Course */}
          <p className="text-xs sm:text-sm text-[#4169E1] font-medium mt-1">
            {student.course}
          </p>

          {/* Meta */}
          <div className="mt-3 sm:mt-4 space-y-1 text-xs sm:text-sm text-gray-600 text-center">
            <p>
              <strong>Country:</strong> {student.country}
            </p>
            <p>
              <strong>Visa:</strong> {student.visaStatus}
            </p>
            <p>
              <strong>Scholarship:</strong>{" "}
              {student.scholarship || "Not Mentioned"}
            </p>
            <p>
              <strong>Year:</strong> {student.year}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setFlipped(true)}
            className="mt-6 px-5 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#4169E1] to-[#32CD32] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition"
          >
            Read Story
          </button>

          {/* Accent */}
          <div className="w-12 sm:w-16 h-1 mt-4 sm:mt-6 rounded-full bg-gradient-to-r from-[#4169E1] to-[#32CD32]" />
        </div>

        {/* ================= BACK ================= */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden bg-white rounded-2xl p-5 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.1)] flex flex-col h-full overflow-hidden">
          <h3 className="text-base sm:text-xl font-semibold text-[#2F4F4F] mb-3 sm:mb-4">
            {student.studentName}'s Experience
          </h3>

          <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
            <p className="text-gray-600 text-xs sm:text-sm leading-5 sm:leading-6 break-words">
              “{student.fullDescription}”
            </p>
          </div>

          <button
            onClick={() => setFlipped(false)}
            className="mt-4 sm:mt-8 self-center px-5 sm:px-6 py-2 rounded-full border border-[#4169E1] text-[#4169E1] text-xs sm:text-sm font-semibold hover:bg-[#4169E1] hover:text-white transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessCard;
