"use client";

import { useState } from "react";

const SuccessCard = ({ student }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective w-full max-w-[550px] mx-auto h-[520px] sm:h-[560px]">
      <div
        className={`relative preserve-3d transition-transform duration-700 ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ================= FRONT ================= */}
        <div className="backface-hidden bg-white rounded-2xl p-8 shadow-[0_10px_35px_rgba(0,0,0,0.08)] flex flex-col items-center h-full">
          {/* Image */}
          <div className="w-28 h-28 rounded-xl overflow-hidden shadow-lg mb-6">
            <img
              src={student.image}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h3 className="text-2xl font-semibold text-[#2F4F4F] text-center">
            {student.name}
          </h3>

          {/* University */}
          <h5 className="text-lg mt-1 font-semibold bg-gradient-to-r from-[#4169E1] to-[#32CD32] bg-clip-text text-transparent text-center">
            {student.university}
          </h5>

          {/* Course */}
          <p className="text-sm text-[#4169E1] font-medium mt-1">
            {student.course}
          </p>

          {/* Meta */}
          <div className="mt-4 space-y-1 text-sm text-gray-600 text-center">
            <p>
              <strong>Country:</strong> {student.country}
            </p>
            <p>
              <strong>Visa:</strong> {student.visa}
            </p>
            <p>
              <strong>Scholarship:</strong> {student.scholarship}
            </p>
            <p>
              <strong>Year:</strong> {student.year}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setFlipped(true)}
            className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-[#4169E1] to-[#32CD32] text-white text-sm font-semibold hover:opacity-90 transition"
          >
            Read Story
          </button>

          {/* Accent */}
          <div className="w-16 h-1 mt-6 rounded-full bg-gradient-to-r from-[#4169E1] to-[#32CD32]" />
        </div>

        {/* ================= BACK ================= */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden bg-white rounded-2xl p-8 shadow-[0_10px_35px_rgba(0,0,0,0.1)] flex flex-col justify-between h-full overflow-hidden">
          <div>
            <h3 className="text-xl font-semibold text-[#2F4F4F] mb-4">
              {student.name}'s Experience
            </h3>

            <p className="text-gray-600 text-sm leading-6 line-clamp-6 sm:line-clamp-none">
              “{student.review}”
            </p>
          </div>

          <button
            onClick={() => setFlipped(false)}
            className="mt-8 self-center px-6 py-2 rounded-full border border-[#4169E1] text-[#4169E1] text-sm font-semibold hover:bg-[#4169E1] hover:text-white transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessCard;
