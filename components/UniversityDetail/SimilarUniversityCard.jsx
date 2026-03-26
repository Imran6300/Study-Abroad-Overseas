import Link from "next/link";

export default function SimilarUniversityCard({ uni }) {
  return (
    <Link href={`/universities/${uni.slug}`} className="block">
      <div
        className="
          bg-[#112240] border border-[#1E3A5F]
          rounded-xl overflow-hidden
          hover:border-[#4169E1]
          transition cursor-pointer
          flex flex-col
          h-full min-h-[220px]
        "
      >
        {/* IMAGE */}
        <div className="w-full h-32 sm:h-36 md:h-40 overflow-hidden">
          <img
            src={uni.image}
            alt={uni.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.net/600x600.png";
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
          <div>
            <h3
              className="
                text-[#CCD6F6] font-semibold
                text-sm sm:text-base
                mb-1
                leading-snug
                break-words
              "
            >
              {uni.name}
            </h3>

            <p
              className="
                text-xs sm:text-sm
                text-[#8892B0]
                leading-snug
                break-words
              "
            >
              {uni.location}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
