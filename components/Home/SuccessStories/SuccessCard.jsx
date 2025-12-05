"use client";

const SuccessCard = ({ student }) => {
  return (
    <div
      className="
        w-full max-w-[550px]
        bg-white
        rounded-2xl
        p-8
        shadow-[0_10px_35px_rgba(0,0,0,0.08)]
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
        transition-all duration-300
        hover:-translate-y-2
        flex flex-col items-center
      "
    >
      {/* Image */}
      <div
        className="
          w-28 h-28 rounded-xl overflow-hidden
          shadow-lg
          mb-6
        "
      >
        <img
          src={student.image}
          alt={student.StuName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <h3 className="text-2xl font-semibold text-[#2F4F4F] tracking-tight">
        {student.StuName}
      </h3>

      {/* University */}
      <h5
        className="
          text-lg mt-1 font-semibold
          bg-gradient-to-r from-[#4169E1] to-[#32CD32]
          bg-clip-text text-transparent
        "
      >
        {student.UniName}
      </h5>

      {/* Course */}
      <p className="text-sm text-[#4169E1] font-medium mt-1">
        {student.Course}
      </p>

      {/* Description */}
      <p className="mt-5 text-gray-600 text-sm leading-6 text-center max-w-[420px]">
        {student.Description}
      </p>

      {/* Bottom Accent Bar */}
      <div
        className="
          w-16 h-1 mt-6 rounded-full
          bg-gradient-to-r from-[#4169E1] to-[#32CD32]
        "
      />
    </div>
  );
};

export default SuccessCard;
